# Backend Jeh Corrêa — guia de configuração

Este projeto ganhou um backend completo (reaproveitado de outro projeto seu, adaptado pra moda feminina): painel admin, carrinho, checkout com Pix/cartão/boleto via Mercado Pago, e-mails automáticos via Brevo, upload de fotos via Cloudinary, tudo rodando em **funções serverless da Vercel** + banco de dados **Firestore** (Firebase). Tudo com planos gratuitos suficientes pra começar.

## ⚠️ Antes de tudo — o que está testado e o que não está

- **Painel admin + API (produtos, pedidos, e-mails, Mercado Pago, boletos):** vieram de um site que já roda em produção (só troquei marca/categorias/tamanhos). Alta confiança.
- **`checkout.html` + `assets/js/cart.js`:** eu construí do zero pra encaixar nesse backend (não existia no material que você me deu). **Nunca rodou contra uma conta real do Mercado Pago** — preciso testar de verdade assim que você tiver as credenciais abaixo, antes de considerar pronto pra clientes de verdade.
- **Catálogo público (home/coleção):** ainda são os cards de exemplo que já tínhamos — não puxam produtos do Firestore ainda. Isso é o próximo passo depois que o backend estiver validado (ver "Próximos passos" no fim).

## 1. Por que migrar do GitHub Pages pra Vercel

O GitHub Pages só serve arquivos estáticos — não roda as funções em `api/` (pagamento, e-mail, etc). A Vercel roda tudo isso de graça no plano Hobby. O código já tem o `vercel.json` pronto.

**Como migrar (5 min):**
1. Crie conta em [vercel.com](https://vercel.com) (dá pra entrar direto com a conta do GitHub).
2. "Add New" → "Project" → selecione o repositório `Jehcorreamodafeminina/jehcorrea`.
3. Não precisa mexer em nada nas configurações de build (é só HTML/CSS/JS, sem build step) — clique em Deploy.
4. Depois de configurar as variáveis de ambiente (passo 6 abaixo), redeploy.
5. Quando o domínio próprio estiver pronto, aponta ele pra Vercel em vez do GitHub Pages (Vercel → Settings → Domains).

## 2. Firebase (banco de dados + login do admin) — gratuito

1. Acesse [console.firebase.google.com](https://console.firebase.google.com) → **Criar projeto**. Recomendo criar com o ID exato **`jeh-correa-moda`** (assim você não precisa editar nada no código; se o Firebase já tiver esse nome em uso, use outro e me avise o que escolheu).
2. No menu lateral, **Firestore Database** → Criar banco → modo produção → região `southamerica-east1` (São Paulo).
3. **Authentication** → Sign-in method → ative **E-mail/senha**. Depois em "Users" → **Add user**, crie o login da Jeh (e-mail + senha) — é com isso que ela entra no `/admin`.
4. **Configurações do projeto** (ícone de engrenagem) → geral → role até "Seus apps" → **Adicionar app → Web** (ícone `</>`). Copie o objeto `firebaseConfig` que aparece.
5. Volte aqui e me passe esse `firebaseConfig` (ou edite você mesma) nestes arquivos, substituindo os textos `COLE_AQUI_...`:
   - `admin/index.html`, `admin/dashboard.html`, `admin/produto.html`, `admin/cupons.html`, `admin/blog.html`, `admin/blog-post.html`, `admin/configuracoes.html`
   - `assets/js/site-config.js`
   - `checkout.html`
6. **Configurações do projeto → Contas de serviço** → "Gerar nova chave privada" → baixa um `.json`. O **conteúdo inteiro** desse arquivo vira a variável de ambiente `FIREBASE_SERVICE_ACCOUNT` na Vercel (passo 6). Guarde esse arquivo com cuidado — ele dá acesso total ao banco.
7. **Regras de segurança do Firestore** — em Firestore Database → Regras, cole:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /produtos/{doc}      { allow read: if true; allow write: if request.auth != null; }
    match /configuracoes/{doc} { allow read: if true; allow write: if request.auth != null; }
    match /blog/{doc}          { allow read: if true; allow write: if request.auth != null; }
    match /cupons/{doc}        { allow read: if true; allow write: if request.auth != null; }
    match /pedidos/{doc} {
      allow create: if true;                    // qualquer cliente pode criar um pedido no checkout
      allow read, update, delete: if request.auth != null; // só o admin logado vê/edita pedidos
    }
  }
}
```

## 3. Cloudinary (upload de fotos) — gratuito

O admin sobe as fotos de produto/blog pro Cloudinary (mais rápido e barato que guardar no Firebase Storage).

1. Crie conta grátis em [cloudinary.com](https://cloudinary.com).
2. No Dashboard, copie o **Cloud name** (aparece no topo).
3. Vá em Settings → Upload → **Add upload preset** → modo **Unsigned** → nome sugerido: `jeh-correa-moda` → Save.
4. Volte aqui e troque `COLE_AQUI_SEU_CLOUD_NAME_CLOUDINARY` pelo seu Cloud name em: `admin/produto.html`, `admin/configuracoes.html`, `admin/blog-post.html`.

## 4. Brevo (e-mail transacional) — gratuito até 300 e-mails/dia

1. Crie conta em [brevo.com](https://www.brevo.com).
2. Configurações → **Chaves de API** → gere uma → essa é a `BREVO_API_KEY` (variável de ambiente, passo 6).
3. Verifique o domínio/e-mail remetente (`contato@jehcorrea.com.br`, ou o e-mail real que a Jeh for usar) em Configurações → Remetentes e IP.

## 5. Mercado Pago (Pix, cartão, boleto) — gratuito, taxa só por venda aprovada

1. Crie/acesse a conta Mercado Pago da Jeh Corrêa (tem que ser a conta dela, pra o dinheiro cair na conta dela).
2. Em [mercadopago.com.br/developers/panel](https://www.mercadopago.com.br/developers/panel) → crie uma aplicação → pegue:
   - **Access Token** (produção) → vira `MP_ACCESS_TOKEN`
   - **Public Key** (produção) → cole em `checkout.html` no lugar de `COLE_AQUI_SUA_PUBLIC_KEY_DO_MERCADO_PAGO`
3. Em "Webhooks" → cadastre a URL `https://SEU-DOMINIO/api/mp-webhook`, evento "Pagamentos" → copie a "Assinatura secreta" → vira `MP_WEBHOOK_SECRET`.

## 6. Variáveis de ambiente na Vercel

No projeto na Vercel → Settings → Environment Variables, adicione:

| Nome | Valor |
|---|---|
| `FIREBASE_SERVICE_ACCOUNT` | conteúdo inteiro do JSON da service account (passo 2.6) |
| `BREVO_API_KEY` | chave do Brevo (passo 4.2) |
| `MP_ACCESS_TOKEN` | access token do Mercado Pago (passo 5.2) |
| `MP_WEBHOOK_SECRET` | assinatura secreta do webhook (passo 5.3) |
| `CRON_SECRET` | qualquer texto aleatório seu (protege o cron de boletos) |
| `GSC_SITE_URL` | opcional — só se quiser estatísticas do Google Search Console no dashboard |

Depois de salvar, redeploy o projeto pra elas passarem a valer.

## 7. Depois de configurar tudo — testar antes de divulgar

1. Acesse `/admin`, faça login com o usuário criado no passo 2.3.
2. Cadastre um produto de teste em "Novo Produto".
3. Vá em `colecao.html` (ainda estático, ver "Próximos passos") e simule uma compra em `/checkout` com valores baixos, nos 3 métodos de pagamento, usando as [contas de teste do Mercado Pago](https://www.mercadopago.com.br/developers/pt/docs/checkout-api/additional-content/your-integrations/test/accounts) antes de usar dinheiro de verdade.
4. Confirme que o pedido aparece em `/admin/dashboard` e que os e-mails de status chegam.

## Próximos passos (ainda não feitos)

- **Catálogo dinâmico:** ligar `index.html`/`colecao.html` pra puxar produtos direto do Firestore (hoje são exemplos fixos em HTML) — assim o que a Jeh cadastra no admin aparece automaticamente no site.
- **Cupom no checkout:** o admin já tem tela de cupons, mas o `checkout.html` ainda não tem campo pra digitar o código.
- **Seleção de tamanho na vitrine:** hoje o botão "adicionar à sacola" da vitrine não pergunta o tamanho — dá pra evoluir depois que tivermos produtos reais cadastrados.
