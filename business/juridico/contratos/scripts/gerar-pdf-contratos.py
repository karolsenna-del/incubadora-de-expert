"""
Gera as versoes HTML branded dos contratos (Incubadora de Expert), prontas
pra virar PDF via Playwright (page.pdf()).

Uso:
    python gerar-pdf-contratos.py

Le os .md em business/juridico/contratos/, funde cada contrato especifico
com o Anexo I (Termos Gerais) e escreve um .html estilizado em
business/juridico/contratos/pdf/. O passo de HTML -> PDF e feito
separadamente (Playwright), este script so prepara o HTML.

Paleta e tipografia reaproveitadas das paginas de venda reais
(business/campanhas/crm-reativacao-leads/paginas-vendas/site/), nao
inventadas: Sora (Google Fonts) + #0B0B0C / #FF6B1A / #FFFFFF / #F4F4F5.
"""
import re
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
OUT_DIR = BASE_DIR / "pdf"
OUT_DIR.mkdir(exist_ok=True)

ANEXO_I_PATH = BASE_DIR / "00-termos-gerais-prestacao-servicos.md"

# (arquivo, titulo do documento, subtitulo/servico, funde Anexo I?)
DOCUMENTOS = [
    ("00-termos-gerais-prestacao-servicos.md", "Termos e Condições Gerais", "Anexo I — Prestação de Serviços", False),
    ("01-metodo-express.md", "Contrato de Prestação de Serviços", "Método Express", True),
    ("02-metodo-vip.md", "Contrato de Prestação de Serviços", "Método VIP", True),
    ("03-sprint-do-metodo.md", "Contrato de Prestação de Serviços", "Sprint do Método", True),
    ("04-grupo.md", "Contrato de Prestação de Serviços", "Mentoria Grupo", True),
    ("05-individual.md", "Contrato de Prestação de Serviços", "Mentoria Individual", True),
    ("06-diagnostico-ferramentas.md", "Contrato de Prestação de Serviços", "Diagnóstico Ferramentas", True),
    ("07-expert360-termos-de-compra.md", "Termos de Compra e Licença de Uso", "Curso Expert360º", False),
    ("08-aditivo-continuacao-pos-sprint.md", "Aditivo Contratual", "Continuação pós-Sprint do Método", True),
]

INLINE_PATTERN = re.compile(r"(\*\*.+?\*\*|\*.+?\*|`.+?`)")


def inline_html(text: str) -> str:
    parts = INLINE_PATTERN.split(text)
    out = []
    for part in parts:
        if not part:
            continue
        if part.startswith("**") and part.endswith("**"):
            out.append(f"<strong>{part[2:-2]}</strong>")
        elif part.startswith("*") and part.endswith("*") and len(part) > 1:
            out.append(f"<em>{part[1:-1]}</em>")
        elif part.startswith("`") and part.endswith("`"):
            out.append(f"<code>{part[1:-1]}</code>")
        else:
            out.append(part)
    return "".join(out)


def md_to_html(md_text: str, skip_first_h1=True) -> str:
    lines = md_text.splitlines()
    html = []
    i, n = 0, len(lines)
    skipped_h1 = not skip_first_h1
    while i < n:
        line = lines[i]
        stripped = line.strip()

        if not stripped:
            i += 1
            continue

        if stripped == "---":
            html.append('<hr class="divisor">')
            i += 1
            continue

        # tabelas
        if stripped.startswith("|"):
            rows = []
            while i < n and lines[i].strip().startswith("|"):
                rows.append(lines[i].strip())
                i += 1
            cells = [[c.strip() for c in r.strip("|").split("|")] for r in rows]
            cells = [r for r in cells if not all(re.match(r"^:?-+:?$", c) for c in r)]
            if cells:
                html.append('<table class="tabela"><thead><tr>')
                for c in cells[0]:
                    html.append(f"<th>{inline_html(c)}</th>")
                html.append("</tr></thead><tbody>")
                for row in cells[1:]:
                    html.append("<tr>")
                    for c in row:
                        html.append(f"<td>{inline_html(c)}</td>")
                    html.append("</tr>")
                html.append("</tbody></table>")
            continue

        # headers
        m = re.match(r"^(#{1,6})\s+(.*)$", stripped)
        if m:
            level = len(m.group(1))
            text = inline_html(m.group(2))
            if level == 1 and not skipped_h1:
                skipped_h1 = True
                i += 1
                continue
            tag = {1: "h1", 2: "h2", 3: "h3"}.get(level, "h4")
            css_class = ' class="clausula"' if level == 2 else ""
            html.append(f"<{tag}{css_class}>{text}</{tag}>")
            i += 1
            continue

        # blockquote (agrupa linhas consecutivas)
        if stripped.startswith(">"):
            buf = []
            while i < n and lines[i].strip().startswith(">"):
                buf.append(inline_html(lines[i].strip().lstrip(">").strip()))
                i += 1
            html.append('<div class="callout">' + "<br>".join(buf) + "</div>")
            continue

        # checkbox de selecao (usado no aditivo)
        if stripped.startswith("( )"):
            html.append(f'<p class="checkbox">☐ {inline_html(stripped[3:].strip())}</p>')
            i += 1
            continue

        # lista numerada
        m2 = re.match(r"^\d+\.\s+(.*)$", stripped)
        if m2:
            buf = []
            while i < n:
                mm = re.match(r"^\d+\.\s+(.*)$", lines[i].strip())
                if not mm:
                    break
                buf.append(f"<li>{inline_html(mm.group(1))}</li>")
                i += 1
            html.append("<ol>" + "".join(buf) + "</ol>")
            continue

        # lista com marcador
        if stripped.startswith("- ") or stripped.startswith("* "):
            buf = []
            while i < n and (lines[i].strip().startswith("- ") or lines[i].strip().startswith("* ")):
                buf.append(f"<li>{inline_html(lines[i].strip()[2:].strip())}</li>")
                i += 1
            html.append("<ul>" + "".join(buf) + "</ul>")
            continue

        # linha de assinatura (____) -> ignorada aqui, montamos bloco de assinatura a parte
        if set(stripped) == {"_"}:
            i += 1
            continue

        # paragrafo comum
        html.append(f"<p>{inline_html(stripped)}</p>")
        i += 1

    return "\n".join(html)


def strip_leading_titles(md_text: str) -> str:
    """Remove o '# Titulo' + '## Subtitulo' do topo do .md — a capa branded
    ja cobre esse conteudo, entao evita duplicar como clausula."""
    lines = md_text.splitlines()
    idx = 0
    while idx < len(lines) and not lines[idx].strip():
        idx += 1
    if idx < len(lines) and re.match(r"^#\s+", lines[idx].strip()):
        idx += 1
        while idx < len(lines) and not lines[idx].strip():
            idx += 1
        if idx < len(lines) and re.match(r"^##\s+", lines[idx].strip()):
            idx += 1
    return "\n".join(lines[idx:])


def strip_signature_block(md_text: str) -> str:
    """Remove o bloco final '--- Local:/Data: ... assinaturas' dos
    contratos especificos, porque montamos um bloco de assinatura unico
    depois do Anexo I fundido."""
    m = re.search(r"^Local:\s*_+\s*$", md_text, flags=re.MULTILINE)
    if not m:
        return md_text
    idx = m.start()
    # corta tambem o '---' logo antes do marker
    head = md_text[:idx]
    head = re.sub(r"-{3,}\s*$", "", head.rstrip())
    return head


def build_signature_block(contratante_label="CONTRATANTE") -> str:
    return f"""
    <div class="assinatura">
      <div class="campos-local-data">
        <p class="campo-linha">Local: <span class="campo-branco"></span></p>
        <p class="campo-linha">Data: <span class="campo-branco"></span></p>
      </div>
      <div class="assinaturas-grid">
        <div class="bloco-assinatura">
          <div class="linha-assinatura"></div>
          <p>CONTRATADA<br><strong>Gestão pra Tudo - Karoline Franzini de Carvalho Senna</strong></p>
        </div>
        <div class="bloco-assinatura">
          <div class="linha-assinatura"></div>
          <p>{contratante_label}</p>
        </div>
      </div>
    </div>
    """


CSS = """
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&display=swap');

:root {
  --preto: #0B0B0C;
  --preto-2: #151517;
  --branco: #FFFFFF;
  --laranja: #FF6B1A;
  --laranja-escuro: #E85A0D;
  --cinza-100: #F4F4F5;
  --cinza-300: #D4D4D8;
  --cinza-500: #71717A;
  --cinza-700: #3F3F46;
  --display: 'Sora', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --texto: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
* { box-sizing: border-box; }
body {
  font-family: var(--texto);
  color: var(--preto);
  background: var(--branco);
  font-size: 10.5pt;
  line-height: 1.55;
  margin: 0;
  padding: 0 6mm;
}
.capa {
  background: var(--preto);
  color: var(--branco);
  border-radius: 14px;
  padding: 30px 34px;
  margin: 4mm 0 10mm;
}
.capa .eyebrow {
  display: inline-block;
  font-family: var(--display);
  font-size: 8.5pt;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--laranja);
  border: 1px solid rgba(255, 107, 26, 0.4);
  border-radius: 100px;
  padding: 5px 14px;
  margin-bottom: 14px;
}
.capa h1 {
  font-family: var(--display);
  font-weight: 800;
  font-size: 19pt;
  color: var(--branco);
  margin: 0 0 6px;
  line-height: 1.15;
}
.capa .subtitulo {
  font-family: var(--display);
  font-weight: 700;
  font-size: 13pt;
  color: var(--laranja);
  margin: 0 0 14px;
}
.capa .meta {
  color: var(--cinza-300);
  font-size: 9pt;
  line-height: 1.7;
  margin: 0;
}
h1 {
  font-family: var(--display);
  font-weight: 800;
  font-size: 14pt;
  color: var(--preto);
  margin: 22px 0 10px;
}
h2.clausula {
  font-family: var(--display);
  font-weight: 700;
  font-size: 11pt;
  color: var(--preto);
  border-left: 3px solid var(--laranja);
  padding-left: 10px;
  margin: 20px 0 8px;
  page-break-after: avoid;
}
h3 {
  font-family: var(--display);
  font-weight: 700;
  font-size: 10.5pt;
  color: var(--preto);
  margin: 14px 0 6px;
}
p { margin: 0 0 8px; text-align: justify; }
p.checkbox { font-weight: 600; }
strong { color: var(--preto); }
code {
  font-family: 'Consolas', monospace;
  background: var(--cinza-100);
  padding: 1px 5px;
  border-radius: 4px;
  font-size: 9pt;
}
.callout {
  background: var(--cinza-100);
  border-left: 3px solid var(--laranja);
  border-radius: 0 10px 10px 0;
  padding: 10px 14px;
  margin: 10px 0;
  font-style: italic;
  color: var(--cinza-700);
  font-size: 9.5pt;
}
hr.divisor {
  border: none;
  border-top: 1px solid var(--cinza-300);
  margin: 16px 0;
}
table.tabela {
  width: 100%;
  border-collapse: collapse;
  margin: 10px 0 14px;
  font-size: 9pt;
}
table.tabela th {
  background: var(--preto);
  color: var(--branco);
  font-family: var(--display);
  font-weight: 600;
  text-align: left;
  padding: 7px 9px;
}
table.tabela td {
  border-bottom: 1px solid var(--cinza-300);
  padding: 7px 9px;
  vertical-align: top;
}
table.tabela tr:nth-child(even) td { background: var(--cinza-100); }
ol, ul { margin: 0 0 10px; padding-left: 22px; }
li { margin-bottom: 4px; }
.anexo-divisor {
  page-break-before: always;
  background: var(--preto);
  color: var(--branco);
  border-radius: 14px;
  padding: 22px 28px;
  margin: 10mm 0 8mm;
}
.anexo-divisor .eyebrow {
  display: inline-block;
  font-family: var(--display);
  font-size: 8.5pt;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--laranja);
  margin-bottom: 8px;
}
.anexo-divisor h2 {
  font-family: var(--display);
  font-weight: 800;
  font-size: 15pt;
  margin: 0;
  color: var(--branco);
}
.assinatura {
  page-break-inside: avoid;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 2px solid var(--laranja);
}
.campos-local-data { margin-bottom: 26px; }
.campo-linha { margin-bottom: 10px; }
.campo-branco {
  display: inline-block;
  min-width: 220px;
  border-bottom: 1px solid var(--preto);
  height: 14px;
  vertical-align: bottom;
}
.assinaturas-grid {
  display: flex;
  gap: 30px;
}
.bloco-assinatura { flex: 1; text-align: center; }
.linha-assinatura {
  border-top: 1px solid var(--preto);
  margin-bottom: 8px;
  height: 30px;
}
.bloco-assinatura p { text-align: center; font-size: 9pt; color: var(--cinza-700); }
"""


def render_document(md_path: Path, titulo: str, subtitulo: str, fundir_anexo: bool) -> str:
    raw = md_path.read_text(encoding="utf-8")
    contratante_label = "CONTRATANTE" if "CONTRATANTE" in raw else "COMPRADOR(A)"

    if md_path.name == "00-termos-gerais-prestacao-servicos.md":
        corpo = md_to_html(strip_leading_titles(raw), skip_first_h1=False)
        capa = f"""
        <div class="capa">
          <span class="eyebrow">Incubadora de Expert</span>
          <h1>{titulo}</h1>
          <p class="subtitulo">{subtitulo}</p>
          <p class="meta">Gestão pra Tudo - Karoline Franzini de Carvalho Senna — CNPJ 38.431.977/0001-36</p>
        </div>
        """
        return f"<!doctype html><html><head><meta charset='utf-8'><style>{CSS}</style></head><body>{capa}{corpo}</body></html>"

    corpo_especifico = strip_leading_titles(strip_signature_block(raw))
    corpo_especifico_html = md_to_html(corpo_especifico, skip_first_h1=False)

    capa = f"""
    <div class="capa">
      <span class="eyebrow">Incubadora de Expert · Instrumento Particular</span>
      <h1>{titulo}</h1>
      <p class="subtitulo">{subtitulo}</p>
      <p class="meta">
        CONTRATADA: Gestão pra Tudo - Karoline Franzini de Carvalho Senna — CNPJ 38.431.977/0001-36
      </p>
    </div>
    """

    anexo_html = ""
    if fundir_anexo:
        anexo_raw = ANEXO_I_PATH.read_text(encoding="utf-8")
        anexo_body = md_to_html(strip_leading_titles(anexo_raw), skip_first_h1=False)
        anexo_html = f"""
        <div class="anexo-divisor">
          <span class="eyebrow">Parte integrante deste contrato</span>
          <h2>Anexo I — Termos e Condições Gerais</h2>
        </div>
        {anexo_body}
        """

    assinatura = build_signature_block(contratante_label)

    return f"""<!doctype html><html><head><meta charset='utf-8'><style>{CSS}</style></head>
    <body>{capa}{corpo_especifico_html}{anexo_html}{assinatura}</body></html>"""


def main():
    for filename, titulo, subtitulo, fundir in DOCUMENTOS:
        md_path = BASE_DIR / filename
        html = render_document(md_path, titulo, subtitulo, fundir)
        out_path = OUT_DIR / (Path(filename).stem + ".html")
        out_path.write_text(html, encoding="utf-8")
        print(f"OK: {out_path}")


if __name__ == "__main__":
    main()
