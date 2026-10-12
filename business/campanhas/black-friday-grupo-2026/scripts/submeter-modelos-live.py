"""Submete na Meta os 4 modelos de WhatsApp individual do dia 14 (durante a live da Black Expert).

API1 "cadê você" (15h05-15h10) e API2 "ponto alto" (na abertura da oferta), cada um com e sem nome.
Link da live fixo no corpo (Meta proíbe link chat.whatsapp em botão; link do Meet no texto é ok).
Chave: 1Password "op://Claude/Meta WhatsApp/password". Só submete; não envia nada pra ninguém.
Uso: python submeter-modelos-live.py   (depois: python submeter-modelos-live.py status)
"""
import json
import subprocess
import sys

WABA_ID = "624446197295808"
BASE = "https://graph.facebook.com/v23.0"
LIVE = "https://meet.google.com/zun-dyuu-fqe"

CADE = "a live da Black Expert já começou e o negócio está quente.\n\nEntra aqui: %s\n\nKarol Senna" % LIVE
ALTO = ("chegou a hora: estou abrindo agora, ao vivo, a oferta da Black Expert. Ela só vale hoje.\n\n"
        "Ainda dá tempo de entrar: %s\n\nKarol Senna" % LIVE)

MODELOS = [
    ("black_expert_live_cade_voce", "Olá {{1}}, cadê você?\n\nA " + CADE, True),
    ("black_expert_live_cade_voce_sem_nome", "Olá, cadê você?\n\nA " + CADE, False),
    ("black_expert_live_oferta", "Olá {{1}}, " + ALTO, True),
    ("black_expert_live_oferta_sem_nome", "Olá, " + ALTO, False),
]


def chave():
    return subprocess.run(["op", "read", "op://Claude/Meta WhatsApp/password"],
                          capture_output=True, text=True, check=True).stdout.strip()


def api(k, metodo, caminho, corpo=None):
    cmd = ["curl", "-s", "-X", metodo, BASE + caminho, "-H", "Authorization: Bearer " + k,
           "-H", "Content-Type: application/json"]
    if corpo is not None:
        cmd += ["--data-binary", json.dumps(corpo, ensure_ascii=False)]
    r = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8")
    return json.loads(r.stdout or "{}")


def main():
    k = chave()
    if len(sys.argv) > 1 and sys.argv[1] == "status":
        d = api(k, "GET", "/%s/message_templates?limit=100&fields=name,status" % WABA_ID)
        nomes = {m[0] for m in MODELOS}
        for t in d.get("data", []):
            if t["name"] in nomes:
                print(t["name"], "->", t["status"])
        return
    for nome, texto, com_nome in MODELOS:
        body = {"type": "BODY", "text": texto}
        if com_nome:
            body["example"] = {"body_text": [["Maria"]]}
        r = api(k, "POST", "/%s/message_templates" % WABA_ID, {
            "name": nome, "language": "pt_BR", "category": "MARKETING", "components": [body]})
        print(nome, "->", r.get("status") or r.get("error", {}).get("message"), r.get("id", ""))


if __name__ == "__main__":
    main()
