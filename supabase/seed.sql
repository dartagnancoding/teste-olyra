-- Leads fictícios para visualização inicial. Idempotente: rodar de novo não duplica.

insert into leads (name, email, origin)
select * from (values
  ('Mariana Costa',  'mariana.costa@exemplo.com',  'Instagram'),
  ('Rafael Andrade', 'rafael.andrade@exemplo.com', 'Indicação'),
  ('Juliana Prado',  'juliana.prado@exemplo.com',  'Site'),
  ('Bruno Lima',     'bruno.lima@exemplo.com',     'Feira'),
  ('Carolina Nunes', 'carolina.nunes@exemplo.com', 'Instagram'),
  ('Thiago Moreira', 'thiago.moreira@exemplo.com', 'Google')
) as novos (name, email, origin)
where not exists (
  select 1 from leads existentes where existentes.email = novos.email
);
