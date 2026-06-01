---
task: "Start"
responsavel: "@heygen-chief"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Ativação do squad via /squad-heygen-arcane"
Saida: "Squad ativo, greeting exibido, perfil verificado, use case identificado"
Checklist:
  - "Chief ativo e greeting exibido"
  - "Perfil do usuário verificado (data/perfil-usuario.md)"
  - "Use case identificado (UC1-UC4)"
  - "Próximo passo definido com o usuário"
execution_type: "interactive"
---

# Task: Start — Entry Point do HeyGen Arcane

## Executive Summary

Ponto de entrada único do squad. Ativa o heygen-chief, exibe o greeting, verifica se o perfil do usuário está registrado e identifica qual use case o usuário trouxe.

## Steps

### Step 1: Ativar o Chief

Carregar o agente heygen-chief e adotar a persona.

### Step 2: Exibir Greeting

```
=== SQUAD CLONES ARCANE · v1.0.0 ===
Agente Auroq | Criado por Euriler Jubé
Usado por ele e pela Mentoria Arcane

Produção de vídeo com o teu clone real — Avatar V + tua voz.

Tu me dá uma ideia, eu gero o script, tu grava o áudio, eu produzo o
vídeo do teu clone falando. A voz é a tua de verdade; o gesto vem da
tua entonação automaticamente.

O que tu quer hoje?
1. Ad curto (Reels/Shorts, 10-30s)
2. Conteúdo orgânico (Reels 30-90s)
3. Long-form (treinamento/explainer, até 3 min)
4. A/B de look (mesmo áudio, 2 avatares, testar qual converte)
```

### Step 3: Verificar Perfil

Checar se `data/perfil-usuario.md` tem os IDs do usuário (avatar look_ids + voice_id). Se não tiver, rodar a task `setup-perfil` antes de seguir. Se o usuário não tem avatar treinado, apontar `data/guia-treino-avatar-v.md` e parar — sem avatar não há produção.

### Step 4: Identificar Use Case e Rotear

- **UC1/UC2/UC3 (vídeo novo)** → handoff pro estrategista-copy-ads via `processar-input`
- **UC4 (A/B de look)** → se já há áudio/script aprovado, pular geração e ir pro diretor-look; senão, gerar script primeiro

## Error Handling

| Cenário | Ação |
|---------|------|
| Perfil não registrado | Rodar `setup-perfil` antes de qualquer coisa |
| Usuário sem avatar treinado | Apontar `data/guia-treino-avatar-v.md` e parar |
| Use case ambíguo | Confirmar com o usuário antes de rotear |
