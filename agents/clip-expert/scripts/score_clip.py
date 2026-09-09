#!/usr/bin/env python3
"""
score_clip.py — Calcula a nota final (0-10) de um trecho candidato a corte,
a partir das notas dos 3 eixos da rubrica (ver data/clip-expert-kb.md,
secao "Rubrica de Pontuacao").

A atribuicao das notas de cada eixo (abertura, sustentacao, fechamento) e
uma tarefa semantica feita pelo agente @garimpeiro lendo a transcricao —
este script so estrutura o calculo da media ponderada e a decisao de
aprovar/descartar contra a nota minima configurada, garantindo que o
calculo e sempre o mesmo (nao varia entre execucoes por interpretacao
diferente da formula).

Uso:
    python score_clip.py --abertura 9 --sustentacao 9 --fechamento 8 \
        --nota-minima 7.0

    python score_clip.py --batch candidatos.json --config ../data/nota-minima.yaml

Formato de candidatos.json (para uso em lote):
[
  {
    "id": "candidato-01",
    "inicio": "14:32",
    "fim": "15:27",
    "abertura": 9,
    "sustentacao": 9,
    "fechamento": 8
  },
  ...
]
"""

import argparse
import json
import sys
from pathlib import Path

PESO_ABERTURA = 0.40
PESO_SUSTENTACAO = 0.35
PESO_FECHAMENTO = 0.25


def calcular_nota(abertura: float, sustentacao: float, fechamento: float) -> float:
    """Media ponderada dos 3 eixos da rubrica. Ver data/clip-expert-kb.md."""
    for nome, valor in [("abertura", abertura), ("sustentacao", sustentacao), ("fechamento", fechamento)]:
        if not (0 <= valor <= 10):
            raise ValueError(f"Eixo '{nome}' fora do range 0-10: {valor}")

    nota = (
        abertura * PESO_ABERTURA
        + sustentacao * PESO_SUSTENTACAO
        + fechamento * PESO_FECHAMENTO
    )
    return round(nota, 2)


def ler_nota_minima(config_path: Path) -> float:
    """Le data/nota-minima.yaml sem depender de PyYAML (parser minimo,
    so pra esse arquivo simples de chave:valor)."""
    if not config_path.exists():
        return 7.0
    for linha in config_path.read_text(encoding="utf-8").splitlines():
        linha = linha.strip()
        if linha.startswith("nota_minima:"):
            return float(linha.split(":", 1)[1].strip())
    return 7.0


def avaliar_candidato(candidato: dict, nota_minima: float) -> dict:
    nota = calcular_nota(
        candidato["abertura"], candidato["sustentacao"], candidato["fechamento"]
    )
    candidato_avaliado = dict(candidato)
    candidato_avaliado["nota_final"] = nota
    candidato_avaliado["aprovado"] = nota >= nota_minima
    return candidato_avaliado


def processar_lote(caminho_json: Path, nota_minima: float) -> list:
    candidatos = json.loads(caminho_json.read_text(encoding="utf-8"))
    avaliados = [avaliar_candidato(c, nota_minima) for c in candidatos]
    # Ordena por nota decrescente — convencao de nomeacao dos cortes
    # (corte-01 = maior nota) depende dessa ordem, ver clip-expert-kb.md
    avaliados.sort(key=lambda c: c["nota_final"], reverse=True)
    return avaliados


def main():
    parser = argparse.ArgumentParser(description="Calcula nota de corte candidato (rubrica Clip Expert)")
    parser.add_argument("--abertura", type=float, help="Nota do eixo Abertura (0-10)")
    parser.add_argument("--sustentacao", type=float, help="Nota do eixo Sustentacao (0-10)")
    parser.add_argument("--fechamento", type=float, help="Nota do eixo Fechamento (0-10)")
    parser.add_argument("--nota-minima", type=float, default=None, help="Override manual da nota minima")
    parser.add_argument("--batch", type=Path, help="Caminho pra um JSON com lista de candidatos")
    parser.add_argument(
        "--config",
        type=Path,
        default=Path(__file__).parent.parent / "data" / "nota-minima.yaml",
        help="Caminho pro nota-minima.yaml (default: ../data/nota-minima.yaml)",
    )
    args = parser.parse_args()

    nota_minima = args.nota_minima if args.nota_minima is not None else ler_nota_minima(args.config)

    if args.batch:
        resultado = processar_lote(args.batch, nota_minima)
        print(json.dumps(resultado, indent=2, ensure_ascii=False))
        aprovados = [c for c in resultado if c["aprovado"]]
        print(f"\n{len(aprovados)}/{len(resultado)} candidatos aprovados (nota minima: {nota_minima})", file=sys.stderr)
        return

    if args.abertura is None or args.sustentacao is None or args.fechamento is None:
        parser.error("Informe --abertura, --sustentacao e --fechamento, ou use --batch")

    nota = calcular_nota(args.abertura, args.sustentacao, args.fechamento)
    aprovado = nota >= nota_minima
    print(f"Nota final: {nota}")
    print(f"Nota minima: {nota_minima}")
    print(f"Aprovado: {'SIM' if aprovado else 'NAO'}")


if __name__ == "__main__":
    main()
