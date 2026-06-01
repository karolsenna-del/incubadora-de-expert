#!/usr/bin/env python3
# Builder ANDRO_NDF — cria campanha + 3 adsets + 9 creatives + 27 ads e ativa tudo.
# Token lido de data/.env, nunca impresso.
import json, urllib.request, urllib.parse, urllib.error, time, sys

# --- credenciais ---
env = {}
with open('data/.env') as f:
    for line in f:
        line = line.strip()
        if '=' in line and not line.startswith('#'):
            k, v = line.split('=', 1)
            env[k.strip()] = v.strip()
TOKEN = env['META_TOKEN']
V     = env.get('META_API_VERSION', 'v21.0')
ACCT  = env['META_ACCT_MAIN']
PIXEL = env['META_PIXEL']
PAGE  = env['META_PAGE']
IG    = env['META_IG']
GRAPH = f"https://graph.facebook.com/{V}"

def red(s):  # nunca vazar o token em logs
    return s.replace(TOKEN, '[TOKEN]') if isinstance(s, str) else s

def call(path, params, method='POST'):
    url = f"{GRAPH}/{path}"
    data = urllib.parse.urlencode(params).encode()
    req = urllib.request.Request(url, data=data, method=method)
    try:
        with urllib.request.urlopen(req, timeout=120) as r:
            return json.loads(r.read())
    except urllib.error.HTTPError as e:
        return {'__error__': e.code, 'body': red(e.read().decode())}
    finally:
        time.sleep(0.5)  # rate-limit guard

def get(path, params):
    url = f"{GRAPH}/{path}?" + urllib.parse.urlencode(params)
    try:
        with urllib.request.urlopen(url, timeout=60) as r:
            return json.loads(r.read())
    except urllib.error.HTTPError as e:
        return {'__error__': e.code, 'body': red(e.read().decode())}

videos = json.load(open('data/output/videos.json'))
images = json.load(open('data/output/images.json'))

URL = ("https://digitaldofuturo.ai/?utm_source=FB"
       "&utm_campaign={{campaign.name}}|{{campaign.id}}"
       "&utm_medium={{adset.name}}|{{adset.id}}"
       "&utm_content={{ad.name}}|{{ad.id}}"
       "&utm_term={{placement}}"
       "&xcod=FBhQwK21wXxR{{campaign.name}}|{{campaign.id}}"
       "hQwK21wXxR{{adset.name}}|{{adset.id}}"
       "hQwK21wXxR{{ad.name}}|{{ad.id}}"
       "hQwK21wXxR{{placement}}")

# standard_enhancements foi descontinuado (subcode 3858504) — só recursos individuais
DOF = {"creative_features_spec": {
    "text_optimizations": {"enroll_status": "OPT_IN"},
    "image_uncrop": {"enroll_status": "OPT_OUT"},
    "image_animation": {"enroll_status": "OPT_OUT"},
    "video_auto_crop": {"enroll_status": "OPT_IN"}}}

C = []  # creatives definition
def vid(name, title, cta, msg): C.append(dict(kind='video', name=name, vid=videos[name+'.mp4'], title=title, cta=cta, msg=msg))
def img(name, title, cta, msg): C.append(dict(kind='image', name=name, hash=images[name+'.jpg'], title=title, cta=cta, msg=msg))

vid("NORMAL_mcp-meta_C1_H01", "Mark Zuckerberg matou o gestor de tráfego", "LEARN_MORE",
"""Alerta: mais uma profissão indo pro saco. Gestor de tráfego.

Mark Zuckerberg liberou — agora você conecta a sua IA direto no Meta. Aquele menino que você pagava R$2.000–3.000/mês pra apertar botão no gerenciador de anúncios não é mais necessário.

Conecta o Claude ou GPT no Facebook Ads. Pede pra ele subir campanha, analisar criativo, otimizar verba. Sem risco de bloqueio. Conexão oficial.

E isso é só uma das mudanças. O mercado digital tá virando: menos gente, menos agência, menos lançador. Mais IA. Mais controle nas suas mãos.

No Workshop Negócio Digital do Futuro eu te mostro como tocar um negócio digital inteiro com IA — em 2 dias, do zero.

Você que paga R$2k/mês pra alguém apertar botão precisa ver isso.

Clica em saiba mais.""")

vid("NORMAL_visao-futuro_C1_H02", "Enquanto você faz textinho, ele fatura milhões", "SHOP_NOW",
"""A maioria usa IA pra fazer textinho no ChatGPT. E acha que tá usando IA.

Mas existe um nível acima disso. IA como sistema operacional do negócio — copy, anúncios, páginas, análise, atendimento. Tudo rodando junto. Uma pessoa fazendo o trabalho de 10.

Isso é o Negócio Digital do Futuro. E no Workshop eu monto esse sistema inteiro com você ao vivo. Custa menos que uma pizza.

Clica em comprar agora.""")

vid("NORMAL_imaginecta_C2_H01", "Reescreva o DNA do seu negócio digital", "LEARN_MORE",
"""Imagine nunca mais depender de equipe, lançador ou sócio pra tocar seu negócio.

O que o DNA é pra biologia, a IA tá se tornando pro marketing digital. Não é uma ferramenta avulsa — é o código que define como o negócio inteiro funciona: produção, copy, anúncios, atendimento, escala.

Quando você reescreve esse código, tudo muda. Uma pessoa passa a fazer o trabalho de uma equipe inteira, mais rápido e do seu jeito.

No Workshop Negócio Digital do Futuro eu te mostro como reescrever o DNA do seu negócio com IA e nunca mais depender de ninguém. Custa menos que uma pizza.

Clica em saiba mais.""")

vid("UGC_segredo_C1_H01", "O segredo por trás do ROI de 50x", "LEARN_MORE",
"""ROI de 50x. R$34 mil investidos, R$1.7 milhão de volta.

Não foi mudança de equipe. Não foi mais tráfego. Foi IA aplicada ao marketing do jeito certo.

No Workshop Negócio Digital do Futuro ele vai te mostrar como montar esse sistema inteiro com IA e nunca mais depender de ninguém pra dar certo no digital. Custa menos que uma pizza.

Clica em saiba mais.""")

vid("SELF_anuncios-solo_C1_H02", "IA fazendo 20 anúncios enquanto eu tomo vitamina", "LEARN_MORE",
"""Tô em casa, de pijama, tomando vitamina. A IA tá fazendo 20 anúncios pra mim. Sozinha.

Esse vídeo aqui tô gravando sem IA, justo pra te mostrar a IA trabalhando.

Sem equipe. Sem lançador. Sem agência. Só eu + uma IA bem treinada.

Trabalhar com gente às vezes não compensa. Trabalhar com robôs sempre compensa.

No Workshop Negócio Digital do Futuro eu te ensino exatamente como faço isso na minha empresa.

Clica em saiba mais.""")

vid("LOFI_metodo-obsoleto_C1_H01", "Pare de perder dinheiro com estratégia obsoleta", "SHOP_NOW",
"""Você investiu 10, 20, 50 mil em mentorias — e os resultados não vieram.

Normal. Te ensinaram estratégia de 2020 pra aplicar em 2026.

IA já permite fazer marketing melhor do que a maioria das mentorias ensina. Só precisa do direcionamento certo.

No Workshop Negócio Digital do Futuro eu vou te mostrar como construir seu negócio digital com IA e nunca mais depender de ninguém. Custa menos que uma pizza.

Clica em comprar agora.""")

img("EST_prova-numeros_C3_H01", "Não é promessa. É currículo.", "LEARN_MORE",
"""15 mil alunos.
8 anos no digital.
R$80 milhões em vendas.
300 mil seguidores.

Não é promessa. É currículo.

No Workshop Negócio Digital do Futuro eu vou te mostrar como construir seu negócio digital com IA e nunca mais depender de ninguém. Custa menos que uma pizza.

Clica em saiba mais.""")

img("EST_roi-50x_C3_H01", "R$34 mil viraram R$1.7 milhão com IA", "LEARN_MORE",
'''"Será que funciona de verdade?"

R$34 mil investidos. R$1.7 milhão de volta. ROI de 50x.

Não foi equipe grande. Não foi orçamento absurdo. Foi IA aplicada ao marketing do jeito certo.

No Workshop Negócio Digital do Futuro eu vou te mostrar como montar esse sistema inteiro com IA e nunca mais depender de ninguém. Custa menos que uma pizza.

Clica em saiba mais.''')

img("EST_sem-lancador-sem-socio_C2_H01", "Você + IA substitui uma equipe inteira", "SHOP_NOW",
"""O digital do passado pedia 10 pessoas. Expert, lançador, sócio, copywriter, gestor de tráfego, social media, editor, designer.

O digital do futuro pede 2. Você + IA.

No Workshop Negócio Digital do Futuro eu vou te mostrar como construir seu negócio digital com IA e nunca mais depender de ninguém. Custa menos que uma pizza.

Clica em comprar agora.""")

import os
if os.path.exists('data/output/campaign_build.json'):
    out = json.load(open('data/output/campaign_build.json'))
    out.setdefault('campaign', None); out.setdefault('adsets', {})
    out.setdefault('creatives', {}); out.setdefault('ads', [])
else:
    out = {'campaign': None, 'adsets': {}, 'creatives': {}, 'ads': []}
out['errors'] = []  # limpa erros da rodada anterior

def save():
    json.dump(out, open('data/output/campaign_build.json', 'w'), ensure_ascii=False, indent=2)

# ---- 0. status/thumbnail dos videos ----
print("=== STATUS DOS VIDEOS ===")
thumbs = {}
for c in C:
    if c['kind'] != 'video':
        continue
    st = get(f"{c['vid']}", {'fields': 'status', 'access_token': TOKEN})
    stat = (st.get('status') or {}).get('video_status', st.get('__error__', '?'))
    th = get(f"{c['vid']}/thumbnails", {'fields': 'uri,is_preferred', 'access_token': TOKEN})
    uri = None
    for t in th.get('data', []):
        uri = t['uri']
        if t.get('is_preferred'):
            break
    thumbs[c['vid']] = uri
    print(f"  {c['name']}: status={stat} thumb={'ok' if uri else 'nenhuma'}")

# ---- 1. CAMPANHA ----
print("\n=== CAMPANHA ===")
if out.get('campaign'):
    CID = out['campaign']; print("  ANDRO_NDF (reuso) =>", CID)
else:
    r = call(f"{ACCT}/campaigns", {
        "name": "ANDRO_NDF", "objective": "OUTCOME_SALES", "status": "PAUSED",
        "special_ad_categories": "[]", "buying_type": "AUCTION",
        "is_adset_budget_sharing_enabled": "true",
        "bid_strategy": "LOWEST_COST_WITHOUT_CAP", "access_token": TOKEN})
    if '__error__' in r:
        print("FALHA campanha:", r); save(); sys.exit(1)
    CID = r['id']; out['campaign'] = CID; save()
    print("  ANDRO_NDF =>", CID)

# ---- 2. ADSETS ----
print("\n=== ADSETS ===")
base_geo = {"countries": ["BR"], "location_types": ["home", "recent"]}
adsets_def = [
    ("ADV_Puro", {"geo_locations": base_geo, "targeting_automation": {"advantage_audience": 1}}),
    ("ADV_Int-mkt-digital", {"geo_locations": base_geo, "flexible_spec": [{"interests": [
        {"id": "6003127206524"}, {"id": "6003031657055"}, {"id": "6003389760112"}]}],
        "targeting_automation": {"advantage_audience": 1}}),
    ("ADV_Int-ia", {"geo_locations": base_geo, "flexible_spec": [{"interests": [
        {"id": "6002898176962"}, {"id": "6002968393168"}]}],
        "targeting_automation": {"advantage_audience": 1}}),
]
for name, tgt in adsets_def:
    if name in out['adsets']:
        print(f"  {name} (reuso) => {out['adsets'][name]}"); continue
    r = call(f"{ACCT}/adsets", {
        "name": name, "campaign_id": CID, "status": "PAUSED",
        "daily_budget": "8300", "billing_event": "IMPRESSIONS",
        "optimization_goal": "OFFSITE_CONVERSIONS", "destination_type": "WEBSITE",
        "promoted_object": json.dumps({"pixel_id": PIXEL, "custom_event_type": "PURCHASE"}),
        "targeting": json.dumps(tgt),
        "attribution_spec": json.dumps([{"event_type": "CLICK_THROUGH", "window_days": 7}]),
        "access_token": TOKEN})
    if '__error__' in r:
        print(f"  FALHA {name}:", r); out['errors'].append({'adset': name, 'r': r}); save(); continue
    out['adsets'][name] = r['id']; save()
    print(f"  {name} => {r['id']}")
if len(out['adsets']) != 3:
    print("Abortando: nem todos os adsets criados."); sys.exit(1)

# ---- 3. CREATIVES ----
print("\n=== CREATIVES ===")
for c in C:
    if c['name'] in out['creatives']:
        print(f"  {c['name']} (reuso) => {out['creatives'][c['name']]}"); continue
    if c['kind'] == 'video':
        vd = {"video_id": c['vid'], "title": c['title'], "message": c['msg'],
              "call_to_action": {"type": c['cta'], "value": {"link": URL}}}
        if thumbs.get(c['vid']):
            vd["image_url"] = thumbs[c['vid']]
        oss = {"page_id": PAGE, "instagram_user_id": IG, "video_data": vd}
    else:
        ld = {"image_hash": c['hash'], "link": URL, "message": c['msg'],
              "name": c['title'], "call_to_action": {"type": c['cta']}}
        oss = {"page_id": PAGE, "instagram_user_id": IG, "link_data": ld}
    r = call(f"{ACCT}/adcreatives", {
        "name": c['name'], "object_story_spec": json.dumps(oss),
        "degrees_of_freedom_spec": json.dumps(DOF), "access_token": TOKEN})
    if '__error__' in r:
        print(f"  FALHA {c['name']}:", r); out['errors'].append({'creative': c['name'], 'r': r}); save(); continue
    out['creatives'][c['name']] = r['id']; save()
    print(f"  {c['name']} => {r['id']}")

# ---- 4. ADS (ACTIVE; adset/campanha PAUSED seguram) ----
print("\n=== ADS (9 x 3 = 27) ===")
existing_ads = {(a['name'], a['adset']) for a in out['ads']}
for aname, aid in out['adsets'].items():
    for c in C:
        cid = out['creatives'].get(c['name'])
        if not cid:
            continue
        if (c['name'], aname) in existing_ads:
            continue
        r = call(f"{ACCT}/ads", {
            "name": c['name'], "adset_id": aid,
            "creative": json.dumps({"creative_id": cid}),
            "status": "ACTIVE", "access_token": TOKEN})
        if '__error__' in r:
            print(f"  FALHA ad {c['name']}@{aname}:", r); out['errors'].append({'ad': f"{c['name']}@{aname}", 'r': r}); save(); continue
        out['ads'].append({'name': c['name'], 'adset': aname, 'id': r['id']}); save()
    print(f"  adset {aname}: {sum(1 for a in out['ads'] if a['adset']==aname)} ads")

print(f"\nTotal ads criados: {len(out['ads'])}/27")

# ---- 5. ATIVAR adsets -> campanha ----
print("\n=== ATIVAR ===")
for name, aid in out['adsets'].items():
    r = call(f"{aid}", {"status": "ACTIVE", "access_token": TOKEN})
    print(f"  adset {name}: {'ACTIVE' if r.get('success') or 'id' in r or r=={} else r}")
r = call(f"{CID}", {"status": "ACTIVE", "access_token": TOKEN})
print(f"  campanha ANDRO_NDF: {'ACTIVE' if r.get('success') or 'id' in r or r=={} else r}")

# ---- 6. verificacao final ----
print("\n=== VERIFICACAO FINAL ===")
chk = get(f"{CID}", {"fields": "name,status,effective_status,daily_budget", "access_token": TOKEN})
print("  campanha:", json.dumps(chk, ensure_ascii=False))
for name, aid in out['adsets'].items():
    s = get(f"{aid}", {"fields": "name,status,effective_status", "access_token": TOKEN})
    print(f"  {name}:", json.dumps(s, ensure_ascii=False))

print(f"\nErros: {len(out['errors'])}")
print("Gerenciador: https://adsmanager.facebook.com/adsmanager/manage/campaigns?act=%s&selected_campaign_ids=%s"
      % (ACCT.replace('act_', ''), CID))
save()
