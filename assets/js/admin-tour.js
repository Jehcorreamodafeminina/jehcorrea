/* ── AJUDA / TOUR GUIADO DO ADMIN ──
   Painel lateral com busca + tours passo-a-passo (coachmarks) explicando os
   campos de cada tela do admin. Um arquivo só, sem dependências, plugado
   nas 6 páginas do admin (script no fim do <body>) + 1 link "Ajuda" no menu.
   Cada tour vive em UMA página só (page/pageUrl). Se o tour pedido for de
   outra página, perguntamos se quer abrir ela (e retomamos sozinhos lá). */
(function () {
  'use strict';

  /* ─── DADOS DOS TOURS ─── */
  var TOURS = [
    {
      id: 'criar-produto', icon: '👗', cat: 'Produtos',
      title: 'Como criar um produto',
      desc: 'Todos os campos do formulário de produto novo, um por um.',
      keywords: 'cadastrar produto novo roupa peça foto preço estoque sku tamanho badge publicar',
      page: 'produto', pageLabel: 'Novo Produto', pageUrl: 'produto.html',
      steps: [
        { title: 'Cadastrando um produto novo', text: 'O formulário tem duas colunas: à esquerda as informações do produto, à direita as fotos e o botão de publicar. Vamos ver cada campo.' },
        { sel: '#nome', title: 'Nome do produto', text: 'Aparece pra cliente em todo o site — vitrine, página do produto, carrinho. Ex: “Vestido Midi Canelado”.' },
        { sel: '#descricao-curta', title: 'Descrição curta', text: 'Um resumo de uma linha, mostrado logo abaixo do nome na página do produto.' },
        { sel: '#descricao', title: 'Descrição completa', text: 'Texto mais longo — tecido, modelagem, como cuidar. Fica na aba de detalhes da página do produto.' },
        { sel: '#categoria', title: 'Categoria', text: 'Define o prefixo do SKU automático (ex: Vestidos → VES-001) e os tamanhos sugeridos logo abaixo. Escolha a categoria antes de mexer no SKU ou nos tamanhos.' },
        { sel: '#preco', title: 'Preço', text: 'Preço de venda. Se preencher também o “Preço original” ao lado, o site mostra o preço riscado e o percentual de desconto automaticamente.' },
        { sel: '#estoque', title: 'Estoque', text: 'Quantidade disponível. Quando chega a 0, o produto some da loja — a não ser que você ligue “Ao esgotar, manter na loja” lá embaixo em Visibilidade.' },
        { sel: '#sku', title: 'SKU / Código', text: 'Preenchido sozinho ao escolher a categoria (ex: VES-003). Só edite aqui se quiser um código diferente do automático.' },
        { sel: '#tamanho', title: 'Medida geral', text: 'Campo de texto livre pra medida geral da peça (ex: “Comprimento 110cm” ou “Único”). É diferente dos chips de “Tamanhos disponíveis” logo abaixo.' },
        { sel: '#acabamento', title: 'Tecido', text: 'Só informativo — Algodão, Linho, Viscose, Seda, Malha, Alfaiataria, Tricô ou Cetim.' },
        { sel: '#tamanhos-chips', title: 'Tamanhos disponíveis', text: 'Clique nos tamanhos que essa peça tem (ex: P, M, G...). Nenhum selecionado = produto sem variação de tamanho. Dá pra digitar um tamanho novo e clicar “+ Adicionar” — ele fica salvo pra reaparecer nos próximos produtos dessa mesma categoria.' },
        { sel: '#badge', title: 'Badge / Etiqueta', text: 'Uma etiqueta colorida no card do produto, tipo “Novo” ou “Mais Vendido”. Opcional.' },
        { sel: '#selo-oferta', title: 'Selo de desconto', text: 'Só aparece se o “Preço original” estiver preenchido. Troca o texto padrão “Economize X% off” por algo como “Oferta Especial”.' },
        { sel: '#toggle-ativo', title: 'Visibilidade', text: 'Os 4 interruptores aqui controlam: se o produto aparece na loja, se entra em destaque na home, se tem frete grátis garantido, e o que acontece quando o estoque zera (some da loja, ou fica visível em preto-e-branco com a faixa “Esgotado” — bom pra peça única).' },
        { sel: '#upload-area', title: 'Fotos do produto', text: 'Até 4 fotos, todas quadradas (1200×1200px). A primeira é a foto principal, usada nos cards da loja. Clique ou arraste e solte.' },
        { sel: '#btn-save', title: 'Publicar ou salvar como rascunho', text: '“Publicar na loja” deixa o produto visível pros clientes na hora. Logo abaixo, “Salvar como rascunho” guarda tudo sem mostrar na loja ainda — bom pra deixar pronto e publicar depois.' },
        { sel: '.preview-card', title: 'Pré-visualização', text: 'Mostra como o card do produto vai aparecer na vitrine, atualizando em tempo real enquanto você preenche.' },
      ]
    },
    {
      id: 'editar-produto', icon: '✏️', cat: 'Produtos',
      title: 'Como editar um produto',
      desc: 'Onde encontrar e abrir um produto já cadastrado.',
      keywords: 'editar alterar mudar produto cadastro',
      page: 'dashboard', pageLabel: 'Dashboard', pageUrl: 'dashboard.html',
      onEnter: function () { if (window.showSection) try { window.showSection('produtos'); } catch (e) {} },
      steps: [
        { title: 'Editando um produto existente', text: 'Todo produto cadastrado aparece listado aqui, na aba “Produtos” do Dashboard.' },
        { sel: '#table-produtos', title: 'A lista de produtos', text: 'Cada linha mostra foto, nome, categoria, preço, estoque e status (Ativo, Rascunho ou Inativo).' },
        { sel: '#tbody-produtos a.action-btn', title: 'Editar', text: 'Clique em “Editar” pra abrir o mesmo formulário do tour “Como criar um produto”, já preenchido com os dados atuais. Só o botão de publicar muda de nome, pra “Salvar alterações”.' },
        { sel: '#tbody-produtos button.action-btn:not(.danger)', title: 'Pausar / Ativar', text: 'Tira o produto da loja sem apagar nada (fica “Inativo”) — útil pra esconder temporariamente sem perder o cadastro. Clique de novo pra reativar.' },
      ]
    },
    {
      id: 'excluir-produto', icon: '🗑️', cat: 'Produtos',
      title: 'Como excluir um produto',
      desc: 'Apagar um produto para sempre (ação sem volta).',
      keywords: 'apagar deletar remover produto excluir',
      page: 'dashboard', pageLabel: 'Dashboard', pageUrl: 'dashboard.html',
      onEnter: function () { if (window.showSection) try { window.showSection('produtos'); } catch (e) {} },
      steps: [
        { sel: '#tbody-produtos button.action-btn.danger', title: 'Excluir produto', text: 'Apaga o produto pra sempre, incluindo as fotos. Se é só pra esconder da loja sem perder o cadastro, use “Pausar” em vez de excluir.' },
        { title: 'Confirmação', text: 'Depois de clicar, aparece uma pergunta com o nome do produto pedindo confirmação. Só confirme se tiver certeza — essa ação não pode ser desfeita.' },
      ]
    },
    {
      id: 'mudar-imagens-site', icon: '🖼️', cat: 'Aparência do site',
      title: 'Como mudar as imagens do site',
      desc: 'Foto principal, categorias e foto da fundadora.',
      keywords: 'trocar foto imagem banner hero categoria fundadora sobre',
      page: 'configuracoes', pageLabel: 'Configurações', pageUrl: 'configuracoes.html',
      steps: [
        { title: 'Trocando as fotos do site', text: 'As imagens do site (fora as fotos de produto, que ficam no cadastro do produto) estão espalhadas nos cards abaixo. Clique no título de um card pra abrir.' },
        { sel: '#area-hero', title: 'Foto principal (Hero)', text: 'A primeira coisa que o cliente vê ao abrir o site. Clique pra escolher uma foto nova — depois do upload aparece um controle pra ajustar o enquadramento (arrastando e com zoom).' },
        { sel: '#area-cat-vestidos', title: 'Fotos das categorias', text: 'Essa é a foto da categoria “Vestidos” na tela inicial. As outras (Conjuntos, Blusas, Calças, Casacos) funcionam do mesmo jeito, logo abaixo nesse mesmo card.' },
        { sel: '#area-sobre-hist', title: 'Foto da fundadora (página Sobre)', text: 'A foto ao lado do texto “Nossa História”, na página Sobre.' },
        { sel: '#btn-salvar', title: 'Não esqueça de salvar', text: 'Nada é gravado até clicar aqui, no topo da página. Fotos de produto individuais não ficam aqui — veja o tour “Como criar um produto”.' },
      ]
    },
    {
      id: 'dados-gerais-loja', icon: '📋', cat: 'Aparência do site',
      title: 'Como mudar os dados gerais da loja',
      desc: 'WhatsApp, e-mail, frete grátis, desconto Pix, aviso no topo.',
      keywords: 'whatsapp email contato frete gratis desconto pix aviso topo redes sociais instagram',
      page: 'configuracoes', pageLabel: 'Configurações', pageUrl: 'configuracoes.html',
      steps: [
        { sel: '#cfg-whatsapp', title: 'WhatsApp', text: 'Número que recebe as mensagens do botão flutuante e dos links “Falar no WhatsApp” do site inteiro. Só números, com DDD e o 55 do Brasil na frente.' },
        { sel: '#cfg-email', title: 'E-mail de contato', text: 'Mostrado no rodapé de todas as páginas.' },
        { sel: '#cfg-frete-gratis', title: 'Frete grátis a partir de', text: 'Valor mínimo do carrinho pra ganhar frete grátis — usado nos avisos do site inteiro.' },
        { sel: '#cfg-pix-desc', title: 'Desconto no Pix', text: 'Percentual de desconto à vista no Pix, usado automaticamente nos cálculos de preço do checkout e dos cards de produto.' },
        { sel: '#cfg-aviso', title: 'Aviso no topo do site', text: 'Texto que roda na faixinha no topo de todas as páginas. Deixe em branco pra esconder a faixa.' },
        { sel: '#cfg-instagram-url', title: 'Redes sociais', text: 'Links do Instagram, Facebook e TikTok que aparecem no rodapé do site.' },
        { sel: '#btn-salvar', title: 'Não esqueça de salvar', text: 'Nada é gravado até clicar aqui, no topo da página.' },
      ]
    },
    {
      id: 'cupons', icon: '🏷️', cat: 'Vendas',
      title: 'Como criar um cupom de desconto',
      desc: 'Códigos promocionais que o cliente usa no carrinho.',
      keywords: 'cupom desconto codigo promocao promoção vale',
      page: 'cupons', pageLabel: 'Cupons', pageUrl: 'cupons.html',
      steps: [
        { title: 'Cupons de desconto', text: 'Aqui você cria códigos promocionais (ex: VERAO10) que os clientes digitam no carrinho na hora de fechar o pedido.' },
        { sel: '#campo-codigo', title: 'Código do cupom', text: 'O que o cliente digita. Vira maiúsculo e sem espaço automaticamente enquanto você digita.' },
        { sel: '#campo-tipo', title: 'Tipo de desconto', text: 'Percentual (ex: 10%) ou valor fixo em reais (ex: R$ 20 de desconto).' },
        { sel: '#campo-valor', title: 'Valor do desconto', text: 'O número do desconto — a etiqueta do campo muda pra “%” ou “R$” dependendo do tipo escolhido acima.' },
        { sel: '#campo-minimo', title: 'Pedido mínimo', text: 'Valor mínimo de carrinho pro cupom valer. Deixe 0 pra não ter mínimo.' },
        { sel: '#campo-limite', title: 'Limite de usos', text: 'Quantas vezes esse cupom pode ser usado no total, somando todos os clientes. Vazio = ilimitado.' },
        { sel: '#campo-validade', title: 'Validade', text: 'Data em que o cupom para de funcionar sozinho. Opcional — sem data, vale pra sempre até você desativar.' },
        { sel: '#campo-descricao', title: 'Descrição interna', text: 'Só pra sua organização (ex: “Campanha Dia das Mães”) — o cliente nunca vê esse texto.' },
        { sel: '#campo-ativo', title: 'Cupom ativo', text: 'Desliga o cupom sem precisar apagar — bom pra pausar uma promoção e reativar depois.' },
        { sel: '#form-card button.btn-primary', title: 'Salvar cupom', text: 'Grava o cupom e ele já fica valendo no checkout.' },
        { sel: '#tabela-cupons', title: 'Cupons já criados', text: 'Todos os cupons cadastrados, com quantas vezes cada um já foi usado.' },
        { sel: '#tabela-cupons .btn-icon-edit', title: 'Editar um cupom', text: 'Carrega os dados dele de volta no formulário acima pra você alterar.' },
        { sel: '#tabela-cupons button[title="Excluir"]', title: 'Excluir um cupom', text: 'Apaga o cupom pra sempre — clientes com o código não vão mais conseguir usar.' },
      ]
    },
    {
      id: 'blog', icon: '📝', cat: 'Conteúdo',
      title: 'Como escrever um post no blog',
      desc: 'Título, conteúdo, capa e SEO de um artigo novo.',
      keywords: 'post blog artigo escrever publicar texto conteudo',
      page: 'blog-post', pageLabel: 'Novo Post do Blog', pageUrl: 'blog-post.html',
      steps: [
        { title: 'Escrevendo um post novo', text: 'Esse formulário funciona igual ao de produto: campos à esquerda, capa e botão de publicar à direita. Pra chegar aqui de novo, vá em Blog → “+ Novo Post”.' },
        { sel: '#titulo', title: 'Título', text: 'O título do artigo, mostrado na listagem do blog e na página do post.' },
        { sel: '#slug', title: 'Link (slug)', text: 'Gerado sozinho a partir do título — é o endereço da página do post. Pode editar, mas evite mudar depois de publicado (o link antigo para de funcionar).' },
        { sel: '#resumo', title: 'Resumo', text: 'Texto curto (até 160 caracteres) que aparece na listagem do blog e no resultado do Google.' },
        { sel: '#conteudo', title: 'Conteúdo do artigo', text: 'O texto completo. Aperte Enter pra separar parágrafos.' },
        { sel: '#categoria', title: 'Categoria', text: 'Ex: “Cuidados com Roupas”. Ajuda a organizar os posts no blog.' },
        { sel: '#autor', title: 'Autor', text: 'Nome mostrado como quem escreveu o post.' },
        { sel: '#meta-titulo', title: 'SEO (meta título e descrição)', text: 'Como o post aparece no Google. Se deixar em branco, usa o título e o resumo do post automaticamente.' },
        { sel: '#upload-area', title: 'Imagem de capa', text: 'Foto principal do post, mostrada na listagem e no topo do artigo. Recomendado 1200×675px.' },
        { sel: '#btn-save', title: 'Publicar ou salvar como rascunho', text: '“Publicar no blog” deixa o post visível na hora. “Salvar como rascunho”, logo abaixo, guarda sem publicar ainda.' },
        { sel: '.preview-card', title: 'Pré-visualização', text: 'Como o card do post vai aparecer na listagem do blog.' },
      ]
    },
  ];

  /* ─── ESTADO ─── */
  var state = { tour: null, step: 0, el: null };
  var els = {};

  /* ─── PÁGINA ATUAL ─── */
  function currentPage() {
    var p = location.pathname.toLowerCase();
    if (p.indexOf('produto') !== -1) return 'produto';
    if (p.indexOf('configuracoes') !== -1) return 'configuracoes';
    if (p.indexOf('cupons') !== -1) return 'cupons';
    if (p.indexOf('blog-post') !== -1) return 'blog-post';
    if (p.indexOf('blog') !== -1) return 'blog';
    return 'dashboard';
  }

  /* ─── CSS (injetado uma vez) ─── */
  function injectStyle() {
    if (document.getElementById('ec-tour-style')) return;
    var css = ''
      + '.ec-tour-panel{position:fixed;top:0;right:0;height:100%;width:min(92vw,380px);'
      + 'background:#FEFCF9;box-shadow:-8px 0 30px rgba(61,43,26,.18);z-index:2147483003;'
      + 'display:flex;flex-direction:column;transform:translateX(100%);transition:transform .28s ease;'
      + 'font-family:Jost,Arial,sans-serif;}'
      + '.ec-tour-panel.open{transform:translateX(0);}'
      + '.ec-tour-panel-head{padding:1.2rem 1.3rem;border-bottom:1px solid #E0CEBB;display:flex;'
      + 'align-items:center;gap:.6rem;}'
      + '.ec-tour-panel-head h3{margin:0;flex:1;font-family:Georgia,serif;font-weight:400;'
      + 'font-size:1.15rem;color:#3D2B1A;}'
      + '.ec-tour-close{width:44px;height:44px;min-width:44px;border-radius:8px;border:none;'
      + 'background:#F5F0EA;color:#5A4030;font-size:1.1rem;cursor:pointer;}'
      + '.ec-tour-search{margin:1rem 1.3rem;padding:.7rem .9rem;border:1px solid #E0CEBB;'
      + 'border-radius:8px;font-size:.85rem;font-family:inherit;background:#F5F0EA;color:#2A1F14;}'
      + '.ec-tour-list{flex:1;overflow-y:auto;padding:.2rem 1rem 1.3rem;}'
      + '.ec-tour-cat{font-size:.68rem;letter-spacing:.1em;text-transform:uppercase;color:#9C8070;'
      + 'margin:1rem .3rem .4rem;}'
      + '.ec-tour-item{display:flex;gap:.7rem;align-items:flex-start;width:100%;text-align:left;'
      + 'padding:.8rem .7rem;border:none;background:none;border-radius:9px;cursor:pointer;'
      + 'margin-bottom:.15rem;}'
      + '.ec-tour-item:active,.ec-tour-item:focus-visible{background:#F5F0EA;}'
      + '.ec-tour-item .em{font-size:1.15rem;line-height:1.3;}'
      + '.ec-tour-item b{display:block;font-size:.86rem;color:#3D2B1A;font-weight:600;margin-bottom:.15rem;}'
      + '.ec-tour-item span{display:block;font-size:.74rem;color:#9C8070;line-height:1.4;}'
      + '.ec-tour-empty{padding:1.5rem .7rem;color:#9C8070;font-size:.82rem;text-align:center;}'
      + '.ec-tour-block{position:fixed;inset:0;z-index:2147483000;background:transparent;}'
      + '.ec-tour-highlight{position:fixed;z-index:2147483001;pointer-events:none;border-radius:10px;'
      + 'border:2px solid #C4A47A;box-shadow:0 0 0 9999px rgba(20,14,8,.62),0 0 26px rgba(124,92,53,.55);'
      + 'transition:top .25s ease,left .25s ease,width .25s ease,height .25s ease;opacity:0;}'
      + '.ec-tour-highlight.show{opacity:1;}'
      + '.ec-tour-highlight.center{box-shadow:0 0 0 9999px rgba(20,14,8,.62);border:none;}'
      + '.ec-tour-tip{position:fixed;z-index:2147483002;width:min(90vw,320px);background:#FEFCF9;'
      + 'border-radius:12px;box-shadow:0 20px 50px rgba(20,14,8,.35);padding:1.1rem 1.2rem;'
      + 'font-family:Jost,Arial,sans-serif;visibility:hidden;}'
      + '.ec-tour-tip.show{visibility:visible;}'
      + '.ec-tour-tip .ec-prog{font-size:.68rem;letter-spacing:.08em;text-transform:uppercase;'
      + 'color:#C4A47A;margin-bottom:.4rem;}'
      + '.ec-tour-tip h4{margin:0 0 .5rem;font-family:Georgia,serif;font-weight:400;font-size:1.05rem;'
      + 'color:#3D2B1A;}'
      + '.ec-tour-tip p{margin:0 0 1rem;font-size:.82rem;line-height:1.55;color:#5A4030;}'
      + '.ec-tour-tip-btns{display:flex;align-items:center;gap:.5rem;}'
      + '.ec-tour-btn{min-height:44px;padding:0 1rem;border-radius:7px;border:none;font-size:.78rem;'
      + 'font-family:inherit;letter-spacing:.03em;cursor:pointer;}'
      + '.ec-tour-btn.primary{background:#7C5C35;color:#FEFCF9;flex:1;}'
      + '.ec-tour-btn.ghost{background:#F5F0EA;color:#5A4030;}'
      + '.ec-tour-btn.link{background:none;color:#9C8070;padding:0 .3rem;margin-right:auto;'
      + 'text-decoration:underline;min-height:auto;}'
      + '.ec-tour-btn:disabled{opacity:.4;cursor:default;}'
      + '@media(max-width:480px){.ec-tour-tip{width:min(94vw,320px);}}';
    var style = document.createElement('style');
    style.id = 'ec-tour-style';
    style.textContent = css;
    document.head.appendChild(style);
  }

  /* ─── PAINEL LATERAL ─── */
  function buildPanel() {
    if (els.panel) return;
    var panel = document.createElement('div');
    panel.className = 'ec-tour-panel';
    panel.innerHTML =
      '<div class="ec-tour-panel-head"><h3>Ajuda · Tour guiado</h3>' +
      '<button type="button" class="ec-tour-close" aria-label="Fechar">✕</button></div>' +
      '<input type="text" class="ec-tour-search" placeholder="Buscar (ex: trocar foto, cupom...)">' +
      '<div class="ec-tour-list"></div>';
    document.body.appendChild(panel);
    els.panel = panel;
    els.search = panel.querySelector('.ec-tour-search');
    els.list = panel.querySelector('.ec-tour-list');
    panel.querySelector('.ec-tour-close').addEventListener('click', closePanel);
    els.search.addEventListener('input', function () { renderList(els.search.value); });
  }

  function renderList(filter) {
    filter = (filter || '').toLowerCase().trim();
    var byCat = {};
    var order = [];
    TOURS.forEach(function (t) {
      var hay = (t.title + ' ' + t.desc + ' ' + t.keywords).toLowerCase();
      if (filter && hay.indexOf(filter) === -1) return;
      if (!byCat[t.cat]) { byCat[t.cat] = []; order.push(t.cat); }
      byCat[t.cat].push(t);
    });
    if (!order.length) {
      els.list.innerHTML = '<div class="ec-tour-empty">Nada encontrado. Tente outra palavra.</div>';
      return;
    }
    var html = '';
    order.forEach(function (cat) {
      html += '<div class="ec-tour-cat">' + cat + '</div>';
      byCat[cat].forEach(function (t) {
        html += '<button type="button" class="ec-tour-item" data-id="' + t.id + '">' +
          '<span class="em">' + t.icon + '</span><span><b>' + t.title + '</b><span>' + t.desc + '</span></span></button>';
      });
    });
    els.list.innerHTML = html;
    Array.prototype.forEach.call(els.list.querySelectorAll('.ec-tour-item'), function (btn) {
      btn.addEventListener('click', function () { start(btn.getAttribute('data-id')); });
    });
  }

  function openPanel() {
    if (window.closeSidebar) try { window.closeSidebar(); } catch (e) {}
    injectStyle();
    buildPanel();
    renderList(els.search.value);
    els.panel.classList.add('open');
  }
  function closePanel() {
    if (els.panel) els.panel.classList.remove('open');
  }

  /* ─── OVERLAY DO TOUR ─── */
  function buildOverlay() {
    if (els.block) return;
    injectStyle();
    els.block = document.createElement('div');
    els.block.className = 'ec-tour-block';
    els.highlight = document.createElement('div');
    els.highlight.className = 'ec-tour-highlight';
    els.tip = document.createElement('div');
    els.tip.className = 'ec-tour-tip';
    els.tip.innerHTML =
      '<div class="ec-prog"></div><h4></h4><p></p>' +
      '<div class="ec-tour-tip-btns">' +
      '<button type="button" class="ec-tour-btn link" data-act="skip">Pular tour</button>' +
      '<button type="button" class="ec-tour-btn ghost" data-act="back">Voltar</button>' +
      '<button type="button" class="ec-tour-btn primary" data-act="next">Próximo</button>' +
      '</div>';
    document.body.appendChild(els.block);
    document.body.appendChild(els.highlight);
    document.body.appendChild(els.tip);
    els.tip.querySelector('[data-act="skip"]').addEventListener('click', teardown);
    els.tip.querySelector('[data-act="back"]').addEventListener('click', function () { go(-1); });
    els.tip.querySelector('[data-act="next"]').addEventListener('click', function () { go(1); });
    document.addEventListener('keydown', onKey);
    window.addEventListener('resize', onViewportChange);
    window.addEventListener('orientationchange', onViewportChange);
  }

  function onKey(e) {
    if (!state.tour) return;
    if (e.key === 'Escape') teardown();
    if (e.key === 'ArrowRight') go(1);
    if (e.key === 'ArrowLeft') go(-1);
  }

  var resizeTimer = null;
  function onViewportChange() {
    if (!state.tour) return;
    clearTimeout(resizeTimer);
    // espera a UI do navegador (barra de endereço, teclado) assentar antes de remedir
    resizeTimer = setTimeout(function () {
      if (state.tour) paint(state.el, state.tour.steps[state.step]);
    }, 200);
  }

  function findEl(sel, cb, triesLeft) {
    if (!sel) return cb(null);
    triesLeft = triesLeft === undefined ? 20 : triesLeft;
    var el = document.querySelector(sel);
    if (el || triesLeft <= 0) return cb(el);
    setTimeout(function () { findEl(sel, cb, triesLeft - 1); }, 120);
  }

  function renderStep() {
    var tour = state.tour;
    var step = tour.steps[state.step];
    els.tip.classList.remove('show');
    els.highlight.classList.remove('show');

    findEl(step.sel, function (el) {
      if (el && el.closest) {
        var card = el.closest('.config-card.collapsed');
        if (card) card.classList.remove('collapsed');
      }
      if (el && el.scrollIntoView) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      state.el = el;
      setTimeout(function () { paint(el, step); }, el ? 320 : 0);
    });
  }

  function paint(el, step) {
    var vw = window.innerWidth, vh = window.innerHeight;
    if (el) {
      var r = el.getBoundingClientRect();
      var pad = 8;
      els.highlight.classList.remove('center');
      els.highlight.style.top = Math.max(4, r.top - pad) + 'px';
      els.highlight.style.left = Math.max(4, r.left - pad) + 'px';
      els.highlight.style.width = (r.width + pad * 2) + 'px';
      els.highlight.style.height = (r.height + pad * 2) + 'px';
    } else {
      els.highlight.classList.add('center');
      els.highlight.style.top = '46%';
      els.highlight.style.left = '50%';
      els.highlight.style.width = '1px';
      els.highlight.style.height = '1px';
    }
    els.highlight.classList.add('show');

    var idx = state.step, total = state.tour.steps.length;
    els.tip.querySelector('.ec-prog').textContent = 'Passo ' + (idx + 1) + ' de ' + total;
    els.tip.querySelector('h4').textContent = step.title || state.tour.title;
    els.tip.querySelector('p').textContent = step.text || '';
    els.tip.querySelector('[data-act="back"]').disabled = idx === 0;
    els.tip.querySelector('[data-act="next"]').textContent = idx === total - 1 ? 'Concluir' : 'Próximo';

    // posiciona o tooltip (mede tamanho real primeiro)
    els.tip.style.top = '-9999px';
    els.tip.style.left = '-9999px';
    els.tip.classList.add('show');
    var tw = els.tip.offsetWidth, th = els.tip.offsetHeight;
    var top, left;
    if (el) {
      var rect = el.getBoundingClientRect();
      var spaceBelow = vh - rect.bottom, spaceAbove = rect.top;
      if (spaceBelow >= th + 24 || spaceBelow >= spaceAbove) {
        top = Math.min(rect.bottom + 16, vh - th - 12);
      } else {
        top = Math.max(12, rect.top - th - 16);
      }
      left = rect.left + rect.width / 2 - tw / 2;
    } else {
      top = vh / 2 - th / 2;
      left = vw / 2 - tw / 2;
    }
    left = Math.max(12, Math.min(left, vw - tw - 12));
    top = Math.max(12, Math.min(top, vh - th - 12));
    els.tip.style.top = top + 'px';
    els.tip.style.left = left + 'px';
  }

  function go(dir) {
    var next = state.step + dir;
    if (next < 0) return;
    if (next >= state.tour.steps.length) return teardown(true);
    state.step = next;
    renderStep();
  }

  function teardown() {
    if (els.block) els.block.remove();
    if (els.highlight) els.highlight.remove();
    if (els.tip) els.tip.remove();
    document.removeEventListener('keydown', onKey);
    window.removeEventListener('resize', onViewportChange);
    window.removeEventListener('orientationchange', onViewportChange);
    clearTimeout(resizeTimer);
    els.block = els.highlight = els.tip = null;
    state.tour = null; state.step = 0; state.el = null;
  }

  function start(id) {
    var tour = null;
    for (var i = 0; i < TOURS.length; i++) if (TOURS[i].id === id) tour = TOURS[i];
    if (!tour) return;
    closePanel();
    if (tour.page !== currentPage()) {
      var go2 = window.confirm('Esse tour é sobre a tela "' + tour.pageLabel + '". Abrir essa tela agora?');
      if (go2) {
        try { sessionStorage.setItem('ecTourPending', JSON.stringify({ id: id })); } catch (e) {}
        location.href = tour.pageUrl;
      }
      return;
    }
    buildOverlay();
    if (tour.onEnter) { try { tour.onEnter(); } catch (e) {} }
    state.tour = tour;
    state.step = 0;
    renderStep();
  }

  function resumePending() {
    var raw;
    try { raw = sessionStorage.getItem('ecTourPending'); } catch (e) { return; }
    if (!raw) return;
    try { sessionStorage.removeItem('ecTourPending'); } catch (e) {}
    var data;
    try { data = JSON.parse(raw); } catch (e) { return; }
    var tour = null;
    for (var i = 0; i < TOURS.length; i++) if (TOURS[i].id === data.id) tour = TOURS[i];
    if (tour && tour.page === currentPage()) {
      setTimeout(function () { start(data.id); }, 500);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', resumePending);
  } else {
    resumePending();
  }

  window.AdminTour = { open: openPanel, close: closePanel, start: start };
})();
