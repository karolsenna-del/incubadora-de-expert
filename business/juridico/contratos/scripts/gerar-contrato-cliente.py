"""
Gera o PDF branded de um contrato JA PREENCHIDO pra um cliente especifico.

Uso:
    python gerar-contrato-cliente.py <caminho do .md do cliente> "<Servico>" "<Nome do cliente>"

Exemplo:
    python gerar-contrato-cliente.py ../../contratos-clientes/2026/vagner-teixeira-sprint-do-metodo.md "Sprint do Método" "Vagner Alexandre Teixeira"

Fluxo: copiar o modelo (03-sprint-do-metodo.md etc.) pra
business/juridico/contratos-clientes/{ano}/{cliente}-{oferta}.md (pasta fora
do git — tem CPF/endereco), preencher os dados do cliente em texto corrido no
preambulo, ajustar condicoes especificas e rodar este script. Reaproveita o
render de gerar-pdf-contratos.py (mesma capa, Anexo I fundido, rodape);
so muda o bloco de assinatura (Local preenchido + nome do cliente).
"""
import importlib.util
import sys
from pathlib import Path

from playwright.sync_api import sync_playwright

SCRIPTS_DIR = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location("gerar", SCRIPTS_DIR / "gerar-pdf-contratos.py")
gerar = importlib.util.module_from_spec(spec)
spec.loader.exec_module(gerar)


def main():
    if len(sys.argv) != 4:
        print(__doc__)
        sys.exit(1)
    md_path = Path(sys.argv[1]).resolve()
    servico, nome_cliente = sys.argv[2], sys.argv[3]

    bloco_original = gerar.build_signature_block

    def bloco_cliente(label="CONTRATANTE"):
        html = bloco_original(label)
        html = html.replace('Local: <span class="campo-branco"></span>', "Local: <strong>Campo Grande/MS</strong>", 1)
        return html.replace(f"<p>{label}</p>", f"<p>{label}<br><strong>{nome_cliente}</strong></p>")

    gerar.build_signature_block = bloco_cliente
    html = gerar.render_document(md_path, "Contrato de Prestação de Serviços", servico, True)

    html_path = md_path.with_suffix(".html")
    pdf_path = md_path.with_suffix(".pdf")
    html_path.write_text(html, encoding="utf-8")
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.goto(html_path.as_uri())
        page.wait_for_load_state("networkidle")
        page.pdf(path=str(pdf_path), format="A4", print_background=True,
                 margin={"top": "14mm", "bottom": "16mm", "left": "10mm", "right": "10mm"})
        browser.close()
    html_path.unlink()
    print(f"OK: {pdf_path}")


if __name__ == "__main__":
    main()
