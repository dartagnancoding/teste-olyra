# Deploy — do zero ao link do Netlify

Runbook da primeira publicação. Feito para ser seguido de cima para baixo, sem
decidir nada no caminho.

**Tempo estimado:** 10 a 15 minutos, quase todo em espera de build.

---

## Antes de começar

Já está pronto no repositório — não precisa mexer:

| Item | Estado |
|---|---|
| Branch `main` | working tree limpo |
| Build de produção | verde (`npm run build`) |
| Testes | 54 verdes (`npm test`) |
| Lint e tipos | limpos (`npm run lint`, `npx tsc --noEmit`) |
| Segredos versionados | nenhum — só `.env.example` com placeholders |
| `netlify.toml` | build, plugin do Next e `NODE_VERSION = "22"` |

> Se `npm run build` falhar **local** com `PageNotFoundError: /_document`, é
> `.next` obsoleto de quando as rotas mudaram, não o seu código: `rm -rf .next`
> e rode de novo. O Netlify builda do zero, então nunca esbarra nisso.

Você vai precisar de: conta no GitHub, conta no Netlify e o seu `.env.local`
aberto do lado (os valores reais vão para o painel do Netlify).

> **Por que o Node está pinado:** a ordenação da lista usa
> `Array.prototype.toSorted`, que só existe no Node 20+. Como esse código roda
> também no SSR, uma conta antiga do Netlify buildaria sem erro e quebraria em
> produção. O pin fecha esse buraco.

---

## Passo 1 — Publicar no GitHub

Crie um repositório **privado e vazio** em [github.com/new](https://github.com/new)
— sem README, sem `.gitignore`, sem licença. Qualquer arquivo inicial cria um
commit que conflita com o histórico local.

Privado basta: o Netlify no plano gratuito lê repositório privado sem problema,
e o código vai para a Olyra por `.zip`, não por link.

Depois, no terminal (ou colando aqui no chat com `!` na frente):

```bash
git remote add origin https://github.com/<seu-usuario>/<repo>.git
git push -u origin main
```

O Git Credential Manager vai abrir o navegador para autenticar na primeira vez.

**Como saber que deu certo:** `git remote -v` mostra o `origin`, e o GitHub
lista o histórico completo — o mesmo que `git log --oneline` mostra aqui.

---

## Passo 2 — Conectar no Netlify

Em [app.netlify.com](https://app.netlify.com):

1. **Add new site → Import an existing project**
2. **Deploy with GitHub** e autorize o acesso
3. Escolha o repositório

Não configure comando de build nem diretório de publicação. O `netlify.toml`
já declara os dois, e o painel vai preenchê-los sozinho.

**Não clique em Deploy ainda** — falta o passo 3.

---

## Passo 3 — Variáveis de ambiente

Em **Site configuration → Environment variables → Add a variable**, cadastre as
sete. Os valores são os mesmos do seu `.env.local`.

| Variável | Observação |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL do Supabase |
| `SUPABASE_SECRET_KEY` | a `sb_secret_…` — **nunca** a publishable |
| `AUTH_USER` | usuário do painel |
| `AUTH_PASSWORD` | senha do painel |
| `SESSION_SECRET` | string aleatória longa |
| `RESEND_API_KEY` | resend.com → API Keys |
| `RESEND_FROM` | `onboarding@resend.dev` |

Marque o escopo como **All scopes** / todos os contextos de deploy.

> Se esquecer alguma, o build **não** quebra: o app sobe e a tela mostra qual
> variável falta, com o nome dela. Foi desenhado assim de propósito — falhar no
> uso, com mensagem clara, em vez de falhar no build com erro críptico.

Agora sim: **Deploy site**. O primeiro build leva de 2 a 4 minutos.

---

## Passo 4 — Nome do site

O enunciado pede "de preferência com domínio organizado".

**Site configuration → Change site name** → algo como `olyra-crm`.

Resultado: `https://olyra-crm.netlify.app`.

---

## Passo 5 — Testar em produção

Abra o link e percorra a lista. Marque conforme for:

- [ ] Login com as credenciais fixas (aparecem na própria tela)
- [ ] Rota protegida: abrir `/crm` numa aba anônima manda para `/login`
- [ ] Lista carrega os 6 leads com badge de origem preenchido
- [ ] Busca por nome funciona, inclusive **sem acento** (`indicacao`)
- [ ] Filtro por origem
- [ ] Ordenação: mais recentes, mais antigos, A–Z, Z–A
- [ ] Toggle de lista ↔ cards **mantendo** o filtro aplicado
- [ ] Cadastrar um lead pelo botão "Novo lead" (modal)
- [ ] Menu ⋮ abre e posiciona certo — inclusive na última linha da tabela
- [ ] Excluir um lead, com a confirmação
- [ ] **Abrir no celular de verdade**, não só no devtools

Os dois últimos merecem atenção: o menu ⋮ e o toggle são os que **não** deu
tempo de verificar no navegador antes do deploy.

---

## Passo 6 — O email obrigatório

O enunciado exige encaminhar *"o email de boas-vindas enviado pela plataforma"*.

Lembrete da limitação: sem domínio verificado, o Resend só envia **para o
endereço cadastrado na sua conta**. Então:

1. Cadastre um lead com **o seu próprio email**
2. Dispare as boas-vindas (botão rápido na coluna de status)
3. Confirme que o email chegou
4. Guarde para encaminhar na entrega

Se der erro, a mensagem exibida é a do próprio Resend — costuma dizer
exatamente qual endereço ele recusou.

---

## Se algo falhar

A aplicação nomeia as falhas. O código aparece na tela e casa com a linha
correspondente no log do Netlify (**Deploys → Functions → logs**).

| Código na tela | Causa provável | O que fazer |
|---|---|---|
| `DB_UNREACHABLE` | URL ou secret key erradas, ou projeto Supabase pausado | Conferir as duas variáveis e o status do projeto |
| `DB_SCHEMA_MISMATCH` | coluna renomeada ou faltando | Comparar a tabela com `supabase/schema.sql` |
| `DB_CONFLICT` | email repetido | Esperado — o índice único está funcionando |
| `MAIL_REJECTED` | limitação do Resend | Enviar para o email da conta (passo 6) |
| Erro citando `requireEnv` | variável não cadastrada | O nome dela vem na mensagem |

**Build falhando no Netlify:** confira se o log mostra `Node.js v22`. Se
mostrar v18, o `netlify.toml` não foi lido — o repositório subiu incompleto.

---

## Depois que estiver no ar

Em ordem de prioridade:

1. **Montar o `.zip`:**

   ```bash
   npm run pack:entrega
   ```

   Gera `olyra-crm.zip` (~213 KB, 120 arquivos). Usa `git archive`, então
   empacota **exatamente o que está versionado** — `node_modules`, `.next`,
   `.env.local` e `.claude` ficam de fora por construção, não por uma lista de
   exclusão que alguém pode esquecer de atualizar.

   > Atenção: `git archive` lê o **último commit**, não o working tree. Se você
   > editou algo agora, commite antes de empacotar ou a mudança não vai no zip.

   O zip inclui `specs/spec-desafio-olyra.md`, o enunciado do próprio desafio.
   Se preferir não devolvê-lo junto, remova o arquivo do repositório antes.

2. **Enviar** para `tech@olyra.com.br` e `brunoqueirozbk@gmail.com` com: zip,
   link do Netlify, credenciais e o email de boas-vindas encaminhado

3. Só então as melhorias — editor da mensagem do email, status de lead

O prazo é **quarta, 12/08**. Os itens 1 e 2 são a entrega; o resto é extra.

---

## Fica registrado

Dois buracos conhecidos, nenhum bloqueia a entrega:

- **A sessão não expira no servidor.** O cookie guarda sempre o mesmo HMAC; as
  8 horas vêm do `maxAge`, que quem respeita é o navegador. Um cookie copiado
  vale até o `SESSION_SECRET` mudar.
- **Sem rate limit no login.** Não há limite de tentativas de senha.
