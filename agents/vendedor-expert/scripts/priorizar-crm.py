"""Prioriza leads do CRM pro lote do dia (worker vendedor-expert).

Uso:
  python agents/vendedor-expert/scripts/priorizar-crm.py <arquivo> [--n 10] [--origem sessao_estrategica] [--status a_reativar]

<arquivo> = resultado salvo do download_file_content (JSON com "content" em base64)
            ou um CSV exportado da aba CRM.
Só lê e imprime. Não grava nada (dados pessoais não vão pro repositório — R-005).
"""
import argparse
import base64
import csv
import io
import json
import sys
from datetime import date, datetime

ORIGEM_PESO = {"sessao_estrategica": 0, "comprador_outro_produto": 1, "webinar_metodo_1h": 2, "grupo_whatsapp": 3}
FORA = {"fechou", "desistiu"}


def carregar(caminho):
    bruto = open(caminho, encoding="utf-8").read()
    try:
        obj = json.loads(bruto)
        texto = base64.b64decode(obj["content"]).decode("utf-8")
    except (ValueError, KeyError):
        texto = bruto
    linhas = list(csv.reader(io.StringIO(texto)))
    # cabeçalho = linha que contém "lead_id"
    i = next(k for k, l in enumerate(linhas) if "lead_id" in l)
    cab = [c.strip() for c in linhas[i]]
    return [dict(zip(cab, l)) for l in linhas[i + 1:] if any(x.strip() for x in l)]


def data_proximo(v):
    for fmt in ("%d/%m/%Y", "%Y-%m-%d", "%d/%m"):
        try:
            d = datetime.strptime(v.strip(), fmt).date()
            return d.replace(year=date.today().year) if fmt == "%d/%m" else d
        except ValueError:
            pass
    return None


def chave(lead):
    hoje = date.today()
    prox = data_proximo(lead.get("Proximo contato", ""))
    vencido = 0 if (prox and prox <= hoje) else 1
    try:
        urg = -int(lead.get("Urgencia", "") or 0)
    except ValueError:
        urg = 0
    origem = (lead.get("Origem", "").split(" ")[0]).strip()
    return (vencido, urg, ORIGEM_PESO.get(origem, 9))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("arquivo")
    ap.add_argument("--n", type=int, default=10)
    ap.add_argument("--origem")
    ap.add_argument("--status")
    a = ap.parse_args()

    leads = [l for l in carregar(a.arquivo) if l.get("Status", "").strip() not in FORA]
    if a.origem:
        leads = [l for l in leads if l.get("Origem", "").startswith(a.origem)]
    if a.status:
        leads = [l for l in leads if l.get("Status", "").strip() == a.status]
    leads.sort(key=chave)

    contagem = {}
    for l in leads:
        contagem[l.get("Status", "").strip() or "(vazio)"] = contagem.get(l.get("Status", "").strip() or "(vazio)", 0) + 1
    print(f"Leads ativos: {len(leads)} · por status: {contagem}\n")

    corta = lambda s, n=220: (s or "").replace("\n", " ").strip()[:n]
    for k, l in enumerate(leads[: a.n], 1):
        print(f"[{k}] {l.get('Nome','')} · {corta(l.get('Origem',''),60)} · urg {l.get('Urgencia','') or '-'} · status {l.get('Status','')} · próximo {l.get('Proximo contato','') or '-'}")
        print(f"    Contato: tel {l.get('Telefone','') or '-'} · ig {l.get('Instagram','') or '-'}")
        print(f"    Resumo: {corta(l.get('Resumo (IA)',''))}")
        print(f"    Já tentou: {corta(l.get('O que ja tentou',''),160)}")
        print(f"    Último follow-up: {corta(l.get('Ultimo follow-up',''),160)}\n")


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")
    main()
