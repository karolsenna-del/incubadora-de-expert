#!/usr/bin/env python3
"""Extra, só quando a pessoa pede foto ou vídeo REAL: banco gratuito (licença livre), com a mesma régua de qualidade.
Sem gerador conectado, o padrão é o modo só animação (fontes.py), não este banco.

Uso: python3 banco.py <trabalho> <nome> "<busca em inglês, concreta>" [--video] [--quantos 4] [--fonte auto|pexels|pixabay|openverse]

  - Busca bem específica (pessoa + ação + lugar): "tired baker at dawn looking at phone", nunca "business success".
  - Baixa os melhores resultados em app/public/assets/_candidatos/ com folha lado a lado e registra no assets.json
    autor, licença e link (crédito). Depois aprove com gerar.py aprovar ... --nota 8+ (mesma régua das geradas).
  - Fontes: Pexels (foto e vídeo, chave grátis), Pixabay (foto e vídeo, chave grátis), Openverse (foto, sem chave).
    Configure as chaves com: python3 fontes.py configurar pexels | pixabay
  - Banco gratuito é o que mais cheira a "banco de imagem": prefira menos imagem e mais animação feita no vídeo
    (tipografia cinética, grafismo, telas reais) a usar foto posada. Reprove sem dó o que parecer posado.
"""
import json
import re
import sys
import urllib.parse
import urllib.request
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from fontes import chave  # noqa: E402
from gerar import GENERICOS, folha  # noqa: E402

UA = {"User-Agent": "edicao-euriliana/1.0"}


def pegar(url, headers=None):
    return json.load(urllib.request.urlopen(urllib.request.Request(url, headers={**UA, **(headers or {})}), timeout=30))


def pexels(q, video, n):
    k = chave("pexels")
    if not k:
        return []
    if video:
        d = pegar(f"https://api.pexels.com/videos/search?query={urllib.parse.quote(q)}&orientation=portrait&per_page={n}", {"Authorization": k})
        out = []
        for v in d.get("videos", []):
            arqs = sorted([f for f in v["video_files"] if f.get("height")], key=lambda f: -f["height"])
            hd = next((f for f in arqs if f["height"] <= 1920), arqs[0] if arqs else None)
            if hd:
                out.append({"url": hd["link"], "ext": ".mp4", "autor": v["user"]["name"], "licenca": "Pexels License (uso livre)", "link": v["url"]})
        return out
    d = pegar(f"https://api.pexels.com/v1/search?query={urllib.parse.quote(q)}&orientation=portrait&per_page={n}", {"Authorization": k})
    return [{"url": p["src"]["large2x"], "ext": ".jpg", "autor": p["photographer"], "licenca": "Pexels License (uso livre)", "link": p["url"]}
            for p in d.get("photos", [])]


def pixabay(q, video, n):
    k = chave("pixabay")
    if not k:
        return []
    if video:
        d = pegar(f"https://pixabay.com/api/videos/?key={k}&q={urllib.parse.quote(q)}&per_page={max(3, n)}")
        return [{"url": h["videos"]["large"]["url"] or h["videos"]["medium"]["url"], "ext": ".mp4", "autor": h["user"],
                 "licenca": "Pixabay Content License (uso livre)", "link": h["pageURL"]} for h in d.get("hits", [])][:n]
    d = pegar(f"https://pixabay.com/api/?key={k}&q={urllib.parse.quote(q)}&image_type=photo&orientation=vertical&per_page={max(3, n)}")
    return [{"url": h["largeImageURL"], "ext": ".jpg", "autor": h["user"], "licenca": "Pixabay Content License (uso livre)", "link": h["pageURL"]}
            for h in d.get("hits", [])][:n]


def openverse(q, video, n):
    if video:
        return []
    d = pegar(f"https://api.openverse.org/v1/images/?q={urllib.parse.quote(q)}&license_type=commercial,modification&page_size={n}")
    return [{"url": r["url"], "ext": Path(urllib.parse.urlparse(r["url"]).path).suffix or ".jpg", "autor": r.get("creator") or "?",
             "licenca": f"{(r.get('license') or '').upper()} {r.get('license_version') or ''}".strip(), "link": r.get("foreign_landing_url")}
            for r in d.get("results", [])]


def main():
    a = sys.argv[1:]
    if len(a) < 3:
        sys.exit(__doc__)
    trab, nome, q = Path(a[0]), a[1], a[2]
    video = "--video" in a
    n = int(a[a.index("--quantos") + 1]) if "--quantos" in a else 4
    fonte = a[a.index("--fonte") + 1] if "--fonte" in a else "auto"
    ruins = [g for g in GENERICOS if re.search(g, q.lower())]
    if ruins or len(q.split()) < 3:
        sys.exit("busca genérica ou curta demais: descreva pessoa + ação + lugar (ex.: 'tired baker at dawn looking at phone')")
    ordem = [fonte] if fonte != "auto" else (["pexels", "pixabay"] if video else ["pexels", "pixabay", "openverse"])
    achados, usada = [], None
    # bancos casam todas as palavras: busca longa pode voltar vazia; encurta do fim até 3 palavras antes de desistir
    palavras = q.split()
    for f in ordem:
        for corte in range(len(palavras), 2, -1):
            busca = " ".join(palavras[:corte])
            try:
                achados = {"pexels": pexels, "pixabay": pixabay, "openverse": openverse}[f](busca, video, n)
            except Exception as e:
                print(f"{f}: {str(e)[:120]}")
                achados = []
                break
            if achados:
                break
        if achados:
            usada = f"{f} (busca: '{busca}')"
            break
    if not achados:
        sys.exit("nada encontrado (ou sem chave: python3 fontes.py configurar pexels). Mude a busca ou troque por animação.")
    reg = trab / "assets.json"
    lista = json.loads(reg.read_text(encoding="utf-8")) if reg.exists() else []
    cand = trab / "app/public/assets/_candidatos"
    cand.mkdir(parents=True, exist_ok=True)
    baixados = []
    for i, r in enumerate(achados[:n], 1):
        destino = cand / f"{nome}_b{i}{r['ext'] if len(r['ext']) <= 5 else '.jpg'}"
        try:
            with urllib.request.urlopen(urllib.request.Request(r["url"], headers=UA), timeout=120) as resp:
                destino.write_bytes(resp.read())
        except Exception as e:
            print(f"não baixou {r['url'][:80]}: {e}")
            continue
        lista.append({"nome": destino.stem, "base": nome, "fonte": f"banco:{usada}", "busca": q, "arquivo": str(destino.relative_to(trab / "app/public")),
                      "autor": r["autor"], "licenca": r["licenca"], "link": r["link"], "status": "candidato", "aprovado": None})
        baixados.append(destino)
    reg.write_text(json.dumps(lista, ensure_ascii=False, indent=1), encoding="utf-8")
    if not baixados:
        sys.exit("nenhum arquivo baixou")
    lado = cand / f"{nome}_lado-a-lado.jpg"
    folha(baixados, lado)
    for b in baixados:
        print(f"candidato: {b.relative_to(trab / 'app/public')}")
    print(f"fonte: {usada}. OLHE {lado} e aprove só o que passar na régua (nota >= 8):\n"
          f"  python3 {Path(__file__).with_name('gerar.py')} aprovar {trab} <candidato> --nota N --porque \"...\"\n"
          "Crédito: autor e licença ficam no assets.json; ponha no texto do post quando a licença pedir.")


if __name__ == "__main__":
    main()
