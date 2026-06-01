# Templates Meta API Individuais — Workshop NDF

> **STATUS: PLACEHOLDER**
>
> Os bodies completos dos 7 templates abaixo vivem na conta do Euriler na Meta Cloud API (não no Git).
> Quando o Euriler exportar os bodies, este arquivo será atualizado com o texto real de cada um.
>
> Por enquanto: lista dos templates + parâmetros + quando disparam + estrutura genérica de template Meta.
>
> Carregado por: copywriter-mensagens

## Templates Mapeados

### 1. `boas_vindas_workshop_ndf`
- **Quando dispara:** Pós-compra confirmada (Hotmart webhook)
- **Parâmetros:** first_name, workshop_nome, data_evento, link_grupo
- **Body:** {{TODO — Euriler exporta da Meta}}
- **Header:** vídeo (NDF onboarding 30s) — referência: ver `template-whatsapp-meta-ndf.md`
- **Buttons:** Quick reply "Entrar no grupo" → URL grupo

### 2. `checkin_workshop_ndf`
- **Quando dispara:** T-5 dias antes do evento, 10h, individual API
- **Parâmetros:** first_name, data_evento_texto, link_grupo, data_vespera
- **Body:** {{TODO}}

### 3. `lembrete_pessoal_ndf`
- **Quando dispara:** T-3 dias, 18h, individual API
- **Parâmetros:** first_name, data_evento_texto, prazo_formato_aulas
- **Body:** {{TODO}}

### 4. `upsell_formato_aulas_ndf`
- **Quando dispara:** T-1 dia, 10h, individual API (filter: NÃO comprou formato aulas)
- **Parâmetros:** first_name
- **Body:** {{TODO}}
- **Filtro crítico:** filter_formato_aulas = TRUE (não comprou)

### 5. `link_acesso_ndf`
- **Quando dispara:** Dia evento, T-1h, individual API (Dia 1 e Dia 2)
- **Parâmetros:** first_name, meet_link
- **Body:** {{TODO}}

### 6. `cade_voce_ndf`
- **Quando dispara:** Dia evento, T+15min após início, individual API (recovery atrasados)
- **Parâmetros:** first_name, meet_link
- **Body:** {{TODO}}

### 7. `conseguiu_entrar_ndf`
- **Quando dispara:** Dia evento, T+45min, individual API (recovery 2)
- **Parâmetros:** first_name, meet_link
- **Body:** {{TODO}}

### 8. `voltamos_almoco_ndf`
- **Quando dispara:** Dia evento, ~14h, individual API (volta sessão pós-almoço)
- **Parâmetros:** first_name, meet_link
- **Body:** {{TODO}}

## Estrutura Genérica Template Meta

Quando o Euriler for exportar e o copywriter-mensagens for escrever templates novos pra outros lançamentos, seguir estrutura Meta padrão:

```
HEADER (opcional)
- Tipo: TEXT | IMAGE | VIDEO | DOCUMENT
- Conteúdo: {{1}} variável dinâmica ou conteúdo fixo

BODY
- Texto principal (até 1024 caracteres)
- Variáveis {{1}}, {{2}}, ... {{N}}
- Quebras de linha permitidas
- Negrito (*texto*), itálico (_texto_), monospace (`texto`)

FOOTER (opcional)
- Texto curto até 60 caracteres

BUTTONS (opcional, máx 10)
- Quick Reply: até 3 botões com text label
- Call to Action: URL ou Phone Number
```

## Como o copywriter-mensagens usa este arquivo

V1: usa lista de templates + quando disparam pra entender escopo da operação NDF.
V2+: substituir bodies TBD pelos exportados do Euriler. Ou gerar bodies novos pra lançamentos do aluno seguindo estrutura.

## Próximas ações

- [ ] Euriler exporta os 8 templates da Meta Cloud API (copy-paste pra este arquivo)
- [ ] Validar que parâmetros estão corretos
- [ ] Adicionar exemplos de templates pra outros lançamentos (V2+)

---

*Snapshot: 2026-05-08 — versão 1.0.0 — fonte: campanha NDF Workshop (lançamento real Euriler)*
