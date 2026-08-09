-- Estrutura da tabela de leads. Rodar no SQL Editor do Supabase.

create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  origin text not null,
  welcome_sent_at timestamptz,
  created_at timestamptz default now()
);

create index if not exists leads_created_at_idx on leads (created_at desc);

-- A autenticação do painel é fixa e não usa Supabase Auth: todo acesso passa
-- pelo servidor com a service role key. Sem policy pública, o anon key não lê
-- nada mesmo se vazar.
alter table leads enable row level security;
