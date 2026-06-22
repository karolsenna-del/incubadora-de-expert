"""
Course Publisher — Preparador de Videos
Copia videos do Capcut para a pasta de producao com nomes limpos.
Expert360 | Incubadora de Expert
"""

import os
import re
import shutil
import unicodedata

# ─── CONFIGURACAO ────────────────────────────────────────────────────────────

CAPCUT_BASE = r"C:\Users\karol\OneDrive\Videos\Capcut\Expert360"

PRODUCAO_BASE = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..")
)  # business/producao/expert360/

# Mapeamento: nome da pasta Capcut → pasta de producao
MODULOS = {
    "Módulo 0 - Desbloqueio - EDT": "M0",
    "Módulo 1 - Persona + Promessa": "M1",
    # Adicionar M2, M3, M4 quando estiverem gravados:
    # "Módulo 2 - ...": "M2",
    # "Módulo 3 - ...": "M3",
    # "Módulo 4 - ...": "M4",
}

# ─── FUNCOES ─────────────────────────────────────────────────────────────────

def remover_acentos(texto):
    nfkd = unicodedata.normalize("NFKD", texto)
    return "".join(c for c in nfkd if not unicodedata.combining(c))


def gerar_slug(titulo):
    slug = remover_acentos(titulo.lower())
    slug = re.sub(r"[^\w\s-]", "", slug)
    slug = re.sub(r"[\s_]+", "-", slug.strip())
    slug = re.sub(r"-+", "-", slug)
    return slug


def extrair_info(filename):
    """
    Extrai numero da aula e titulo do nome do arquivo Capcut.
    Formato esperado: M0- Aula 3 — Titulo Aqui EDT.mp4
    """
    nome = os.path.splitext(filename)[0]  # sem extensao

    # Tenta extrair numero e titulo
    match = re.match(
        r"^M\d+[-\s]*Aula\s+(\d+)\s*[—\-]+\s*(.+?)(?:\s+EDT)?\s*$",
        nome,
        re.IGNORECASE,
    )
    if match:
        numero = int(match.group(1))
        titulo = match.group(2).strip()
        return numero, titulo

    return None, None


def main():
    print("\n=== COURSE PUBLISHER — Preparar Videos ===\n")

    plano = []  # (origem, destino, nome_destino)

    # Descobrir o que vai ser copiado
    for pasta_capcut, modulo_slug in MODULOS.items():
        origem_dir = os.path.join(CAPCUT_BASE, pasta_capcut)
        destino_dir = os.path.join(PRODUCAO_BASE, modulo_slug)

        if not os.path.exists(origem_dir):
            print(f"  [AVISO] Pasta nao encontrada: {origem_dir}")
            continue

        arquivos = [
            f for f in os.listdir(origem_dir) if f.lower().endswith(".mp4")
        ]
        arquivos.sort()

        for arq in arquivos:
            numero, titulo = extrair_info(arq)
            if numero is None:
                print(f"  [AVISO] Nao reconheci o padrao: {arq}")
                continue

            slug = gerar_slug(titulo)
            nome_destino = f"{numero:02d}-{slug}.mp4"

            plano.append({
                "modulo": modulo_slug,
                "origem": os.path.join(origem_dir, arq),
                "destino": os.path.join(destino_dir, nome_destino),
                "nome_origem": arq,
                "nome_destino": nome_destino,
            })

    if not plano:
        print("Nenhum video encontrado para copiar.")
        return

    # Mostrar plano
    print("Plano de copia:\n")
    modulo_atual = None
    for item in plano:
        if item["modulo"] != modulo_atual:
            modulo_atual = item["modulo"]
            print(f"  [{modulo_atual}]")
        print(f"    {item['nome_origem']}")
        print(f"    -> {item['nome_destino']}\n")

    total = len(plano)
    print(f"Total: {total} video(s)\n")
    resposta = input("Confirmar copia? (s/n): ").strip().lower()

    if resposta != "s":
        print("Cancelado.")
        return

    # Executar copia
    print()
    copiados = []
    erros = []

    for item in plano:
        os.makedirs(os.path.dirname(item["destino"]), exist_ok=True)
        print(f"  Copiando {item['nome_destino']}...", end=" ")
        try:
            shutil.copy2(item["origem"], item["destino"])
            print("OK")
            copiados.append(item["nome_destino"])
        except Exception as e:
            print(f"ERRO: {e}")
            erros.append((item["nome_destino"], str(e)))

    print(f"\n=== RELATORIO ===")
    print(f"Copiados: {len(copiados)}/{total}")
    if erros:
        for nome, err in erros:
            print(f"  ERRO {nome}: {err}")
    print(f"\nDestino: {PRODUCAO_BASE}")


if __name__ == "__main__":
    main()
