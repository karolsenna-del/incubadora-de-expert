"""Gera js/descricoes-aulas.js da Area de Membros a partir das fontes oficiais.

Fontes:
  - business/producao/expert360/descricoes.md  (texto: ## Modulo -> ### descricao_slug -> texto)
  - agents/course-publisher/data/config.yaml    (aula -> descricao_slug, youtube_id, titulo)

Saida: business/campanhas/area-de-membros/site/js/descricoes-aulas.js
Chaves: youtube_id (quando a aula tem video) e "{moduloId}|{titulo}" (fallback pra aula sem video).

Rodar sempre que descricoes.md ou config.yaml mudar, depois deploy (vercel --prod).
"""
import io
import json
import re
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[3]
DESCRICOES = ROOT / "business/producao/expert360/descricoes.md"
CONFIG = ROOT / "agents/course-publisher/data/config.yaml"
SAIDA = ROOT / "business/campanhas/area-de-membros/site/js/descricoes-aulas.js"

# id do modulo no config.yaml -> id do modulo no data.js da Area de Membros
MODULO_SITE = {"M0": "m0", "M1": "m1", "M2": "m2", "M3": "m3", "M4": "m4",
               "modulo-orientacoes": "orientacoes"}


def ler_descricoes() -> dict:
    texto = io.open(DESCRICOES, encoding="utf-8").read().replace("\r\n", "\n")
    out, modulo, slug, buf = {}, None, None, []

    def fechar():
        if modulo and slug:
            out.setdefault(modulo, {})[slug] = "\n".join(buf).strip().strip("-").strip()

    for linha in texto.split("\n"):
        if linha.startswith("## "):
            fechar(); modulo, slug, buf = linha[3:].strip(), None, []
        elif linha.startswith("### "):
            fechar(); slug, buf = linha[4:].strip(), []
        elif slug:
            buf.append(linha)
    fechar()
    return out


def main():
    descricoes = ler_descricoes()
    config = yaml.safe_load(io.open(CONFIG, encoding="utf-8"))
    por_youtube, por_titulo, faltando = {}, {}, []

    for mod in config["modules"]:
        mod_site = MODULO_SITE.get(mod["id"])
        textos = descricoes.get(mod["id"], {})
        for aula in mod["lessons"]:
            txt = textos.get(aula["descricao_slug"])
            if not txt:
                faltando.append(f'{mod["id"]}/{aula["descricao_slug"]}')
                continue
            if aula.get("youtube_id"):
                por_youtube[aula["youtube_id"]] = txt
            if mod_site:
                por_titulo[f'{mod_site}|{aula["hotmart_name"]}'] = txt

    js = (
        "// GERADO por agents/course-publisher/scripts/gerar-descricoes-site.py — NAO editar a mao.\n"
        "// Fonte do texto: business/producao/expert360/descricoes.md\n"
        f"const DESCRICOES_AULAS = {json.dumps({'porYoutube': por_youtube, 'porTitulo': por_titulo}, ensure_ascii=False, indent=2)};\n"
    )
    io.open(SAIDA, "w", encoding="utf-8", newline="\n").write(js)
    print(f"{len(por_youtube)} por youtube_id, {len(por_titulo)} por titulo -> {SAIDA.relative_to(ROOT)}")
    if faltando:
        print("Sem descricao em descricoes.md:", ", ".join(faltando))


if __name__ == "__main__":
    main()
