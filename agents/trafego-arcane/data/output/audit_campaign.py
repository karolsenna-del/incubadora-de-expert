#!/usr/bin/env python3
# Auditoria de conformidade Andromeda — varredura completa (não amostra).
import json, urllib.request, urllib.parse, urllib.error

env = {}
for line in open('data/.env'):
    line = line.strip()
    if '=' in line and not line.startswith('#'):
        k, v = line.split('=', 1); env[k.strip()] = v.strip()
TOKEN = env['META_TOKEN']; V = env.get('META_API_VERSION', 'v21.0')
PAGE = env['META_PAGE']; IG = env['META_IG']; PIXEL = env['META_PIXEL']
GRAPH = f"https://graph.facebook.com/{V}"

def get(path, fields):
    url = f"{GRAPH}/{path}?" + urllib.parse.urlencode({'fields': fields, 'access_token': TOKEN})
    try:
        with urllib.request.urlopen(url, timeout=60) as r:
            return json.loads(r.read())
    except urllib.error.HTTPError as e:
        return {'__error__': e.read().decode().replace(TOKEN, '[TOKEN]')}

b = json.load(open('data/output/campaign_build.json'))
CID = b['campaign']
P, F = [], []
def chk(cond, label): (P if cond else F).append(label)

# ---- CAMPANHA ----
c = get(CID, "name,objective,status,effective_status,bid_strategy,special_ad_categories,buying_type,daily_budget,is_adset_budget_sharing_enabled,spend_cap")
print("CAMPANHA:", json.dumps(c, ensure_ascii=False))
chk(c.get('objective') == 'OUTCOME_SALES', "objective = OUTCOME_SALES (venda)")
chk(c.get('bid_strategy') == 'LOWEST_COST_WITHOUT_CAP', "bid_strategy = LOWEST_COST_WITHOUT_CAP (sem CPA máx)")
chk(str(c.get('is_adset_budget_sharing_enabled')).lower() == 'true', "partilha 20% ativa")
chk(c.get('daily_budget') is None, "ABO (sem orçamento na campanha)")
chk(c.get('buying_type') == 'AUCTION', "buying_type = AUCTION")
chk(not c.get('special_ad_categories'), "special_ad_categories vazio")
chk(c.get('effective_status') == 'ACTIVE', f"campanha ACTIVE (atual: {c.get('effective_status')})")

# ---- ADSETS ----
for name, aid in b['adsets'].items():
    a = get(aid, "name,status,effective_status,daily_budget,billing_event,optimization_goal,destination_type,promoted_object,targeting,attribution_spec,bid_amount")
    po = a.get('promoted_object', {}) or {}
    tg = a.get('targeting', {}) or {}
    asp = a.get('attribution_spec', []) or []
    chk(a.get('daily_budget') == '8300', f"[{name}] daily_budget R$83")
    chk(a.get('billing_event') == 'IMPRESSIONS', f"[{name}] billing IMPRESSIONS")
    chk(a.get('optimization_goal') == 'OFFSITE_CONVERSIONS', f"[{name}] optimization OFFSITE_CONVERSIONS")
    chk(a.get('destination_type') == 'WEBSITE', f"[{name}] destination WEBSITE")
    chk(po.get('pixel_id') == PIXEL and po.get('custom_event_type') == 'PURCHASE', f"[{name}] pixel correto + evento PURCHASE")
    chk(tg.get('geo_locations', {}).get('countries') == ['BR'], f"[{name}] geo = Brasil")
    chk(tg.get('targeting_automation', {}).get('advantage_audience') == 1, f"[{name}] Advantage+ Audience ON")
    chk('publisher_platforms' not in tg, f"[{name}] Advantage+ Placements (sem posicionamento manual)")
    chk(not a.get('bid_amount'), f"[{name}] sem CPA máximo")
    chk(any(x.get('event_type') == 'CLICK_THROUGH' and x.get('window_days') == 7 for x in asp), f"[{name}] atribuição 7d-clique")
    if name == 'ADV_Puro':
        chk('flexible_spec' not in tg, f"[{name}] controle puro (sem sugestões)")
    else:
        ints = []
        for fs in tg.get('flexible_spec', []):
            ints += [i.get('id') for i in fs.get('interests', [])]
        chk(len(ints) >= 1, f"[{name}] cluster com sugestões ({len(ints)} interesses: {ints})")
    chk(a.get('effective_status') == 'ACTIVE', f"[{name}] ACTIVE (atual: {a.get('effective_status')})")

# ---- CREATIVES ----
for cname, crid in b['creatives'].items():
    cr = get(crid, "name,object_story_spec,degrees_of_freedom_spec")
    oss = cr.get('object_story_spec', {}) or {}
    data = oss.get('video_data') or oss.get('link_data') or {}
    cta = data.get('call_to_action', {}) or {}
    link = (cta.get('value', {}) or {}).get('link') or data.get('link') or ''
    dof = (cr.get('degrees_of_freedom_spec', {}) or {}).get('creative_features_spec', {}) or {}
    igid = oss.get('instagram_user_id') or oss.get('instagram_actor_id')
    chk(oss.get('page_id') == PAGE, f"[{cname}] página Euriler")
    chk(igid == IG, f"[{cname}] identidade @euriler")
    chk(bool(cta.get('type')), f"[{cname}] tem CTA")
    chk('xcod' in link and 'utm_campaign' in link, f"[{cname}] link UTMify completo")
    chk('standard_enhancements' not in dof, f"[{cname}] sem standard_enhancements")

# ---- ADS ----
dist = {}
disapproved = []
for ad in b['ads']:
    a = get(ad['id'], "name,effective_status")
    s = a.get('effective_status', '?')
    dist[s] = dist.get(s, 0) + 1
    if s in ('DISAPPROVED', 'WITH_ISSUES'):
        disapproved.append((ad['name'], ad['adset'], s))
print("\nADS effective_status:", dist)
chk(sum(dist.values()) == 27, f"27 anúncios existem ({sum(dist.values())})")
chk(not disapproved, f"nenhum anúncio reprovado ({len(disapproved)} com problema)")

print("\n" + "=" * 55)
print(f"RESULTADO:  {len(P)} conformes  |  {len(F)} falhas")
if F:
    print("\n[X] NAO CONFORME:")
    for x in F: print("   -", x)
if disapproved:
    print("\n[!] ANUNCIOS COM PROBLEMA:")
    for n, ad, s in disapproved: print(f"   - {n} @ {ad}: {s}")
print("\n[OK] CONFORMES:")
for x in P: print("   -", x)
