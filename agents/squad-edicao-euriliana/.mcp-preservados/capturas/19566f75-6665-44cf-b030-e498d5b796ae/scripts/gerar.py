#!/usr/bin/env python3
"""Gera imagem ou take de vídeo no Higgsfield com PROTEÇÃO CONTRA GENÉRICO, baixa para o projeto e registra custo.

Regra do Euriler (03/10/2026): "sempre buscar um take ou imagem dahora, que pareça menos IA, menos banco de
imagem; proteção contra imagens genéricas e fracas; criativo, impactante, de preferência mais realista."
Por isso este script:
  1. barra prompt genérico antes de gastar (lista de clichês de banco de imagem/IA + prompt curto demais);
  2. acrescenta o estilo realista da casa (imagem e vídeo);
  3. gera VARIAÇÕES (imagem: 2 por padrão) em assets/_candidatos/, com uma folha lado a lado para olhar;
  4. só vira asset de verdade depois do `aprovar`, com nota da régua (references/fontes-de-imagem.md) >= 8.
     O conferir.py avisa se o plano usa candidato não aprovado.

Uso:
  python3 gerar.py <trabalho> <nome> <modelo> "<prompt de diretor de fotografia>" [--variacoes 2]
                   [--aspect_ratio 9:16] [--duration 5] [--image ref.png] [--start-image assets/x.png] [--custo]
  python3 gerar.py aprovar  <trabalho> <candidato> --nota 9 --porque "por que é forte"   (vira assets/<nome>.<ext>)
  python3 gerar.py reprovar <trabalho> <candidato> --porque "por que é fraco"            (fica registrado)

  <modelo>  imagem: gpt_image_2_5 (OBRIGATÓRIO para imagem de edição — regra do Euriler, 25/09)
            vídeo: veo3_1 | veo3_1_lite | seedance_2_5 | seedance_2_0 | kling3_0_turbo | kling3_0
            trilha: sonilo_music (~5 créditos), ex.: "tense cinematic pulse, no vocals" --duration 75
  --variacoes N  quantas versões gerar (imagem: 2; vídeo: 1 — take é caro; use 2 no take principal do vídeo)
  --sem-estilo   não acrescenta o estilo da casa (só para interface fictícia ou pedido explícito)
  --forcar       passa por cima da trava de genérico (diga no relatório por quê)

Imagem com gpt_image_2_5 ganha --quality high --resolution 2k se não vierem. Arquivos locais em --image /
--start-image / --end-image sobem antes com `higgsfield upload create` (o envio automático dá erro de S3).
Tudo que é pedido entra em <trabalho>/assets.json NA CRIAÇÃO do job (é o recibo do gasto). Matar o processo NÃO
cancela o job: o crédito já foi cobrado. Retome com `higgsfield generate wait <job>`.
"""
import json
import os
import re
import shutil
import subprocess
import sys
import time
import urllib.request
from pathlib import Path

ESTILO = (
    "STYLE (mandatory, overrides any other style in this prompt): photorealistic, shot like a real photograph by a "
    "great photojournalist or cinematographer, NOT a stock photo, NOT a clean corporate studio shot, NOT an AI-looking "
    "render. A CONCRETE, SPECIFIC scene that makes the idea obvious at a glance on a phone screen, captured at its most "
    "SHOCKING or striking moment: strong visual contrast, tension or surprise, a plausible exaggeration that makes people "
    "stop scrolling. Real people with real, specific human emotion (not posed smiles), real skin with pores and "
    "imperfections, real textures, lived-in places with real clutter, practical motivated light, natural film grain, "
    "slight imperfections of a real camera. "
)
REGRAS = (
    " RULES: absolutely no text, no letters, no words, no numbers, no captions, no logos; screens and papers show only "
    "abstract shapes. No cartoon, no 3D render, no anime, no plastic skin, no perfect symmetry, no glowing holograms, no "
    "floating icons, no generic futuristic blue tech background. Keep the main subject large, nothing important "
    "touching the edges, no cut-off faces, no malformed hands, one coherent scene, no watermark."
)
ESTILO_VIDEO = (
    " Photorealistic live-action footage, shot on a cinema camera with a real lens, natural motivated light, real "
    "physics and believable human motion, subtle handheld camera, natural film grain. No morphing, no warping faces, "
    "no extra fingers, no CGI or video-game look, no glowing particles, no text on screen."
)
# clichês que denunciam banco de imagem ou IA genérica (prompt em inglês; também pega português)
# CONTRATO: GENERICOS e trava_generico(prompt, modelo) são importados POR NOME pelo motor do catálogo de formatos
# (laboratorio/experimentos/2026-09-25-catalogo-formatos/motor). Não renomeie nem mude a assinatura sem avisar
# a sessão desse motor; pode acrescentar itens à lista à vontade.
GENERICOS = [
    r"business ?(people|man|woman|team)", r"handshake", r"shak(e|ing) hands", r"\bhologram", r"glowing brain", r"\brobot", r"futuristic",
    r"abstract (background|concept)", r"concept of", r"digital (background|world|concept)", r"technology background",
    r"cyber ?space", r"neural network", r"smiling (people|team|person)", r"stock", r"light bulb", r"rocket launch(ing)? "
    r"from a laptop", r"puzzle pieces", r"\blightbulb", r"\bsuccess\b", r"\bgrowth\b", r"\binnovation\b",
    r"pessoas de neg[oó]cio", r"aperto de m[aã]o", r"holograma", r"c[eé]rebro brilhante", r"rob[oô]", r"futurista",
    r"fundo tecnol[oó]gico", r"conceito de", r"sucesso", r"inova[cç][aã]o",
]
def _cmd(nome):
    """programa pelo nome em qualquer sistema (no Windows o higgsfield e o codex do npm são .cmd): plataforma.py"""
    sys.path.insert(0, str(Path(__file__).resolve().parent))
    import plataforma
    return plataforma.comando(nome)


MIDIA = {"--image", "--image-references", "--start-image", "--end-image", "--video", "--video-references"}
EH_VIDEO = ("veo", "seedance", "kling", "minimax", "grok_video", "wan", "flux_3_video")


def subir_refs(extra):
    """troca caminho local por id de upload (o envio automático de dentro do generate falha no S3)"""
    out, i = [], 0
    while i < len(extra):
        a = extra[i]
        if a in MIDIA and i + 1 < len(extra) and os.path.isfile(extra[i + 1]):
            r = subprocess.run([*_cmd("higgsfield"), "upload", "create", extra[i + 1], "--json"], capture_output=True, text=True, encoding="utf-8", errors="replace")
            if r.returncode:
                sys.exit(f"upload falhou: {r.stderr[-800:]}")
            out += [a, json.loads(r.stdout[r.stdout.index("{"):])["id"]]
            i += 2
            continue
        out.append(a)
        i += 1
    return out


def ler_json(txt):
    """o CLI devolve, conforme a versão e o comando: objeto, lista de objetos, lista de ids ou só o id"""
    txt = txt.strip()
    ini = min([i for i in (txt.find("["), txt.find("{"), txt.find('"')) if i >= 0], default=-1)
    try:
        res = json.loads(txt[ini:]) if ini >= 0 else txt
    except json.JSONDecodeError:
        res = txt.split()[-1] if txt else ""
    if isinstance(res, list):
        res = res[0] if res else {}
    if isinstance(res, str):
        return {"id": res.strip()}
    return res


def achar_url(j):
    res = j.get("results") or [{}]
    return j.get("result_url") or (res[0].get("url") if isinstance(res[0], dict) else None) or j.get("url")


def trava_generico(prompt_cena, modelo):
    """barra o prompt fraco ANTES de gastar crédito. Devolve a lista de problemas (vazia = passou).
    CONTRATO: importada por nome pelo motor do catálogo de formatos; mantenha nome e assinatura."""
    if modelo == "sonilo_music":
        return []
    p = prompt_cena.lower()
    achados = [g for g in GENERICOS if re.search(g, p)]
    problemas = [f"clichê de banco de imagem/IA: '{re.search(g, p).group(0)}'" for g in achados]
    palavras = len(re.findall(r"\w+", prompt_cena))
    if palavras < 22:
        problemas.append(f"prompt curto demais ({palavras} palavras): descreva quem, fazendo o quê, onde, em que instante, luz e lente")
    sinais = sum(bool(re.search(x, p)) for x in [r"\b\d{2,3} ?mm\b|close[- ]up|wide shot|low angle|high angle|over[- ]the[- ]shoulder|macro|handheld|dolly|tracking",
                                                 r"light|lit\b|lamp|neon|sunset|dawn|window|candle|flash|shadow|backlit|golden hour|overcast",
                                                 r"\b(face|eyes|hands|sweat|tears|scream|gasp|stares?|grabs?|slams?|runs?|falls?|breaks?|burns?)\b"])
    if sinais < 2:
        problemas.append("faltam detalhes de direção: diga ao menos 2 de enquadramento/lente, luz e ação/emoção concreta")
    return problemas


def criar(modelo, prompt, extra):
    r = subprocess.run([*_cmd("higgsfield"), "generate", "create", modelo, "--prompt", prompt, *extra, "--json"], capture_output=True, text=True, encoding="utf-8", errors="replace")
    if r.returncode:
        sys.exit(f"falhou: {r.stderr[-1500:]}")
    job = ler_json(r.stdout)
    if not job.get("id"):
        sys.exit(f"não achei o id do job na resposta do Higgsfield (o crédito pode ter sido cobrado): {r.stdout[-800:]}")
    return job["id"]


def esperar_e_baixar(job_id, destino_sem_ext):
    r = subprocess.run([*_cmd("higgsfield"), "generate", "wait", job_id, "--timeout", "20m", "--json"], capture_output=True, text=True, encoding="utf-8", errors="replace")
    if r.returncode:
        return None, f"espera falhou ({r.stderr[-300:]}); retome com: higgsfield generate wait {job_id} --json"
    job = ler_json(r.stdout)
    url = achar_url(job)
    if not url:  # a espera às vezes devolve só o status: busca o job completo pelo id
        g = subprocess.run([*_cmd("higgsfield"), "generate", "get", job_id, "--json"], capture_output=True, text=True, encoding="utf-8", errors="replace")
        if g.returncode == 0:
            url = achar_url(ler_json(g.stdout))
    if not url:
        return None, f"cobrado mas sem link; veja com: higgsfield generate get {job_id} --json"
    ext = Path(url.split("?")[0]).suffix or ".bin"
    destino = Path(f"{destino_sem_ext}{ext}")
    destino.parent.mkdir(parents=True, exist_ok=True)
    urllib.request.urlretrieve(url, destino)
    return (destino, url), None


def folha(arquivos, saida):
    """lado a lado para olhar e comparar (vídeo: quadro do meio)"""
    ins = []
    for a in arquivos:
        if a.suffix.lower() in (".mp4", ".mov", ".webm"):
            q = a.with_suffix(".quadro.jpg")
            subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", "2", "-i", a, "-frames:v", "1", q])
            a = q
        ins += ["-i", str(a)]
    if len(arquivos) == 1:
        shutil.copy(ins[1], saida)
        return
    n = len(arquivos)
    filtro = "".join(f"[{i}]scale=-2:900[v{i}];" for i in range(n)) + "".join(f"[v{i}]" for i in range(n)) + f"hstack=inputs={n}"
    subprocess.run(["ffmpeg", "-v", "error", "-y", *ins, "-filter_complex", filtro, "-frames:v", "1", str(saida)])


def _opt(extra, nome, padrao=None):
    return extra[extra.index(nome) + 1] if nome in extra and extra.index(nome) + 1 < len(extra) else padrao


def gemini_imagem(prompt, aspect, refs, destino_sem_ext):
    """Nano Banana Pro pela API do Gemini (chave do aluno). Devolve o arquivo salvo."""
    import base64
    from fontes import chave
    k = chave("gemini")
    partes = [{"text": prompt}]
    for r in refs:
        partes.append({"inlineData": {"mimeType": "image/png" if r.lower().endswith(".png") else "image/jpeg",
                                      "data": base64.b64encode(Path(r).read_bytes()).decode()}})
    corpo = {"contents": [{"parts": partes}], "generationConfig": {"responseModalities": ["IMAGE"], "imageConfig": {"aspectRatio": aspect}}}
    for modelo in ("gemini-3-pro-image", "gemini-3.1-flash-image", "gemini-2.5-flash-image"):
        req = urllib.request.Request(f"https://generativelanguage.googleapis.com/v1beta/models/{modelo}:generateContent",
                                     data=json.dumps(corpo).encode(), headers={"x-goog-api-key": k, "Content-Type": "application/json"})
        try:
            d = json.load(urllib.request.urlopen(req, timeout=180))
        except Exception as e:
            ultimo = str(e)
            continue
        for p in d.get("candidates", [{}])[0].get("content", {}).get("parts", []):
            if "inlineData" in p:
                ext = ".png" if "png" in p["inlineData"].get("mimeType", "") else ".jpg"
                destino = Path(f"{destino_sem_ext}{ext}")
                destino.parent.mkdir(parents=True, exist_ok=True)
                destino.write_bytes(base64.b64decode(p["inlineData"]["data"]))
                return destino, modelo
        ultimo = json.dumps(d)[:300]
    raise RuntimeError(f"Gemini não devolveu imagem: {ultimo}")


def gemini_video(prompt, aspect, inicio, dur, destino_sem_ext):
    """Veo 3.1 pela API do Gemini, de preferência animando uma imagem aprovada (--start-image)."""
    import base64
    from fontes import chave
    k = chave("gemini")
    inst = {"prompt": prompt}
    if inicio:
        inst["image"] = {"bytesBase64Encoded": base64.b64encode(Path(inicio).read_bytes()).decode(),
                         "mimeType": "image/png" if inicio.lower().endswith(".png") else "image/jpeg"}
    dur = min([4, 6, 8], key=lambda x: abs(x - float(dur or 6)))
    corpo = {"instances": [inst], "parameters": {"aspectRatio": aspect if aspect in ("9:16", "16:9") else "9:16", "durationSeconds": dur}}
    modelo = "veo-3.1-fast-generate-preview"
    req = urllib.request.Request(f"https://generativelanguage.googleapis.com/v1beta/models/{modelo}:predictLongRunning",
                                 data=json.dumps(corpo).encode(), headers={"x-goog-api-key": k, "Content-Type": "application/json"})
    op = json.load(urllib.request.urlopen(req, timeout=60))
    nome_op = op["name"]
    for _ in range(120):  # até ~10 min
        time.sleep(5)
        st = json.load(urllib.request.urlopen(urllib.request.Request(f"https://generativelanguage.googleapis.com/v1beta/{nome_op}",
                                                                   headers={"x-goog-api-key": k}), timeout=60))
        if st.get("done"):
            if "error" in st:
                raise RuntimeError(f"Veo recusou: {st['error']}")
            amostras = st["response"]["generateVideoResponse"]["generatedSamples"]
            uri = amostras[0]["video"]["uri"]
            destino = Path(f"{destino_sem_ext}.mp4")
            destino.parent.mkdir(parents=True, exist_ok=True)
            with urllib.request.urlopen(urllib.request.Request(uri, headers={"x-goog-api-key": k}), timeout=300) as r:
                destino.write_bytes(r.read())
            return destino, modelo
    raise RuntimeError(f"Veo demorou demais; operação {nome_op}")


def codex_imagem(prompt, aspect, destino_sem_ext):
    """imagem pela conta do ChatGPT do aluno, via Codex (sem custo extra; ~1 min por imagem)"""
    destino = Path(f"{destino_sem_ext}.png")
    destino.parent.mkdir(parents=True, exist_ok=True)
    pedido = (f"Use your built-in image generation tool to create ONE image, aspect ratio {aspect}, following this description "
              f"exactly: {prompt}\nSave the generated image in the current directory as {destino.name}. Reply only with the file path.")
    subprocess.run([*_cmd("codex"), "exec", "--skip-git-repo-check", "--sandbox", "workspace-write", pedido],
                   cwd=destino.parent, capture_output=True, text=True, encoding="utf-8", errors="replace", timeout=900)
    if not destino.exists():
        raise RuntimeError("o Codex não salvou a imagem (confira `codex login status` e a cota do ChatGPT)")
    return destino, "codex image_gen"


def gerar(argv):
    sys.path.insert(0, str(Path(__file__).parent))
    trab, nome, modelo, prompt_cena = Path(argv[0]), argv[1], argv[2], argv[3]
    flags = {"--custo", "--sem-estilo", "--forcar"}
    extra, i, variacoes, fonte = [], 4, None, "auto"
    while i < len(argv):
        if argv[i] == "--variacoes":
            variacoes = int(argv[i + 1]); i += 2; continue
        if argv[i] == "--fonte":
            fonte = argv[i + 1]; i += 2; continue
        if argv[i] not in flags:
            extra.append(argv[i])
        i += 1
    tipo = "trilha" if modelo == "sonilo_music" else "video" if (modelo == "video" or modelo.startswith(EH_VIDEO)) else "imagem"
    # escada de fontes: higgsfield → codex → gemini → animacao (imagem); higgsfield → gemini → animacao (vídeo)
    if fonte == "auto":
        if modelo not in ("imagem", "video"):
            fonte = "higgsfield"  # modelo do Higgsfield pedido pelo nome
        else:
            from fontes import escada
            ordem = escada()[tipo]
            fonte = ordem[0]
            if len(ordem) > 1 or fonte != "higgsfield":
                print(f"fonte escolhida pela escada ({' → '.join(ordem)}): {fonte}")
    if fonte in ("animacao", "banco", "sem-take"):
        sys.exit(f"nenhum gerador de {tipo} conectado: MODO SÓ ANIMAÇÃO. Desenhe este momento em código no Remotion "
                 "(cena sob medida em app/src/custom/, tipografia, ilustração em SVG/CSS, ícone, grafismo; ver "
                 "references/fontes-de-imagem.md). Foto ou vídeo real de banco grátis (scripts/banco.py) só se a pessoa pedir.")
    if fonte == "higgsfield" and modelo in ("imagem", "video"):
        modelo = "gpt_image_2_5" if tipo == "imagem" else _opt(extra, "--modelo-video", "kling3_0_turbo")
        if "--modelo-video" in extra:
            k = extra.index("--modelo-video"); del extra[k:k + 2]
    video = tipo == "video"
    if variacoes is None:
        variacoes = 1 if tipo in ("video", "trilha") else 2
    problemas = trava_generico(prompt_cena, modelo)
    if problemas and "--forcar" not in argv:
        sys.exit("TRAVA ANTI-GENÉRICO — reescreva antes de gastar crédito:\n  - " + "\n  - ".join(problemas) +
                 "\nVeja a receita de prompt em references/fontes-de-imagem.md. (--forcar passa por cima; justifique no relatório)")
    prompt = prompt_cena
    if "--sem-estilo" not in argv:
        if tipo == "imagem":
            prompt = ESTILO + prompt_cena + REGRAS
        elif video:
            prompt = prompt_cena + ESTILO_VIDEO
    reg = trab / "assets.json"
    lista = json.loads(reg.read_text(encoding="utf-8")) if reg.exists() else []
    cand_dir = trab / "app/public/assets/_candidatos"
    baixados = []

    if fonte == "higgsfield":
        if modelo.startswith("gpt_image"):
            if "--quality" not in extra:
                extra += ["--quality", "high"]
            if "--resolution" not in extra:
                extra += ["--resolution", "2k"]
        extra = subir_refs(extra)
        custo_r = subprocess.run([*_cmd("higgsfield"), "generate", "cost", modelo, "--prompt", prompt, *extra], capture_output=True, text=True, encoding="utf-8", errors="replace")
        custo = custo_r.stdout.strip().splitlines()[-1] if custo_r.returncode == 0 else f"? ({custo_r.stderr.strip()[-200:]})"
        if "--custo" in argv:
            print(f"{modelo}: {custo} cada x {variacoes} variação(ões)")
            return
        # cria todos os jobs SEM esperar e registra na hora: o crédito é cobrado mesmo se este processo morrer
        entradas = []
        for v in range(1, variacoes + 1):
            job_id = criar(modelo, prompt, extra)
            e = {"nome": f"{nome}_v{v}", "base": nome, "fonte": "higgsfield", "modelo": modelo, "prompt_cena": prompt_cena, "prompt": prompt,
                 "params": extra, "custo": custo, "job": job_id, "status": "criado (cobrado)", "aprovado": None}
            lista.append(e)
            entradas.append(e)
        salvar_registro(reg, entradas)
        for e in entradas:
            res, erro = esperar_e_baixar(e["job"], cand_dir / e["nome"])
            if erro:
                e["status"] = erro
                print(f"{e['nome']}: {erro}")
                continue
            destino, url = res
            e.update({"arquivo": str(destino.relative_to(trab / "app/public")), "url": url, "status": "candidato"})
            baixados.append(destino)
            salvar_registro(reg, entradas)
    else:
        if "--custo" in argv:
            print({"codex": "sem custo extra (cota do ChatGPT)", "gemini": "cobrado na conta Google do aluno (centavos por imagem; vídeo por segundo)"}.get(fonte, "?"))
            return
        aspect = _opt(extra, "--aspect_ratio", "9:16")
        refs = [extra[k + 1] for k, a in enumerate(extra) if a in ("--image", "--image-references") and k + 1 < len(extra)]
        inicio = _opt(extra, "--start-image")
        meus = []
        for v in range(1, variacoes + 1):
            e = {"nome": f"{nome}_v{v}", "base": nome, "fonte": fonte, "prompt_cena": prompt_cena, "prompt": prompt, "status": "pedido", "aprovado": None}
            lista.append(e)
            meus.append(e)
            salvar_registro(reg, meus)
            try:
                if fonte == "gemini" and video:
                    destino, mod = gemini_video(prompt, aspect, inicio, _opt(extra, "--duration", 6), cand_dir / e["nome"])
                elif fonte == "gemini":
                    destino, mod = gemini_imagem(prompt, aspect, refs, cand_dir / e["nome"])
                elif fonte == "codex" and not video:
                    destino, mod = codex_imagem(prompt, aspect, cand_dir / e["nome"])
                else:
                    sys.exit(f"a fonte {fonte} não faz {tipo}")
            except Exception as erro:
                e["status"] = f"falhou: {str(erro)[:300]}"
                salvar_registro(reg, meus)
                print(f"{e['nome']}: {e['status']}")
                continue
            e.update({"modelo": mod, "arquivo": str(destino.relative_to(trab / "app/public")), "status": "candidato"})
            baixados.append(destino)
            salvar_registro(reg, meus)
    if not baixados:
        sys.exit("nenhuma variação saiu")
    lado = cand_dir / f"{nome}_lado-a-lado.jpg"
    if tipo != "trilha":
        folha(baixados, lado)
    for b in baixados:
        print(f"candidato: {b.relative_to(trab / 'app/public')}")
    if tipo == "trilha":
        print(f"trilha: ouça e aprove com: python3 {__file__} aprovar {trab} {baixados[0].relative_to(trab / 'app/public')} --nota N --porque \"...\"")
    else:
        print(f"OLHE {lado} e dê nota com a régua (impacto, realismo, especificidade, cara de IA/banco). Só use com nota >= 8:\n"
              f"  python3 {__file__} aprovar {trab} <candidato> --nota N --porque \"...\"   (ou reprovar, e reescreva o prompt)")



# assets.json é o recibo do gasto e vários gerar.py rodam em paralelo (um por imagem): cada processo grava só as
# entradas dele, relendo o arquivo sob trava, para um não apagar o registro do outro (aconteceu em 18/10).
def _trava(reg: Path):
    import contextlib, uuid as _u
    @contextlib.contextmanager
    def cm():
        lk = reg.with_suffix(".lock")
        t0 = time.time()
        while True:
            try:
                fd = os.open(str(lk), os.O_CREAT | os.O_EXCL | os.O_WRONLY)
                os.close(fd)
                break
            except FileExistsError:
                try:
                    velha = time.time() - lk.stat().st_mtime > 60
                except FileNotFoundError:
                    continue
                if time.time() - t0 > 30 or velha:
                    try:
                        lk.unlink()
                    except FileNotFoundError:
                        pass
                    t0 = time.time()
                time.sleep(0.05)
        try:
            yield
        finally:
            try:
                lk.unlink()
            except FileNotFoundError:
                pass
    return cm()


def salvar_registro(reg: Path, minhas: list):
    """Junta as entradas deste processo ao assets.json do disco (pela chave "id"; entrada antiga sem id, pelo arquivo)."""
    import uuid as _u
    for e in minhas:
        e.setdefault("id", _u.uuid4().hex[:12])
    with _trava(reg):
        disco = json.loads(reg.read_text(encoding="utf-8")) if reg.exists() else []
        pos = {e.get("id") or ("arq:" + str(e.get("arquivo"))): i for i, e in enumerate(disco)}
        for e in minhas:
            k = e["id"] if e["id"] in pos else ("arq:" + str(e.get("arquivo")))
            if k in pos and (e["id"] in pos or not disco[pos[k]].get("id")):
                disco[pos[k]] = e
            else:
                disco.append(e)
                pos[e["id"]] = len(disco) - 1
        tmp = reg.with_suffix(".tmp")
        tmp.write_text(json.dumps(disco, ensure_ascii=False, indent=1), encoding="utf-8")
        os.replace(tmp, reg)

def julgar(argv, aprovar):
    trab, cand = Path(argv[0]), argv[1]
    porque = argv[argv.index("--porque") + 1] if "--porque" in argv else ""
    nota = float(argv[argv.index("--nota") + 1]) if "--nota" in argv else None
    reg = trab / "assets.json"
    lista = json.loads(reg.read_text(encoding="utf-8"))
    alvo = next((e for e in lista if e.get("arquivo") == cand or Path(e.get("arquivo") or "").name == Path(cand).name), None)
    if not alvo:
        sys.exit(f"candidato não encontrado em assets.json: {cand}")
    if aprovar:
        if nota is None or nota < 8:
            sys.exit("aprovação exige --nota >= 8 na régua; abaixo disso, reprove e reescreva o prompt (cena mais específica, momento mais forte)")
        origem = trab / "app/public" / alvo["arquivo"]
        final = trab / "app/public/assets" / f"{alvo['base']}{origem.suffix}"
        shutil.copy(origem, final)
        alvo.update({"aprovado": True, "nota": nota, "porque": porque, "final": str(final.relative_to(trab / "app/public"))})
        print(f"aprovado → {alvo['final']} (nota {nota})")
    else:
        alvo.update({"aprovado": False, "nota": nota, "porque": porque})
        print(f"reprovado: {cand} ({porque})")
    salvar_registro(reg, [alvo])


def main():
    _cmd("python")  # carrega plataforma.py: saída em UTF-8 no console do Windows
    if len(sys.argv) < 4:
        sys.exit(__doc__)
    if sys.argv[1] in ("aprovar", "reprovar"):
        julgar(sys.argv[2:], sys.argv[1] == "aprovar")
    elif len(sys.argv) < 5:
        sys.exit(__doc__)
    else:
        gerar(sys.argv[1:])


if __name__ == "__main__":
    main()
