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

INSCRICOES = (
    "INSCRIÇÕES ABERTAS 🖤\n\n"
    "A Black Expert vale até hoje, 23h59.\n\n"
    "Incubadora de Expert: em 4 meses, do conhecimento que você já tem à sua primeira venda no digital.\n\n"
    "Só hoje:\n"
    "💰 12x de R$500 (ou R$5.000 no pix). A partir de amanhã, R$7.500\n"
    "🎁 Fura-Fila, com a Karol do lado: pro 1º a entrar\n"
    "🤖 Agente do Método Autoral: pros 5 primeiros\n"
    "🏆 Desafio Seu Método em 5 Dias, ao vivo, com premiação: pra todo mundo\n"
    "🖥️ Central do Mentor personalizada: pra quem paga no pix\n\n"
    "Tudo aqui 👇\n"
    "🔗 https://black.incubadoradeexpert.com.br\n\n"
    "Ficou com dúvida? Pode perguntar aqui, o grupo está aberto.\n\n"
    "Karol Senna")

PESQUISA = (
    "Ontem a Black Expert fechou e eu queria te ouvir de verdade.\n\n"
    "O que pesou mais pra você não entrar?\n\n"
    "1. O valor não cabia agora\n"
    "2. Falta de tempo pra me dedicar\n"
    "3. Não ficou claro como funciona\n"
    "4. Não é o meu momento\n"
    "5. Não consegui ver a live\n"
    "6. Outro motivo (me conta)\n\n"
    "Pode responder só com o número. Leio uma por uma.\n\n"
    "Karol Senna")

MODELOS = [
    ("black_expert_live_cade_voce", "Olá {{1}}, cadê você?\n\nA " + CADE, True),
    ("black_expert_live_cade_voce_sem_nome", "Olá, cadê você?\n\nA " + CADE, False),
    ("black_expert_live_oferta", "Olá {{1}}, " + ALTO, True),
    ("black_expert_live_oferta_sem_nome", "Olá, " + ALTO, False),
    # 14/10 ~17h: carrinho aberto pós-live (texto da Karol; abertura "Olá" e assinatura sem hífen = padrão dos modelos)
    ("black_expert_inscricoes_abertas", "Olá {{1}}!\n\n" + INSCRICOES, True),
    ("black_expert_inscricoes_abertas_sem_nome", "Olá!\n\n" + INSCRICOES, False),
    # 15/10 9h: pesquisa pós-Black (0 vendas) — por que não entrou
    ("black_expert_pesquisa_pos", "Olá {{1}}, aqui é a Karol.\n\n" + PESQUISA, True),
    ("black_expert_pesquisa_pos_sem_nome", "Olá, aqui é a Karol.\n\n" + PESQUISA, False),
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
    filtro = sys.argv[1] if len(sys.argv) > 1 else ""  # ex.: "inscricoes" submete só esses
    for nome, texto, com_nome in MODELOS:
        if filtro not in nome:
            continue
        body = {"type": "BODY", "text": texto}
        if com_nome:
            body["example"] = {"body_text": [["Maria"]]}
        r = api(k, "POST", "/%s/message_templates" % WABA_ID, {
            "name": nome, "language": "pt_BR", "category": "MARKETING", "components": [body]})
        print(nome, "->", r.get("status") or r.get("error", {}).get("message"), r.get("id", ""))


if __name__ == "__main__":
    main()
