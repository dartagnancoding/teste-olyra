-- Sete leads fictícios para visualização inicial. Idempotente: rodar de novo
-- não duplica — o email é a chave, e há índice único sobre ele.
--
-- Cada lead recebe um `created_at` próprio, recuado em dias a partir de agora.
-- Sem isso todos herdam o mesmo `now()` da transação, com precisão de
-- microssegundo idêntica — e aí "mais recentes" e "mais antigos" devolvem
-- exatamente a mesma ordem, fazendo a ordenação parecer quebrada na demo.
--
-- Dois já receberam boas-vindas, para a coluna de status ter os dois estados e
-- o botão de envio rápido aparecer habilitado e desabilitado na mesma tela.

insert into leads (name, email, origin, created_at, welcome_sent_at)
select
  novos.name,
  novos.email,
  novos.origin,
  now() - (novos.dias_atras || ' days')::interval,
  case
    when novos.boas_vindas_ha_dias is null then null
    else now() - (novos.boas_vindas_ha_dias || ' days')::interval
  end
from (values
  -- Nome com acento de propósito: é o que permite demonstrar que a busca
  -- encontra "Letícia Gonçalves" quando se digita "leticia goncalves".
  ('Letícia Gonçalves', 'leticia.goncalves@exemplo.com', 'Indicação', 1, null::int),
  ('Mariana Costa',  'mariana.costa@exemplo.com',  'Instagram', 0,  null),
  ('Rafael Andrade', 'rafael.andrade@exemplo.com', 'Indicação', 2,  1),
  ('Juliana Prado',  'juliana.prado@exemplo.com',  'Site',      5,  null),
  ('Bruno Lima',     'bruno.lima@exemplo.com',     'Feira',     9,  null),
  ('Carolina Nunes', 'carolina.nunes@exemplo.com', 'Instagram', 14, 12),
  ('Thiago Moreira', 'thiago.moreira@exemplo.com', 'Google',    21, null)
) as novos (name, email, origin, dias_atras, boas_vindas_ha_dias)
where not exists (
  select 1 from leads existentes where existentes.email = novos.email
);
