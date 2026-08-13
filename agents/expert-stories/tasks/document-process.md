---
task: "Document Process"
responsavel: "@expert-stories"
atomic_layer: "task"
entrada: "Processo novo executado, ou ajuste que a Karol confirmou como regra permanente"
saida: "SOP novo/atualizado no Playbook, ou regra nova em Rules"
execution_type: "semantic"
---

# Task: Document Process

## Objetivo

Transformar ajuste pontual em conhecimento permanente — evita resolver o mesmo problema do
zero na próxima vez.

## Ciclo

1. **Registrar os passos** do que foi feito
2. **Distinguir**: é regra de comportamento (nunca/sempre) → `data/expert-stories-rules.md`;
   ou é procedimento repetível → `data/expert-stories-playbook.md`
3. **Criar/atualizar** o SOP ou a regra, seguindo o formato já usado nesses arquivos
4. **Se o ajuste mexe na rotina fixa em si** (dias, formatos, ciclo de ofertas): atualizar
   também `docs/producao-conteudo/karol/rotina-stories-formatos.md` (fonte oficial) —
   Consult, nível 3, só depois da Karol confirmar
