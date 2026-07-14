"""
Voomp Link YouTube — vincula vídeos do YouTube (Voomp Tube) às aulas do Expert360.

Fluxo por aula:
  1. Upload da thumbnail (POST /media, multipart)
  2. Monta payload da aula (mediaType=voomptube, source = JSON hex-XOR-0x33)
  3. POST (criar, M0) ou PUT (atualizar aula existente, M1)

Uso:
  python voomp-link-youtube.py --token "<authorization header>" [--dry-run]

O token vem do header Authorization das chamadas do app (sessão logada).
Formato do source (descoberto 13/07/2026 no piloto):
  hex( XOR_0x33( '{"url":"https://youtu.be/ID","theme":"default","carryOn":false}' ) )
"""

import argparse
import json
import sys
from pathlib import Path

import requests

API = "https://api.voompplay.com.br"
COURSE = 9512
PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent.parent
THUMBS = PROJECT_ROOT / "business" / "producao" / "expert360" / "assets" / "thumbnails"

DESCRICOES = {
    "M0-00": "Por que a maioria dos cursos pula a etapa mais importante: organizar a história antes de construir qualquer produto. Nesta aula você entende o que vai construir no M0, por que a ordem importa e como os 3 documentos deste módulo alimentam diretamente a persona (M1) e o método (M2).",
    "M0-01": "Como transformar o que você chama de fracasso em dado do seu método — e por que especialistas que constroem métodos poderosos fazem isso primeiro. Exercício: abrir a Lista de Fracassos e registrar o aprendizado de cada tentativa que não funcionou.",
    "M0-02": "Escrever a história real sem filtro, guiada por 7 perguntas que revelam padrões da trajetória, forças nascidas das dores e territórios onde você ganhou autoridade por ter atravessado. O material mais incopiável do curso — porque nenhuma IA cria o que você viveu.",
    "M0-03": "Mapear o Ikigai — a interseção entre seus talentos, suas paixões e a demanda do mundo — com 8 perguntas guiadas. Resultado: um rascunho da sua razão de ser como especialista e o que já está acontecendo que pode ser \"a coisa certa no momento certo\".",
    "M0-04": "Nomear o que foi construído no M0: 3 documentos que só você pode ter (Lista de Fracassos, História Real e Ikigai). Como eles alimentam a persona e a promessa do M1 e o método do M2 — e por que este módulo não era aquecimento, era a fundação.",
    "M1-00": "Bem-vinda ao M1. O que são P1 (Persona Compradora) e P2 (Promessa Transformadora), por que a persona informa a promessa — e o que acontece com tudo que vem depois quando os dois não estão definidos com clareza.",
    "M1-01": "O que é uma Persona Compradora de verdade — psicográfico, não demográfico. Por que a persona mais precisa vem da sua história e não de um molde externo. As 7 dimensões que formam o mapa completo: quem ela é, onde está, o que quer, o que teme, o que já tentou e o que precisa ouvir.",
    "M1-02": "Exercício guiado: usar o Agente da Persona Compradora para construir P1 a partir da sua história real e do seu Ikigai. Como rodar o processo, o que ajustar ao longo da conversa e o critério para saber quando a persona fechou: \"essa pessoa existe — eu a conheço, eu já fui ela.\"",
    "M1-03": "O que é uma Promessa Transformadora — os 4 elementos que a constroem (QUEM, O QUÊ, COMO e OBJEÇÃO ELIMINADA) e o que a diferencia de um slogan, de uma promessa de processo ou de uma frase centrada em você. A promessa é o coração do negócio: ela aparece em tudo.",
    "M1-04": "Exercício guiado: usar o Agente da Promessa Transformadora para construir P2 a partir de P1. O processo iterativo — proposta por versão, ajuste até fechar — e o critério: a promessa certa é a que você consegue dizer em voz alta com convicção.",
    "M1-05": "A diferença entre pensar como especialista e pensar como empreendedora — jogo vs campeonato. Por que medir por mês destrói quem está no começo e como a pergunta \"o tempo vai passar de qualquer jeito — como você quer estar lá?\" muda a régua de avaliação.",
    "M1-06": "O custo invisível de dizer sim para projetos de terceiros enquanto seu próprio negócio espera. Os 3 tipos de sim que parecem racionais mas são adiamento, e as 3 perguntas-filtro para avaliar qualquer oportunidade externa antes de responder.",
    "M1-07": "Nomear o que foi construído no M1: P1 e P2 prontos — a bússola do Expert360. Como esses dois documentos alimentam o método (M2), a oferta (M3) e o posicionamento (M4). Dois dos cinco Ps construídos.",
}

# (acao, module_id, lesson_id|None, order, title, youtube_id, desc_key, thumb_file, media_id|None)
# media_id preenchido = thumb já está na biblioteca de mídias (não sobe de novo).
# Execução 14/07: M0 criado com sucesso (lessons 216358-216361); M1 abaixo reusa thumbs 173449-173456.
TASKS = [
    ("update", 38787, 216357, 0, "Desbloqueia sua especialidade", "oa5wS2TEBvQ", "M0-00", "M0-00-intro.png", 173444),
    ("update", 38787, 216358, 1, "Fracasso como prova", "KgbNefT-Fn4", "M0-01", "M0-01-fracasso-como-prova.png", 173445),
    ("update", 38787, 216359, 2, "Sua História Real", "J4FZeBTedQw", "M0-02", "M0-02-historia-real.png", 173446),
    ("update", 38787, 216360, 3, "Ikigai - Onde seu conhecimento cabe no mundo", "IYbn8KjTgyc", "M0-03", "M0-03-ikigai.png", 173447),
    ("update", 38787, 216361, 4, "Quem você se tornou", "R0COUY8aa2E", "M0-04", "M0-04-encerramento.png", 173448),
    ("update", 38816, 213973, 0, "Boas-vindas ao M1", "Zu0xBRBY3mM", "M1-00", "M1-00-intro.png", 173449),
    ("update", 38816, 213974, 1, "A1 — O que é Persona Compradora", "XsogWf_dmGQ", "M1-01", "M1-01-persona-compradora.png", 173450),
    ("update", 38816, 213975, 2, "A2 — Exercício: Agente da Persona", "iEpChEXx3Fw", "M1-02", "M1-02-agente-persona.png", 173451),
    ("update", 38816, 213976, 3, "A3 — O que é Promessa Transformadora", "M9lO1Di-T9Y", "M1-03", "M1-03-promessa-transformadora.png", 173452),
    ("update", 38816, 213977, 4, "A4 — Exercício: Agente da Promessa", "8LrHizogfn4", "M1-04", "M1-04-agente-promessa.png", 173453),
    ("update", 38816, 213978, 5, "A5 — Posicionamento no Mercado", "-BlTLClbx78", "M1-05", "M1-05-posicionamento-no-mercado.png", 173454),
    ("update", 38816, 213979, 6, "A6 — O Custo Invisível do Sim", "3w66-axvM5o", "M1-06", "M1-06-objecoes.png", 173455),
    ("update", 38816, 213980, 7, "Quem Você se Tornou no M1", "rPkK2Hi7TN8", "M1-07", "M1-07-quem-voce-se-tornou.png", 173456),
]


def encode_source(youtube_id: str) -> str:
    payload = json.dumps(
        {"url": f"https://youtu.be/{youtube_id}", "theme": "default", "carryOn": False},
        separators=(",", ":"),
    )
    return "".join(f"{ord(c) ^ 0x33:02x}" for c in payload)


def upload_thumb(session: requests.Session, path: Path) -> int:
    with open(path, "rb") as f:
        r = session.post(
            f"{API}/media",
            files={"file": (path.name, f, "image/png")},
            data={"title": path.stem},
            timeout=60,
        )
    r.raise_for_status()
    data = r.json()
    if "id" not in data:
        raise RuntimeError(f"POST /media sem id: {data}")
    return data["id"]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--token", required=True)
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--status", default="draft", choices=["draft", "published"])
    args = ap.parse_args()

    s = requests.Session()
    s.headers.update({
        "authorization": args.token,
        "referer": "https://app.voompplay.com.br/",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    })

    ok, fail = [], []
    for acao, module_id, lesson_id, order, title, yt, desc_key, thumb_file, media_id in TASKS:
        print(f"\n>> [{acao}] {title}")
        thumb_path = THUMBS / thumb_file
        if media_id is None and not thumb_path.exists():
            print(f"   THUMB AUSENTE: {thumb_path}")
            fail.append((title, "thumb ausente"))
            continue

        if args.dry_run:
            print(f"   dry-run: yt={yt} order={order} thumb={thumb_file} media_id={media_id}")
            ok.append(title)
            continue

        try:
            if media_id is None:
                media_id = upload_thumb(s, thumb_path)
                print(f"   thumb enviada: media_id={media_id}")
            else:
                print(f"   thumb reusada: media_id={media_id}")

            body = {
                "course_id": str(COURSE),
                "title": title,
                "mediaType": "voomptube",
                "source": encode_source(yt),
                "content": f"<p>{DESCRICOES[desc_key]}</p>",
                "order": order,
                "thumb": f"https://img.youtube.com/vi/{yt}/sddefault.jpg",
                "custom_thumb": media_id,
                "status": args.status,
                "small_category": None,
            }

            if acao == "create":
                r = s.post(f"{API}/course/{COURSE}/module/{module_id}/lesson", json=body, timeout=60)
            else:
                # A rota de update aceita POST no /lesson/{id} (PUT retorna 500 "not supported")
                body["id"] = lesson_id
                r = s.post(f"{API}/course/{COURSE}/module/{module_id}/lesson/{lesson_id}", json=body, timeout=60)

            print(f"   {r.request.method} lesson -> HTTP {r.status_code}")
            if r.status_code >= 400:
                print(f"   ERRO: {r.text[:300]}")
                fail.append((title, f"HTTP {r.status_code}"))
                continue

            resp = r.json()
            print(f"   ok: lesson_id={resp.get('id', lesson_id)}")
            ok.append(title)
        except Exception as e:
            print(f"   EXCECAO: {e}")
            fail.append((title, str(e)))

    print("\n" + "=" * 50)
    print(f"OK: {len(ok)} | FALHAS: {len(fail)}")
    for t, motivo in fail:
        print(f"  FALHOU: {t} — {motivo}")
    sys.exit(1 if fail else 0)


if __name__ == "__main__":
    main()
