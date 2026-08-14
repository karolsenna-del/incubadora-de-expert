-- workshop_config — fonte de verdade única para config dinâmica do workshop NDF
-- Centraliza data, horário, formato, prazo de inscrição. Todos os workflows leem daqui.
-- A cada novo ciclo, basta UPDATE/INSERT — sem mexer em código n8n.

CREATE TABLE IF NOT EXISTS public.workshop_config (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug              text UNIQUE NOT NULL,                   -- 'ndf-2026-05'
  status            text NOT NULL DEFAULT 'archived'
                    CHECK (status IN ('active','archived')),

  -- Campos estruturados (autoritativos)
  event_date_start  date NOT NULL,                          -- 2026-05-23
  event_date_end    date NOT NULL,                          -- 2026-05-24
  event_time_start  text NOT NULL,                          -- '10h'
  event_time_end    text NOT NULL,                          -- '19h'
  duracao           text NOT NULL,                          -- '2 dias'
  end_signup_at     timestamptz NOT NULL,                   -- 2026-05-22T23:00:00Z

  -- Strings pré-formatadas (derivadas pelo script CLI, não pelo runtime)
  data_full_text    text NOT NULL,                          -- 'Sábado e Domingo, 23 e 24 de maio de 2026, das 10h às 19h'
  data_short_text   text NOT NULL,                          -- '23 e 24/05'
  data_event_range  text NOT NULL,                          -- '23-24/05/2026'
  data_template_var text NOT NULL,                          -- 'sábado e domingo, 23 e 24 de maio, das 10h às 19h'
  end_signup_text   text NOT NULL,                          -- 'quinta 22/05/2026'

  notes             text,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now(),

  -- Validações adicionais
  CONSTRAINT date_range_valid     CHECK (event_date_end >= event_date_start),
  CONSTRAINT signup_before_event  CHECK (end_signup_at < (event_date_start + interval '1 day'))
);

-- Garante que existe NO MÁXIMO 1 ciclo ativo de cada vez
CREATE UNIQUE INDEX IF NOT EXISTS workshop_config_one_active
  ON public.workshop_config (status)
  WHERE status = 'active';

CREATE INDEX IF NOT EXISTS workshop_config_updated_at_idx
  ON public.workshop_config (updated_at DESC);

-- Trigger pra updated_at automático
CREATE OR REPLACE FUNCTION public.workshop_config_set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS workshop_config_updated_at ON public.workshop_config;
CREATE TRIGGER workshop_config_updated_at
  BEFORE UPDATE ON public.workshop_config
  FOR EACH ROW EXECUTE FUNCTION public.workshop_config_set_updated_at();

-- RLS: deixa fechado por padrão. Service role bypassa.
ALTER TABLE public.workshop_config ENABLE ROW LEVEL SECURITY;

-- Linha inicial pro ciclo atual (NDF 23-24/05/2026)
INSERT INTO public.workshop_config (
  slug, status,
  event_date_start, event_date_end,
  event_time_start, event_time_end, duracao,
  end_signup_at,
  data_full_text, data_short_text, data_event_range, data_template_var, end_signup_text,
  notes
) VALUES (
  'ndf-2026-05', 'active',
  '2026-05-23', '2026-05-24',
  '10h', '19h', '2 dias',
  '2026-05-22T23:00:00Z',
  'Sábado e Domingo, 23 e 24 de maio de 2026, das 10h às 19h',
  '23 e 24/05',
  '23-24/05/2026',
  'sábado e domingo, 23 e 24 de maio, das 10h às 19h',
  'sexta 22/05/2026',
  'Ciclo NDF 2026-05 — criado pelo refactor que centralizou config dinâmica do workshop'
)
ON CONFLICT (slug) DO NOTHING;

COMMENT ON TABLE public.workshop_config IS
  'Fonte de verdade única pra config dinâmica do workshop NDF. Lido por WF-AGENT-CORE-CLOUD, WF-RECOVERY-CRON, WF-COMPRAS.';
