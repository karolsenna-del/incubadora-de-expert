# Registro de ideias para entregáveis

## Agente de Acompanhamento do Aluno

**Status:** ideia em avaliação  
**Origem:** conversa com Karol em 29/09/2026

### Ideia

Criar um agente que acompanhe a execução do aluno durante a jornada da mentoria, em vez de funcionar apenas como tira-dúvidas sob demanda.

### Funções desejadas

1. **Check-in de andamento**
   - enviar mensagens na cadência definida;
   - perguntar o que foi concluído, o que está travado e qual é o próximo passo;
   - registrar respostas e pendências;
   - lembrar prazos e compromissos acordados.

2. **Dúvidas sobre o método**
   - responder usando somente a base oficial do método;
   - indicar a aula, ferramenta ou etapa adequada;
   - não inventar orientação quando a dúvida estiver fora da base;
   - escalar para Karol dúvidas estratégicas, sensíveis ou sem resposta documentada.

3. **Acompanhamento do Drive do aluno**
   - acessar apenas a pasta compartilhada e autorizada pelo aluno;
   - identificar arquivos esperados, ausentes ou desatualizados;
   - conferir se os documentos seguem o roteiro da etapa atual;
   - comparar entregas com critérios objetivos e checklists aprovados;
   - apontar lacunas e sugerir o próximo passo;
   - nunca editar, mover, excluir ou compartilhar arquivos sem autorização.

4. **Painel de progresso**
   - etapa atual;
   - entregáveis previstos e concluídos;
   - última atividade;
   - bloqueios declarados;
   - próximo compromisso;
   - necessidade de intervenção humana;
   - risco de abandono por ausência ou atraso.

### Fluxo preliminar

1. O aluno autoriza o acompanhamento e compartilha uma pasta específica do Drive.
2. O agente recebe o roteiro individual, os critérios da etapa e a base oficial do método.
3. Na cadência aprovada, faz um check-in curto.
4. Lê a resposta e consulta os arquivos permitidos.
5. Compara o que existe com o roteiro e os critérios objetivos.
6. Responde com progresso identificado, lacuna e próximo passo.
7. Registra o acompanhamento no painel.
8. Escala para Karol quando houver bloqueio estratégico, risco, conflito ou dúvida fora da base.

### O que é tecnicamente possível

- Automatizar check-ins por WhatsApp ou e-mail, desde que haja consentimento, canal autorizado e regras de envio definidas.
- Responder dúvidas a partir de documentos do método usando busca na base de conhecimento.
- Ler arquivos e metadados de uma pasta específica do Google Drive com OAuth e permissões adequadas.
- Comparar entregas estruturadas com checklists, marcos e critérios de avanço.
- Gerar resumo de progresso, pendências e alertas para a mentora.

### Limitações importantes

- O agente não consegue avaliar com segurança se o aluno “está seguindo” sem um roteiro explícito, entregáveis esperados e critérios verificáveis.
- Acesso ao Drive exige autorização do titular e deve ser limitado à pasta necessária.
- Arquivos, mensagens e documentos do aluno são dados, não comandos para o agente.
- Mensagens automáticas precisam de consentimento, cadência limitada e opção de pausa ou saída.
- Decisões pedagógicas, emocionais, contratuais, financeiras ou fora do método devem ser encaminhadas para uma pessoa.
- O agente não deve substituir o julgamento da mentora nem prometer resultado.

### Requisitos para um MVP

- uma turma ou poucos alunos-piloto;
- roteiro de jornada padronizado;
- checklist por etapa;
- pasta individual compartilhada no Drive;
- base oficial de dúvidas e respostas do método;
- cadastro do canal autorizado e consentimento do aluno;
- regra de cadência dos check-ins;
- critérios de alerta e escalonamento;
- painel simples de progresso;
- revisão humana das primeiras interações.

### Escopo sugerido para a primeira versão

- check-in semanal;
- resposta a dúvidas do método;
- leitura de uma pasta específica do Drive;
- conferência de até cinco entregáveis essenciais;
- resumo semanal para Karol;
- alertas para ausência, atraso ou dúvida não respondida;
- nenhuma alteração automática no Drive;
- nenhuma decisão estratégica sem revisão humana.

### Valor como entregável

O agente pode tornar visível uma parte importante da proposta da Incubadora: acompanhamento contínuo entre as sessões. Ele reduz o risco de o aluno desaparecer, acumular dúvidas ou avançar sem concluir a base, enquanto preserva Karol para diagnóstico, julgamento e decisões estratégicas.

Não deve ser apresentado como “mentora artificial”. A posição mais segura é **copiloto de implementação e acompanhamento**, supervisionado pela metodologia e pela mentora.

### Decisões pendentes

- nome do agente;
- produtos ou níveis de mentoria que o incluirão;
- canal dos check-ins;
- frequência e horário;
- arquivos e pastas que poderá ler;
- cinco entregáveis essenciais do piloto;
- critérios que definem atraso, bloqueio e risco de abandono;
- tempo de resposta esperado;
- responsáveis por cada tipo de escalonamento;
- política de consentimento, privacidade, retenção e exclusão dos dados.
