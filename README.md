# Olyra — Mini CRM de Leads

Painel para cadastrar leads, filtrar por origem e disparar o email de boas-vindas. Lista e cards da mesma base, login protegido e envio real de email — com uma prévia no header mostrando o que o lead recebe.

Visual seguindo o site da Olyra: superfícies brancas sobre `#f5f5f5`, verde floresta nas ações, Raleway nos títulos.

## Rodando

O `.env.local` já vem preenchido no zip, então é só:

```bash
npm install
npm run dev
```

Abre em http://localhost:3000. As credenciais do painel estão no `.env.local` (`AUTH_USER` / `AUTH_PASSWORD`) e também aparecem na tela de login.

O banco já está criado e populado no Supabase — o `.env.local` aponta para ele. Se quiser subir um do zero, rode `supabase/schema.sql` e `supabase/seed.sql` no SQL Editor de um projeto novo e troque as variáveis.

Para publicar na Netlify, o `netlify.toml` já declara o build, o plugin do Next e o Node 22 — basta conectar o repositório e cadastrar as variáveis do `.env.example`.

## Stack, e por quê

| Escolha | Alternativa óbvia | Por quê |
|---|---|---|
| **Next.js 15** | Vite + React SPA | A SPA precisaria de um backend separado só para guardar a chave do Supabase e mandar o email — segredo não pode ir para o navegador. Com Next é um projeto só: o servidor lê o banco e o client recebe HTML pronto, sem tela piscando enquanto o `useEffect` busca. |
| **TypeScript strict** | JavaScript | O ganho aqui é concreto: o retorno do banco é `any`, e é o tipo que obriga a validar antes de confiar. Com `noUncheckedIndexedAccess`, um acesso a índice já vem como possivelmente `undefined`. |
| **Supabase** | Postgres próprio, Neon, PlanetScale | Honestamente: é Postgres gerenciado, gratuito e sobe em dois minutos — para o escopo do desafio, provisionar infra seria tempo gasto no lugar errado. O que compensa é o código não depender disso: a application fala com a porta `LeadRepository`, e trocar o banco é escrever outra implementação em `data/`. |
| **Tailwind v4** | CSS Modules, styled-components | Com `@theme`, toda cor é token semântico (`bg-surface`, não `bg-white`). Trocar a identidade é editar um bloco, não caçar hex em 40 arquivos. |
| **React Hook Form + Zod** | `useState` por campo | O mesmo schema valida no navegador e revalida na Server Action. Sem isso seriam duas validações para manter em sincronia — e a do servidor é a que importa, porque a action é endpoint público. |
| **Resend** | Nodemailer + SMTP | SMTP exigiria credencial de servidor de email e lidar com entrega. A Resend é uma chamada HTTP. Também está atrás de uma porta (`WelcomeMailer`), então trocar por SES é um arquivo. |
| **Vitest** | Jest | Lê o mesmo `tsconfig` e os mesmos aliases sem configuração extra. |
| **Motion** | CSS puro | Só onde CSS não alcança: animar item que **sai** de uma lista exige saber que ele vai sair, e `AnimatePresence` resolve isso. O modal, que não tem esse problema, é CSS puro. |

## Decisões

**Server Actions, sem rotas de API.** O único cliente do backend é o próprio front. Uma API REST aqui seria serializar JSON e escolher status codes para falar consigo mesmo. Isso removeu quatro rotas e o gateway HTTP inteiro. Como Server Action é endpoint público, a checagem de sessão e o parse com Zod continuam lá dentro.

**Leitura no servidor, mutação no client.** `/crm` é Server Component e carrega a lista direto do repositório, sem `useEffect` de fetch. O client recebe como estado inicial e atualiza com o lead que a mutação devolve.

**Filtro no client.** A base cabe em memória. Resposta instantânea e sem ida ao servidor a cada tecla. Se crescer, o ponto de troca é `application/filter-leads.ts` mais um parâmetro no `getLeads()`.

**Login por cookie assinado, não Supabase Auth.** O enunciado pede credencial fixa. O cookie guarda um HMAC-SHA256 do usuário — o segredo nunca vai para o navegador, então não dá para forjar sessão. `httpOnly`, `sameSite=lax`, `secure` em produção, 8h. Comparação com `timingSafeEqual`.

**RLS ligada e sem policy.** Todo acesso passa pelo servidor com a secret key. Sem policy, a chave pública não lê nada nem se vazar.

**Lista e cards com um estado só.** As duas visões leem do mesmo `useLeadList`, então busca e filtro valem para ambas. Antes eram duas rotas com estados paralelos e trocar de aba perdia o filtro.

## O envio de email

Vale ler antes de testar, porque afeta o que você vai ver.

A limitação da Resend é do **remetente**, não do destinatário. Enquanto o `from` for `onboarding@resend.dev` — domínio compartilhado da Resend, usado por todas as contas em teste — ela só entrega no endereço dono da conta. Qualquer outro destinatário volta com 403 e o email não sai. É o que impede o domínio de sandbox de virar relay de spam.

Tratar isso como erro deixaria o painel parecendo quebrado. Então, com `MAIL_REDIRECT_TO` preenchido, o envio é desviado para esse endereço e o email chega com uma tarja no topo dizendo para quem ele iria. O disparo é real: a API é chamada, o email existe, o lead é marcado como respondido. Só o destinatário muda.

Ou seja: se você cadastrar um lead com o seu email e clicar em enviar, vai dar tudo certo na tela mas o email cai na caixa do administrador. A prévia no header avisa isso.

Deixando `MAIL_REDIRECT_TO` vazio, o lead recebe direto — é o que acontece assim que um domínio da Olyra for verificado e `RESEND_FROM` apontar para ele. Nenhuma linha de código muda.

Recusas que não são essa (excesso de envio, credencial inválida) continuam sendo erro de verdade, traduzidas em `data/resend-errors.ts`. O texto original da API vai só para o log, porque ele carrega o endereço dono da conta.

## Estrutura

Organizado **por feature**, não por tipo de arquivo. A alternativa comum — `components/`, `services/`, `hooks/` na raiz — parece arrumada em projeto pequeno e espalha uma mudança por cinco pastas assim que cresce. Aqui, mexer em leads é mexer em `features/leads/`.

Cada feature tem quatro camadas, com as dependências apontando para dentro:

```
components → application → types (portas) ← data
```

Componentes chamam casos de uso; casos de uso dependem só de contratos declarados em `types`; `data` implementa esses contratos. A seta invertida em `data` é o ponto: quem decide o formato é quem precisa dele, não o banco.

Nenhum componente importa `data` nem o cliente do banco — o pacote `server-only` transforma essa tentativa em erro de build, então o vazamento de chave não depende de alguém lembrar da regra.

```
src/features/leads/     components, hooks, application, data, types
                        actions.ts (Server Actions) + dependencies.server.ts
src/features/auth/      mesma divisão
src/components/         ui (button, modal, menu…), layout, brand
src/lib/                cliente Supabase, utils, leitura de env
src/app/                login, (app)/crm — grupo protegido por guard de sessão
supabase/               schema.sql e seed.sql
```

Trocar Supabase por Postgres é escrever outra implementação da porta `LeadRepository` e apontar uma linha do composition root. A application e os componentes não mudam. Mesma coisa para trocar a Resend, via `WelcomeMailer`.

Testes ficam ao lado do que testam, não numa árvore `__tests__` paralela.

## Testes

```bash
npm test
```

Vitest, ambiente Node. Cobertura deliberadamente estreita: lógica pura e fronteiras, que é onde o erro passa despercebido.

| Arquivo | O que garante |
|---|---|
| `filter-leads` | busca sem acento, filtro, as quatro ordenações, não-mutação da lista |
| `postgrest-errors` | cada código do Postgres cai na categoria certa |
| `lead-row` | coluna renomeada no banco derruba o parse — regressão de um bug real |
| `lead-schema` | normalização e recusa de entrada inválida |
| `describe-failure` | detalhe técnico vai para o log, nunca para a tela |
| `format` | data no fuso de São Paulo, sem "Invalid Date" |
| `welcome-email-template` | o nome do lead é interpolado no HTML — o escape está coberto |
| `resend-errors` | recusa do provedor vira frase útil, sem vazar o email da conta |

Não há teste de componente nem E2E. No tempo disponível, cobrir o que falha em silêncio rende mais que simular clique; a interface foi verificada no navegador.

## Funcionalidades

- Login com credencial fixa, rotas protegidas
- Cadastro em modal, com validação
- Busca por nome ou email, sem acento e sem diferenciar maiúsculas
- Filtro por origem e quatro ordenações
- Tabela em tela larga, cards empilhados no celular, sem scroll horizontal
- Envio real de boas-vindas, com status persistido
- Estados de carregamento, vazio e erro em toda tela com dados
- `prefers-reduced-motion` respeitado

## Scripts

```bash
npm run dev     # desenvolvimento
npm run build   # build de produção
npm run start   # servir o build
npm run lint    # ESLint
npm test        # Vitest
```
