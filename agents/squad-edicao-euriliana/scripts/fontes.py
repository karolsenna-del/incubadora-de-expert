#!/usr/bin/env python3
"""Fontes de imagem e vídeo — descobre o que esta máquina tem conectado e ajuda a configurar o que falta.

  python3 fontes.py diagnosticar        mostra o que está pronto, o que falta e como configurar (e grava a escada)
  python3 fontes.py configurar gemini   guarda a chave da API do Gemini (digitada escondida, não passa pelo chat)
  python3 fontes.py configurar pexels   guarda a chave grátis do Pexels (fotos e vídeos reais)
  python3 fontes.py configurar pixabay  guarda a chave grátis do Pixabay
  python3 fontes.py escada              imprime só a ordem que o gerar.py vai usar (imagem e vídeo)

A escada (do melhor para o último recurso):
  imagem: higgsfield (GPT Image 2.5) → codex (conta do ChatGPT; GPT Image do Codex) → gemini (Nano Banana Pro) → animacao
  vídeo:  higgsfield (Kling, Veo, Seedance) → gemini (Veo 3.1) → animacao
          animacao = MODO SÓ ANIMAÇÃO (regra do Euriler, 07/10): sem gerador, ofereça a conexão com a saída "quero editar
          sem imagens ou vídeos de IA por enquanto"; escolhida essa saída, a edição inteira é desenhada em código no
          Remotion (cenas sob medida, tipografia, ilustração em SVG/CSS, ícones, grafismos).
          O banco grátis (Pexels, Pixabay, Openverse, scripts/banco.py) só entra se a pessoa pedir foto ou vídeo real.

As chaves ficam em ~/.config/edicao-euriliana/chaves.json (só leitura do dono). Também valem variáveis de ambiente
(GEMINI_API_KEY, PEXELS_API_KEY, PIXABAY_API_KEY) e, no Mac do Euriler, o 1Password (vault Claude). Fora do Mac o
1Password não é consultado; se ele faltar ou falhar, segue quieto para o próximo caminho.
"""
import getpass
import json
import os
import shutil
import subprocess
import sys
import time
import urllib.request
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import plataforma as pf  # noqa: E402

CONF = Path.home() / ".config/edicao-euriliana"
CHAVES = CONF / "chaves.json"
ESCADA = CONF / "fontes.json"
OP_REFS = {"gemini": "op://Claude/Gemini API Key/credential"}
ENV = {"gemini": ["GEMINI_API_KEY", "GOOGLE_API_KEY"], "pexels": ["PEXELS_API_KEY"], "pixabay": ["PIXABAY_API_KEY"]}

COMO = {
    "higgsfield": [
        "O que é: o caminho principal. Um login só dá imagem (GPT Image 2.5) e takes de vídeo (Kling, Veo, Seedance).",
        "Custo: assinatura do Higgsfield (higgsfield.ai/pricing); cada imagem ~3 créditos, cada take 10–60.",
        "1) Instale:  npm install -g @higgsfield/cli",
        "2) Entre na conta (abre o navegador):  ! higgsfield auth login",
        "3) Confira:  higgsfield account status",
    ],
    "codex": [
        "O que é: imagem pela conta do ChatGPT que você já paga (Plus/Pro), sem custo extra. Não faz take de vídeo.",
        "Gera com o modelo de imagem do Codex (GPT Image); não dá para escolher o 2.5. Cada imagem leva ~1 min.",
        "1) Instale:  npm install -g @openai/codex",
        "2) Entre com a conta do ChatGPT (abre o navegador):  ! codex login",
        "3) Confira:  codex login status",
    ],
    "gemini": [
        "O que é: API do Google. Faz imagem (Nano Banana Pro, muito realista) e vídeo (Veo 3.1). Cobra por uso.",
        "Custo: centavos de dólar por imagem; vídeo custa mais por segundo. Exige cartão cadastrado no Google.",
        "1) Crie a chave em https://aistudio.google.com/apikey (e ative o faturamento no projeto do Google)",
        "2) Guarde sem passar pelo chat:  ! python3 <skill>/scripts/fontes.py configurar gemini",
    ],
    "pexels": [
        "O que é: banco GRÁTIS de fotos e vídeos reais (licença livre). Último recurso, com busca bem específica.",
        "1) Crie a chave grátis em https://www.pexels.com/api/",
        "2) Guarde:  ! python3 <skill>/scripts/fontes.py configurar pexels",
    ],
}


def ler_chaves():
    try:
        return json.loads(CHAVES.read_text(encoding="utf-8"))
    except Exception:
        return {}


def chave(nome):
    for v in ENV.get(nome, []):
        if os.environ.get(v):
            return os.environ[v]
    k = ler_chaves().get(nome)
    if k:
        return k
    ref = OP_REFS.get(nome)
    if ref and pf.MAC and shutil.which("op"):  # 1Password: só no Mac do Euriler; qualquer falha = segue quieto
        try:
            r = subprocess.run(["op", "read", ref], capture_output=True, text=True, **pf.UTF8, timeout=20,
                               stdin=subprocess.DEVNULL)
            if r.returncode == 0 and r.stdout.strip():
                return r.stdout.strip()
        except Exception:
            pass
    return None


def roda(cmd, t=40):
    try:
        r = subprocess.run([*pf.comando(cmd[0]), *cmd[1:]], capture_output=True, text=True, **pf.UTF8, timeout=t)
        return r.returncode, (r.stdout + r.stderr)
    except Exception as e:
        return 1, str(e)


def checar():
    st = {}
    if shutil.which("higgsfield"):
        c, out = roda(["higgsfield", "account", "status"])
        st["higgsfield"] = {"ok": c == 0 and "credit" in out.lower(), "detalhe": out.strip().splitlines()[-1] if out.strip() else ""}
        if not st["higgsfield"]["ok"]:
            st["higgsfield"]["detalhe"] = "instalado, mas sem login (rode: higgsfield auth login)"
    else:
        st["higgsfield"] = {"ok": False, "detalhe": "não instalado"}
    if shutil.which("codex"):
        c, out = roda(["codex", "login", "status"])
        st["codex"] = {"ok": c == 0 and "logged in" in out.lower(), "detalhe": out.strip().splitlines()[0] if out.strip() else ""}
    else:
        st["codex"] = {"ok": False, "detalhe": "não instalado"}
    k = chave("gemini")
    if k:
        try:
            req = urllib.request.Request("https://generativelanguage.googleapis.com/v1beta/models?pageSize=200", headers={"x-goog-api-key": k})
            nomes = [m["name"] for m in json.load(urllib.request.urlopen(req, timeout=20)).get("models", [])]
            img = [n for n in nomes if "image" in n]
            veo = [n for n in nomes if "veo" in n]
            st["gemini"] = {"ok": bool(img), "video": bool(veo), "detalhe": f"{len(img)} modelos de imagem, {len(veo)} de vídeo"}
        except Exception as e:
            st["gemini"] = {"ok": False, "detalhe": f"chave recusada ou sem rede: {str(e)[:80]}"}
    else:
        st["gemini"] = {"ok": False, "detalhe": "sem chave"}
    st["pexels"] = {"ok": bool(chave("pexels")), "detalhe": "chave configurada" if chave("pexels") else "sem chave (opcional)"}
    st["pixabay"] = {"ok": bool(chave("pixabay")), "detalhe": "chave configurada" if chave("pixabay") else "sem chave (opcional)"}
    st["openverse"] = {"ok": True, "detalhe": "sempre disponível (fotos com licença livre, sem chave)"}
    return st


def montar_escada(st):
    img = [f for f in ("higgsfield", "codex", "gemini") if st[f]["ok"]] + ["animacao"]
    vid = [f for f, ok in (("higgsfield", st["higgsfield"]["ok"]), ("gemini", st["gemini"].get("video") and st["gemini"]["ok"])) if ok]
    vid += ["animacao"]
    return {"imagem": img, "video": vid, "quando": int(time.time()), "estado": st}


def escada(forcar=False):
    """usada pelo gerar.py: lê a escada gravada (vale 1 dia) ou refaz o diagnóstico"""
    try:
        e = json.loads(ESCADA.read_text(encoding="utf-8"))
        if not forcar and time.time() - e.get("quando", 0) < 86400:
            return e
    except Exception:
        pass
    e = montar_escada(checar())
    CONF.mkdir(parents=True, exist_ok=True)
    ESCADA.write_text(json.dumps(e, ensure_ascii=False, indent=1), encoding="utf-8")
    return e


def diagnosticar():
    e = escada(forcar=True)
    st = e["estado"]
    print("Fontes de imagem e vídeo nesta máquina:")
    for nome, rotulo in (("higgsfield", "Higgsfield (imagem + vídeo)"), ("codex", "Codex / ChatGPT (imagem)"),
                         ("gemini", "Gemini API (imagem + vídeo)"), ("pexels", "Pexels (banco grátis, foto + vídeo)"),
                         ("pixabay", "Pixabay (banco grátis)"), ("openverse", "Openverse (banco grátis, foto)")):
        print(f"  {'OK ' if st[nome]['ok'] else '-- '} {rotulo}: {st[nome]['detalhe']}")
    print(f"\nescada de imagem: {' → '.join(e['imagem'])}")
    print(f"escada de vídeo:  {' → '.join(e['video'])}")
    faltam = [f for f in ("higgsfield", "codex", "gemini") if not st[f]["ok"]]
    if len(faltam) == 3:
        print("\nNenhum gerador conectado. Antes de editar, numa mensagem curta, dê duas saídas à pessoa: a) conectar agora "
              "(explique as opções abaixo em linguagem simples e guie; login e chave quem digita é ela, com ! no começo do "
              "comando) ou b) \"quero editar sem imagens ou vídeos de IA por enquanto\": MODO SÓ ANIMAÇÃO, o vídeo inteiro "
              "desenhado em código no Remotion (ver references/fontes-de-imagem.md). Se ela já disse que quer sem IA, edite "
              "em animação sem perguntar. Banco grátis só se a pessoa pedir foto ou vídeo real.")
    elif not st["higgsfield"]["ok"]:
        print("\nO caminho principal (Higgsfield) não está conectado; a edição segue com o que há. Se a pessoa quiser, "
              "explique as opções abaixo em linguagem simples e guie a instalação (login e chave quem digita é ela, "
              "com ! no começo do comando).")
    for f in faltam + (["pexels"] if not st["pexels"]["ok"] else []):
        print(f"\n[{f}]")
        for linha in COMO[f]:
            linha = linha.replace("<skill>", str(Path(__file__).resolve().parent.parent))
            print("  " + (linha.replace("python3 ", "python ") if pf.WINDOWS else linha))
    print(json.dumps({"imagem": e["imagem"], "video": e["video"]}))


def configurar(nome):
    if nome not in ("gemini", "pexels", "pixabay"):
        sys.exit("use: configurar gemini | pexels | pixabay")
    k = getpass.getpass(f"cole a chave do {nome} (não aparece na tela) e aperte Enter: ").strip()
    if not k:
        sys.exit("nada digitado")
    CONF.mkdir(parents=True, exist_ok=True)
    d = ler_chaves()
    d[nome] = k
    CHAVES.write_text(json.dumps(d), encoding="utf-8")
    os.chmod(CHAVES, 0o600)
    print(f"chave do {nome} guardada em {CHAVES} (só você lê). Testando...")
    st = escada(forcar=True)["estado"]
    print(f"{nome}: {'funcionando' if st[nome]['ok'] else 'ainda não: ' + st[nome]['detalhe']}")


if __name__ == "__main__":
    a = sys.argv[1:] or ["diagnosticar"]
    if a[0] == "diagnosticar":
        diagnosticar()
    elif a[0] == "configurar" and len(a) > 1:
        configurar(a[1])
    elif a[0] == "escada":
        print(json.dumps({k: v for k, v in escada(forcar="--refaz" in a).items() if k in ("imagem", "video")}))
    else:
        sys.exit(__doc__)
