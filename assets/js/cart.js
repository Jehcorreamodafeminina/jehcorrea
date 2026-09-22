/* ============================================================
   Jeh Corrêa — Carrinho de compras
   Guarda os itens no localStorage do navegador (por enquanto —
   é o que permite o checkout funcionar sem precisar de login).
   Plugado em todas as páginas públicas (script no fim do <body>).
   ============================================================ */
(function () {
  'use strict';

  var STORAGE_KEY = 'jc_cart_v1';

  function readCart() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      var arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr : [];
    } catch (e) { return []; }
  }

  function writeCart(items) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch (e) { /* localStorage indisponível */ }
    updateBadges();
    renderDrawer();
  }

  function keyOf(item) { return (item.sku || item.nome) + '::' + (item.tamanho || ''); }

  function add(item) {
    var items = readCart();
    var k = keyOf(item);
    var existing = items.find(function (i) { return keyOf(i) === k; });
    if (existing) { existing.qty += item.qty || 1; }
    else { items.push({ sku: item.sku || null, nome: item.nome, tamanho: item.tamanho || null, preco: Number(item.preco) || 0, qty: item.qty || 1 }); }
    writeCart(items);
    openDrawer();
  }

  function setQty(k, qty) {
    var items = readCart();
    var it = items.find(function (i) { return keyOf(i) === k; });
    if (!it) return;
    it.qty = Math.max(1, qty | 0);
    writeCart(items);
  }

  function remove(k) {
    writeCart(readCart().filter(function (i) { return keyOf(i) !== k; }));
  }

  function clear() { writeCart([]); }

  function total() {
    return readCart().reduce(function (sum, i) { return sum + i.preco * i.qty; }, 0);
  }

  function count() {
    return readCart().reduce(function (sum, i) { return sum + i.qty; }, 0);
  }

  function fmtBRL(v) {
    return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  /* ---------- badges do ícone de sacola (header) ---------- */
  function updateBadges() {
    var n = count();
    document.querySelectorAll('.bag-count').forEach(function (el) { el.textContent = String(n); });
  }

  /* ---------- injeta CSS uma vez ---------- */
  function injectStyle() {
    if (document.getElementById('jc-cart-style')) return;
    var css = ''
      + '.jc-cart-overlay{position:fixed;inset:0;background:rgba(58,46,34,.45);z-index:120;opacity:0;pointer-events:none;transition:opacity .3s ease;}'
      + '.jc-cart-overlay.open{opacity:1;pointer-events:auto;}'
      + '.jc-cart-drawer{position:fixed;top:0;right:0;height:100%;width:min(92vw,420px);background:var(--cream, #F5ECDC);'
      + 'box-shadow:-12px 0 40px rgba(58,46,34,.25);z-index:121;display:flex;flex-direction:column;'
      + 'transform:translateX(100%);transition:transform .35s cubic-bezier(.16,1,.3,1);font-family:"Jost",sans-serif;}'
      + '.jc-cart-drawer.open{transform:translateX(0);}'
      + '.jc-cart-head{padding:22px 24px;border-bottom:1px solid var(--cream-deep,#E3D3B4);display:flex;align-items:center;justify-content:space-between;}'
      + '.jc-cart-head h3{margin:0;font-family:"Playfair Display",serif;font-size:19px;color:var(--bronze-deep,#5F452C);}'
      + '.jc-cart-close{width:36px;height:36px;border:none;background:none;font-size:18px;cursor:pointer;color:var(--ink,#3A2E22);}'
      + '.jc-cart-list{flex:1;overflow-y:auto;padding:8px 24px;}'
      + '.jc-cart-item{display:flex;gap:14px;padding:16px 0;border-bottom:1px solid var(--cream-deep,#E3D3B4);}'
      + '.jc-cart-item-media{width:64px;height:80px;background:var(--cream-soft,#EDE0C6);flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:9px;color:var(--ink-soft,#6B5C48);text-align:center;}'
      + '.jc-cart-item-info{flex:1;display:flex;flex-direction:column;gap:4px;}'
      + '.jc-cart-item-info b{font-size:13.5px;font-weight:500;color:var(--ink,#3A2E22);}'
      + '.jc-cart-item-info span{font-size:11.5px;color:var(--ink-soft,#6B5C48);}'
      + '.jc-cart-qty{display:flex;align-items:center;gap:8px;margin-top:4px;}'
      + '.jc-cart-qty button{width:22px;height:22px;border:1px solid var(--cream-deep,#E3D3B4);background:#fff;cursor:pointer;font-size:12px;line-height:1;}'
      + '.jc-cart-remove{background:none;border:none;color:var(--ink-soft,#6B5C48);text-decoration:underline;font-size:11px;cursor:pointer;align-self:flex-start;margin-top:2px;}'
      + '.jc-cart-item-price{font-family:"Playfair Display",serif;font-size:14px;color:var(--bronze-deep,#5F452C);white-space:nowrap;}'
      + '.jc-cart-empty{padding:60px 20px;text-align:center;color:var(--ink-soft,#6B5C48);font-size:13.5px;}'
      + '.jc-cart-foot{padding:20px 24px 24px;border-top:1px solid var(--cream-deep,#E3D3B4);}'
      + '.jc-cart-total{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:14px;}'
      + '.jc-cart-total span{font-size:12px;letter-spacing:1px;text-transform:uppercase;color:var(--ink-soft,#6B5C48);}'
      + '.jc-cart-total b{font-family:"Playfair Display",serif;font-size:22px;color:var(--bronze-deep,#5F452C);}'
      + '.jc-cart-checkout{display:block;width:100%;text-align:center;padding:15px;background:var(--bronze-deep,#5F452C);color:#fff;'
      + 'text-decoration:none;font-size:12px;letter-spacing:2px;text-transform:uppercase;border:none;cursor:pointer;}'
      + '.jc-cart-checkout:disabled{opacity:.5;cursor:not-allowed;}'
      + '.jc-cart-note{font-size:11px;color:var(--ink-soft,#6B5C48);text-align:center;margin-top:10px;}'
      + '@media(prefers-reduced-motion:reduce){.jc-cart-drawer,.jc-cart-overlay{transition:none;}}';
    var style = document.createElement('style');
    style.id = 'jc-cart-style';
    style.textContent = css;
    document.head.appendChild(style);
  }

  var els = {};
  function buildDrawer() {
    if (els.drawer) return;
    injectStyle();
    els.overlay = document.createElement('div');
    els.overlay.className = 'jc-cart-overlay';
    els.overlay.addEventListener('click', closeDrawer);

    els.drawer = document.createElement('aside');
    els.drawer.className = 'jc-cart-drawer';
    els.drawer.setAttribute('aria-label', 'Sacola de compras');
    els.drawer.innerHTML =
      '<div class="jc-cart-head"><h3>Sua sacola</h3><button type="button" class="jc-cart-close" aria-label="Fechar sacola">✕</button></div>' +
      '<div class="jc-cart-list"></div>' +
      '<div class="jc-cart-foot">' +
      '<div class="jc-cart-total"><span>Total</span><b class="jc-cart-total-val">R$ 0,00</b></div>' +
      '<a href="checkout.html" class="jc-cart-checkout">Finalizar compra</a>' +
      '<p class="jc-cart-note">Frete e forma de pagamento na próxima etapa.</p>' +
      '</div>';
    document.body.appendChild(els.overlay);
    document.body.appendChild(els.drawer);
    els.drawer.querySelector('.jc-cart-close').addEventListener('click', closeDrawer);
  }

  function renderDrawer() {
    if (!els.drawer) return;
    var items = readCart();
    var list = els.drawer.querySelector('.jc-cart-list');
    var totalEl = els.drawer.querySelector('.jc-cart-total-val');
    var checkoutBtn = els.drawer.querySelector('.jc-cart-checkout');
    totalEl.textContent = fmtBRL(total());
    checkoutBtn.classList.toggle('disabled', items.length === 0);
    if (!items.length) {
      list.innerHTML = '<div class="jc-cart-empty">Sua sacola está vazia.<br>Que tal dar uma olhada na coleção?</div>';
      return;
    }
    list.innerHTML = items.map(function (i) {
      var k = keyOf(i);
      return '<div class="jc-cart-item">' +
        '<div class="jc-cart-item-media">[ FOTO ]</div>' +
        '<div class="jc-cart-item-info">' +
        '<b>' + escapeHtml(i.nome) + '</b>' +
        (i.tamanho ? '<span>Tamanho: ' + escapeHtml(i.tamanho) + '</span>' : '') +
        '<div class="jc-cart-qty">' +
        '<button type="button" data-act="dec" data-k="' + escapeAttr(k) + '" aria-label="Diminuir quantidade">−</button>' +
        '<span>' + i.qty + '</span>' +
        '<button type="button" data-act="inc" data-k="' + escapeAttr(k) + '" aria-label="Aumentar quantidade">+</button>' +
        '</div>' +
        '<button type="button" class="jc-cart-remove" data-act="rm" data-k="' + escapeAttr(k) + '">Remover</button>' +
        '</div>' +
        '<div class="jc-cart-item-price">' + fmtBRL(i.preco * i.qty) + '</div>' +
        '</div>';
    }).join('');

    list.querySelectorAll('[data-act]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var k = btn.getAttribute('data-k');
        var act = btn.getAttribute('data-act');
        var it = readCart().find(function (i) { return keyOf(i) === k; });
        if (!it) return;
        if (act === 'inc') setQty(k, it.qty + 1);
        if (act === 'dec') setQty(k, it.qty - 1);
        if (act === 'rm') remove(k);
      });
    });
  }

  function escapeHtml(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function escapeAttr(s) { return escapeHtml(s); }

  function openDrawer() {
    buildDrawer();
    renderDrawer();
    requestAnimationFrame(function () {
      els.overlay.classList.add('open');
      els.drawer.classList.add('open');
    });
    document.body.style.overflow = 'hidden';
  }
  function closeDrawer() {
    if (!els.drawer) return;
    els.overlay.classList.remove('open');
    els.drawer.classList.remove('open');
    document.body.style.overflow = '';
  }

  /* ---------- liga os botões "sacola" do header ---------- */
  function wireButtons() {
    document.querySelectorAll('[data-cart-open]').forEach(function (el) {
      el.addEventListener('click', function (e) { e.preventDefault(); openDrawer(); });
    });
    document.querySelectorAll('.icon-btn').forEach(function (el) {
      if (el.querySelector('.bag-count')) el.addEventListener('click', function (e) { e.preventDefault(); openDrawer(); });
    });
    document.querySelectorAll('[data-add-to-cart]').forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        var card = el.closest('[data-product]') || el.closest('.card');
        if (!card) return;
        var sizeSel = card.querySelector('[data-size-select]');
        add({
          sku: card.getAttribute('data-sku') || null,
          nome: card.getAttribute('data-nome') || card.querySelector('h3')?.textContent?.trim() || 'Produto',
          preco: card.getAttribute('data-preco'),
          tamanho: sizeSel ? sizeSel.value : (card.getAttribute('data-tamanho') || null),
          qty: 1,
        });
      });
    });
  }

  /* ---------- injeta "Adicionar à sacola" nos cards de produto existentes
     (lê nome/preço direto do texto já visível no card — não precisa marcar
     cada card manualmente com data-attributes) ---------- */
  function autoWireCards() {
    document.querySelectorAll('.card').forEach(function (card) {
      if (card.querySelector('[data-add-to-cart]') || card.hasAttribute('data-no-cart')) return;
      var media = card.querySelector('.card-media');
      var h3 = card.querySelector('.card-body h3');
      var priceEl = card.querySelector('.card-price .now');
      if (!media || !h3 || !priceEl) return;
      var preco = parseFloat(priceEl.textContent.replace(/[^\d,]/g, '').replace(',', '.'));
      if (!isFinite(preco)) return;

      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'card-wish';
      btn.style.right = card.querySelector('.card-wish') ? '56px' : '12px';
      btn.setAttribute('data-add-to-cart', '');
      btn.setAttribute('aria-label', 'Adicionar à sacola');
      btn.setAttribute('data-nome', h3.textContent.trim());
      btn.setAttribute('data-preco', String(preco));
      btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 8h12l-1 12H7L6 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/><path d="M9 12v0M15 12v0"/></svg>';
      btn.style.opacity = '1';
      btn.style.transform = 'none';
      media.appendChild(btn);

      btn.addEventListener('click', function (e) {
        e.preventDefault();
        add({ sku: null, nome: h3.textContent.trim(), preco: preco, tamanho: null, qty: 1 });
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    updateBadges();
    wireButtons();
    autoWireCards();
  });

  window.JCCart = { add: add, remove: remove, setQty: setQty, getItems: readCart, getTotal: total, getCount: count, clear: clear, open: openDrawer, close: closeDrawer, fmtBRL: fmtBRL };
})();
