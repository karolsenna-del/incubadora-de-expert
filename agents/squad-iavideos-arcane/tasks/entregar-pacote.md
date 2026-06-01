---
task: "Entregar Pacote"
responsavel: "@operador-higgsfield"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Lote final de peças + variações (URLs do Higgsfield)"
Saida: "Vídeos baixados em pasta organizada em ~/Downloads/"
Checklist:
  - "Pasta criada em ~/Downloads/ com nome da campanha"
  - "Subpastas por formato/eixo de variação"
  - "Todos os vídeos baixados (.mp4)"
  - "Confirmação enviada ao Chief"
execution_type: "deterministic"
---

# Task: Entregar Pacote

## Executive Summary

Fecha o pipeline. O operador baixa todos os vídeos numa pasta organizada em `~/Downloads/`, pronta pro usuário subir nas campanhas.

## Steps

### Step 1: Criar a estrutura da pasta

```
~/Downloads/{slug-campanha-YYYY-MM-DD}/
  ugc-persona/
    peca-01.mp4
    peca-02.mp4
  founder-led/
    peca-01.mp4
  listicle/
    peca-01.mp4
```

Subpastas por formato. Nomes de arquivo curtos e consistentes.

### Step 2: Baixar os vídeos

Para cada peça aprovada/variação, baixar o `.mp4` da URL do Higgsfield (via `curl`) para a subpasta correta.

### Step 3: Gerar manifesto

Criar um `manifest.md` na raiz da pasta listando cada peça com formato, persona, copy resumida e nota de viralidade. Útil pro usuário decidir quais subir primeiro.

### Step 4: Confirmar com o Chief

Devolver o caminho da pasta ao iavideos-chief, que confirma a entrega com o usuário.

## Error Handling

| Cenário | Ação |
|---------|------|
| Falha no download | Reentar; se persistir, fornecer as URLs diretamente pro usuário baixar |
| Pasta ~/Downloads/ não existe ou sem permissão | Avisar o usuário; oferecer caminho alternativo |
| Espaço em disco insuficiente | Avisar o usuário antes de tentar baixar |
