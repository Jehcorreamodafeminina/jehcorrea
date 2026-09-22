# Jeh Corrêa Moda Feminina — site

Site institucional/vitrine da **Jeh Corrêa Moda Feminina** ("Vista a sua essência"), construído do zero em HTML/CSS/JS puro — sem build, sem framework, 100% ferramentas gratuitas.

## Como abrir localmente

Não precisa instalar nada: é só abrir `index.html` no navegador (duplo clique) ou, para melhor compatibilidade, rodar um servidor local simples:

```bash
# com Python (já vem instalado na maioria dos PCs)
python -m http.server 8080
# depois abra http://localhost:8080
```

## Estrutura

```
index.html      → página inicial (hero, novidades, mais vendidas, sobre, instagram, newsletter)
colecao.html     → vitrine completa com filtro por categoria
sobre.html       → história da marca e valores
contato.html     → WhatsApp, formulário e informações de contato
assets/css/      → todo o estilo (cores e fontes da marca em variáveis CSS no topo do arquivo)
assets/js/       → interações: menu mobile, filtros, scroll suave, animações, formulários
assets/img/      → favicon; é aqui que entram as fotos reais dos produtos
```

## O que falta pra ficar 100% real (checklist para a cliente)

- [ ] **Fotos reais dos produtos e do ateliê** — hoje estão como caixas com `[ FOTO DO PRODUTO ]`. Basta trocar por `<img src="assets/img/nome-da-foto.jpg">` dentro de `.card-media` / `.editorial-media`.
- [ ] **Número de WhatsApp real** — trocar `5500000000000` (aparece em vários arquivos) pelo número com DDI+DDD, ex: `5511999998888`.
- [ ] **E-mail e endereço reais** em `contato.html`.
- [ ] **Preços e estoque reais** — os valores no site são exemplos para aprovação visual.
- [ ] **Cupom BEMVINDA10** — hoje é só visual; para funcionar de verdade precisa de uma loja com carrinho (ver seção "Próximo passo" abaixo).

## Efeitos de scroll usados

- **Lenis** (scroll suave/inercial) e **GSAP** (entrada do hero) — carregados via CDN gratuito (jsdelivr/cdnjs), sem necessidade de conta ou instalação.
- Revelação de seções ao rolar (fade + subida) com `IntersectionObserver` nativo do navegador.
- Barra/anel de progresso de leitura, header que ganha fundo ao rolar, contadores animados, carrossel de categorias (marquee).
- Todos os efeitos respeitam `prefers-reduced-motion` (acessibilidade).

## Deploy gratuito (GitHub Pages)

1. Suba este repositório para o GitHub (veja abaixo).
2. No repositório, vá em **Settings → Pages**.
3. Em "Source", selecione a branch `main` e a pasta `/ (root)`.
4. Salve — em 1-2 minutos o site fica no ar em `https://<usuario>.github.io/<repositorio>/`, grátis, sem precisar de servidor.

## Publicar no GitHub

```bash
git init
git add .
git commit -m "Site Jeh Corrêa Moda Feminina — versão inicial"
git branch -M main
git remote add origin https://github.com/Jehcorreamodafeminina/jehcorrea.git
git push -u origin main
```

## Próximo passo (loja de verdade, com carrinho e pagamento)

Este site é vitrine/institucional — bonito, rápido e gratuito para hospedar, mas **não processa pagamento**. Quando a cliente quiser vender direto pelo site (carrinho, Pix, cartão, estoque), o caminho mais simples e ainda gratuito para começar é:
- **Nuvemshop** ou **Shopify** (plano de teste) para o motor de loja, mantendo este mesmo visual como referência de identidade; ou
- Manter este site institucional e linkar os botões "Comprar" para o WhatsApp (como já está hoje) até a loja formal estar pronta.
