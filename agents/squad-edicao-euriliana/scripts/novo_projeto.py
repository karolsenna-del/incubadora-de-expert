#!/usr/bin/env python3
"""Etapa 2 — cria o projeto Remotion do vídeo em <trabalho>/app a partir do template da skill (Mac, Windows e Linux).

Uso: python3 novo_projeto.py <pasta_do_trabalho> [trilha.mp3]      (no Windows: python novo_projeto.py ...)

  - copia o template sem sobrescrever o que o trabalho já tem (data.json, plano.json, custom/ e o resto);
  - recopia sempre o motor (src/motor/) e as cenas prontas (src/cenas/) da skill;
  - gera os efeitos sonoros em public/sfx;
  - trilha: a passada no comando; senão a trilha padrão do squad de edição da casa (se existir nesta máquina);
  - roda o npm install na primeira vez (e instala o lucide-react, dos ícones das cenas horizontais, em projeto antigo);
  - liga a cena "pacote3" aos pacotes horizontais originais do squad 3.0 quando eles estão nesta máquina (~/content-engine).
O novo_projeto.sh antigo só chama este script.
"""
import shutil
import subprocess
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import plataforma as pf  # noqa: E402

SKILL = Path(__file__).resolve().parent.parent
PULAR = {"node_modules", "out"}
# Trilha padrão do squad de edição da casa: no Mac do Euriler, o repositório; no aluno, o Squad Edição Arcane
# preparado pelo MCP ao lado desta pasta (agents/squad-edicao-arcane). A primeira que existir.
PADRAO = next((p for p in (Path.home() / "arkaeducation/arka1/squads/squad-edicao-arcane/data/trilhas/default.mp3",
                           SKILL.parent / "squad-edicao-arcane/data/trilhas/default.mp3") if p.is_file()),
              Path.home() / "arkaeducation/arka1/squads/squad-edicao-arcane/data/trilhas/default.mp3")


def copiar_sem_sobrescrever(origem, destino):
    """como rsync -a --ignore-existing --exclude node_modules --exclude out"""
    destino.mkdir(parents=True, exist_ok=True)
    for item in origem.iterdir():
        if item.name in PULAR:
            continue
        alvo = destino / item.name
        if item.is_dir():
            if alvo.exists() and not alvo.is_dir():
                continue
            copiar_sem_sobrescrever(item, alvo)
        elif not alvo.exists():
            shutil.copy2(item, alvo)


def recopiar(origem, destino):
    """como rsync -a origem/ destino/ (sobrescreve; não apaga o que só existe no destino)"""
    shutil.copytree(origem, destino, dirs_exist_ok=True)


# Pacotes horizontais do squad de edição 3.0 (Content Engine, packs pagos do Ryan): só existem no Mac do Euriler.
# São copiados para dentro do projeto do vídeo, nunca para a skill (a skill vai para alunos e a licença não cobre).
# Só os que aceitam texto próprio; os de gráfico e prova social têm números de exemplo fixos em inglês.
CE = Path.home() / "content-engine/src"
PACOTES3 = ("workflowsystemspack", "zoompanpack")
VC3 = ("CremeStage.tsx", "StudioGridBg.tsx", "fonts.ts", "style.ts")


def ligar_pacote3(app):
    destino = app / "src/pacote3"
    destino.mkdir(parents=True, exist_ok=True)
    achados = [p for p in PACOTES3 if (CE / "animations" / p / "index.tsx").is_file()]
    if achados and all((CE / "components/vc" / v).is_file() for v in VC3) and (CE / "engine.config.ts").is_file():
        ce = destino / "ce"
        for p in achados:
            recopiar(CE / "animations" / p, ce / "animations" / p)
        shutil.copy2(CE / "animations/_contract.ts", ce / "animations/_contract.ts")
        (ce / "components/vc").mkdir(parents=True, exist_ok=True)
        for v in VC3:
            shutil.copy2(CE / "components/vc" / v, ce / "components/vc" / v)
        shutil.copy2(CE / "engine.config.ts", ce / "engine.config.ts")
        linhas = [f"import {p} from './ce/animations/{p}';" for p in achados]
        (destino / "index.ts").write_text("// gerado pelo novo_projeto.py: pacotes do squad 3.0 copiados desta máquina (não versionar, não distribuir)\n"
                                          + "\n".join(linhas) + f"\nexport const PACOTES3: Record<string, any> = {{{', '.join(achados)}}};\n", encoding="utf-8")
        print(f"pacotes do squad 3.0 ligados na cena pacote3: {', '.join(achados)}")
    else:
        shutil.copy2(SKILL / "template/src/pacote3/index.ts", destino / "index.ts")


def main():
    if len(sys.argv) < 2 or not sys.argv[1]:
        print("uso: novo_projeto.py <trabalho> [trilha.mp3]")
        sys.exit(2)
    t = Path(sys.argv[1])
    trilha = Path(sys.argv[2]) if len(sys.argv) > 2 and sys.argv[2] else None
    app = t / "app"
    app.mkdir(parents=True, exist_ok=True)
    copiar_sem_sobrescrever(SKILL / "template", app)
    recopiar(SKILL / "template/src/motor", app / "src/motor")
    recopiar(SKILL / "template/src/cenas", app / "src/cenas")
    ligar_pacote3(app)
    for d in ("media", "assets", "sfx"):
        (app / "public" / d).mkdir(parents=True, exist_ok=True)
    subprocess.run([pf.python_com("numpy"), str(Path(__file__).with_name("sfx.py")), str(app / "public/sfx")],
                   check=True, stdout=subprocess.DEVNULL)
    if trilha and trilha.is_file():
        shutil.copy(trilha, app / "public/media/trilha.mp3")
    elif not (app / "public/media/trilha.mp3").is_file() and PADRAO.is_file():
        shutil.copy(PADRAO, app / "public/media/trilha.mp3")
    if not (app / "public/media/trilha.mp3").is_file():
        print("sem trilha neste projeto: escolha uma (trilhas.py usar ...) ou deixe o plano SEM \"trilha\" "
              "(trilha.src apontando para media/trilha.mp3 sem o arquivo derruba o render: \"Could not play audio\")")
    if not (app / "node_modules").is_dir():
        if not shutil.which("npm"):
            sys.exit("não achei o npm: instale o Node 22 (https://nodejs.org) e rode de novo")
        subprocess.run([*pf.comando("npm"), "install", "--no-audit", "--no-fund", "--loglevel=error"], cwd=app, check=True)
    elif not (app / "node_modules/lucide-react").is_dir():
        # projeto criado antes das cenas horizontais: falta a biblioteca de ícones
        subprocess.run([*pf.comando("npm"), "install", "lucide-react@1.21.0", "--no-audit", "--no-fund", "--loglevel=error"], cwd=app, check=True)
    print(f"projeto pronto em {t}/app")


if __name__ == "__main__":
    try:
        main()
    except subprocess.CalledProcessError as e:
        sys.exit(f"falhou: {' '.join(map(str, e.cmd))} (código {e.returncode})")
