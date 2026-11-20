-- Sessões vindas da Google Agenda (18/11/2026): cada evento da agenda vira uma sessão marcada quando
-- algum convidado tem o mesmo e-mail de um lead do CRM (o e-mail do pré-diagnóstico).
-- google_evento_id = UID do evento na agenda; só a linha "viva" (marcada/realizada/faltou) guarda o UID.
alter table public.crm_sessoes add column if not exists google_evento_id text;
create unique index if not exists crm_sessoes_google_evento_uidx on public.crm_sessoes (google_evento_id) where google_evento_id is not null;
