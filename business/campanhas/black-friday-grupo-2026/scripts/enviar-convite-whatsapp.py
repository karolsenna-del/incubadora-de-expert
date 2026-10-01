"""Envio 1:1 do convite da Black Expert pelo WhatsApp (Dualhook Runtime API -> Meta Cloud API).

Dados pessoais NAO ficam aqui: a fila e o log vivem em business/vault/black-expert-2026/ (gitignored).
Chave: 1Password "op://Claude/Dualhook API/password".

Uso:
  python enviar-convite-whatsapp.py                    # dry-run: mostra o que faria, nao envia
  python enviar-convite-whatsapp.py --teste 5567...    # envia 1 mensagem so pro numero informado
  python enviar-convite-whatsapp.py --enviar --limite 20 --confirmo BLACK-EXPERT
                                                       # envio real (lote), exige confirmacao explicita

Regras:
- so envia se o modelo estiver APPROVED na Meta;
- nunca envia pra quem esta em quarentena.csv ou bloqueados.csv;
- idempotente: quem ja tem status "enviado" no log nao recebe de novo;
- 1 mensagem a cada 2s; para no primeiro erro de autenticacao/limite de conta.
"""
import argparse, csv, json, os, re, subprocess, sys, time, urllib.request, urllib.error
from datetime import datetime, timezone

RAIZ = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", ".."))
VAULT = os.path.join(RAIZ, "business", "vault", "black-expert-2026")
FILA = os.path.join(VAULT, "fila-api-dry-run", "fila-revisao.csv")
QUARENTENA = os.path.join(VAULT, "fila-api-dry-run", "quarentena.csv")
BLOQUEADOS = os.path.join(VAULT, "fila-api-dry-run", "bloqueados.csv")
JA_RECEBEU = os.path.join(VAULT, "fila-api-dry-run", "ja-recebeu-manual.csv")
LOG = os.path.join(VAULT, "envios-whatsapp-log.csv")

API = "https://api.dualhook.com/v25.0"
WABA_ID = "624446197295808"
PHONE_NUMBER_ID = "663604156841540"
# Ordem de preferencia: v2 (com negrito, pedido da Karol 30/09) -> v1. Usa o primeiro APPROVED.
PREF_COM_NOME = ["black_expert_convite_grupo_v2", "black_expert_convite_grupo"]
PREF_SEM_NOME = ["black_expert_convite_grupo_sem_nome_v2", "black_expert_convite_grupo_sem_nome"]
MODELO_COM_NOME = None  # definido em escolher_modelos()
MODELO_SEM_NOME = None
IDIOMA = "pt_BR"
PAUSA_S = 2.0
ERROS_QUE_PARAM = {0, 3, 10, 190, 200, 368, 131031, 131042, 131048, 131056, 130429, 133010}


def chave_api():
    r = subprocess.run(["op", "read", "op://Claude/Dualhook API/password"], capture_output=True, text=True)
    k = r.stdout.strip()
    if not k.startswith("dh_live_"):
        sys.exit("Nao consegui ler a chave do Dualhook no 1Password.")
    return k


def api(k, metodo, caminho, corpo=None):
    req = urllib.request.Request(API + caminho, method=metodo,
                                 data=json.dumps(corpo).encode() if corpo is not None else None,
                                 headers={"Authorization": "Bearer " + k, "Content-Type": "application/json"})
    try:
        return json.load(urllib.request.urlopen(req, timeout=30))
    except urllib.error.HTTPError as e:
        try:
            return json.loads(e.read().decode())
        except Exception:
            return {"error": {"code": e.code, "message": "HTTP %s" % e.code}}


def primeiro_nome(nome):
    tok = (nome or "").strip().split()
    if not tok:
        return None
    p = tok[0]
    if not re.fullmatch(r"[A-Za-zÀ-ÿ]{2,}", p):
        return None
    return p[:1].upper() + p[1:].lower()


def telefones(caminho):
    if not os.path.exists(caminho):
        return set()
    return {r["telefone_e164"].lstrip("+") for r in csv.DictReader(open(caminho, encoding="utf-8-sig"))}


def ja_enviados():
    if not os.path.exists(LOG):
        return set()
    return {r["chave_idempotencia"] for r in csv.DictReader(open(LOG, encoding="utf-8-sig")) if r["status"] == "enviado"}


def registrar(linha):
    novo = not os.path.exists(LOG)
    with open(LOG, "a", newline="", encoding="utf-8-sig") as f:
        w = csv.DictWriter(f, fieldnames=["quando", "chave_idempotencia", "lead_id", "telefone_e164", "modelo", "status", "wamid", "erro"])
        if novo:
            w.writeheader()
        w.writerow(linha)


def status_modelos(k):
    d = api(k, "GET", "/%s/message_templates?limit=50" % WABA_ID)
    return {t["name"]: t["status"] for t in d.get("data", [])}


def escolher_modelos(st):
    """Primeiro modelo APPROVED de cada lista. Sem modelo com nome aprovado, todos vao com o sem nome (decisao Karol 30/09)."""
    global MODELO_COM_NOME, MODELO_SEM_NOME
    MODELO_COM_NOME = next((m for m in PREF_COM_NOME if st.get(m) == "APPROVED"), None)
    MODELO_SEM_NOME = next((m for m in PREF_SEM_NOME if st.get(m) == "APPROVED"), None)
    print("Usando -> com nome: %s | sem nome: %s" % (MODELO_COM_NOME, MODELO_SEM_NOME))


def montar(tel, nome):
    pn = primeiro_nome(nome) if MODELO_COM_NOME else None
    tpl = {"name": MODELO_COM_NOME if pn else MODELO_SEM_NOME, "language": {"code": IDIOMA}}
    if pn:
        tpl["components"] = [{"type": "body", "parameters": [{"type": "text", "text": pn}]}]
    return {"messaging_product": "whatsapp", "to": tel, "type": "template", "template": tpl}


def enviar(k, tel, nome):
    corpo = montar(tel, nome)
    r = api(k, "POST", "/%s/messages" % PHONE_NUMBER_ID, corpo)
    if "messages" in r:
        return "enviado", r["messages"][0].get("id", ""), "", corpo["template"]["name"]
    e = r.get("error", {})
    return "erro", "", "%s %s" % (e.get("code"), (e.get("message") or "")[:120]), corpo["template"]["name"]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--teste", help="envia 1 mensagem so pra este numero (55DDD...)")
    ap.add_argument("--nome-teste", default="Karol")
    ap.add_argument("--enviar", action="store_true")
    ap.add_argument("--limite", type=int, default=0)
    ap.add_argument("--confirmo", default="")
    a = ap.parse_args()

    k = chave_api()
    st = status_modelos(k)
    print("Modelos:", st)
    escolher_modelos(st)
    if not MODELO_SEM_NOME:
        sys.exit("Nenhum modelo sem nome aprovado pela Meta.")

    if a.teste:
        s, wamid, erro, modelo = enviar(k, re.sub(r"\D", "", a.teste), a.nome_teste)
        print("Teste (%s):" % modelo, s, erro or wamid)
        return

    fora = telefones(QUARENTENA) | telefones(BLOQUEADOS) | telefones(JA_RECEBEU)
    feitos = ja_enviados()
    fila = [r for r in csv.DictReader(open(FILA, encoding="utf-8-sig"))]
    pendentes = [r for r in fila if r["chave_idempotencia"] not in feitos and r["telefone_e164"].lstrip("+") not in fora]
    print("Fila: %d | ja enviados: %d | excluidos por quarentena/bloqueio: %d | pendentes: %d"
          % (len(fila), len(feitos), sum(1 for r in fila if r["telefone_e164"].lstrip("+") in fora), len(pendentes)))
    if a.limite:
        pendentes = pendentes[: a.limite]

    if not a.enviar:
        com = sum(1 for r in pendentes if MODELO_COM_NOME and primeiro_nome(r["nome"]))
        print("DRY-RUN: enviaria %d (com nome: %d, sem nome: %d). Nada foi enviado." % (len(pendentes), com, len(pendentes) - com))
        return
    if a.confirmo != "BLACK-EXPERT":
        sys.exit("Envio real exige --confirmo BLACK-EXPERT (depois do ok explicito da Karol).")
    ok = err = 0
    for r in pendentes:
        tel = r["telefone_e164"].lstrip("+")
        s, wamid, erro, modelo = enviar(k, tel, r["nome"])
        registrar({"quando": datetime.now(timezone.utc).isoformat(timespec="seconds"), "chave_idempotencia": r["chave_idempotencia"],
                   "lead_id": r["lead_id"], "telefone_e164": tel, "modelo": modelo, "status": s, "wamid": wamid, "erro": erro})
        if s == "enviado":
            ok += 1
        else:
            err += 1
            codigo = int((erro.split() or ["0"])[0]) if (erro.split() or ["x"])[0].isdigit() else 0
            if codigo in ERROS_QUE_PARAM:
                print("Parando: erro de conta/limite (%s)." % erro)
                break
        time.sleep(PAUSA_S)
    print("Resultado: %d enviados, %d erros. Log: %s" % (ok, err, LOG))


if __name__ == "__main__":
    main()
