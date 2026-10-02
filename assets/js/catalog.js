// ============================================================
// Jeh Corrêa — vitrine dinâmica (Firestore)
// Carrega produtos reais cadastrados no admin. Se o Firebase ainda não
// estiver configurado (chaves placeholder) ou não houver produtos que
// batam com o filtro pedido, mantém a grade de demonstração que já
// está no HTML — nunca deixa a seção em branco.
// ============================================================
import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "COLE_AQUI_SUA_API_KEY_DO_FIREBASE",
  authDomain: "jeh-correa-moda.firebaseapp.com",
  projectId: "jeh-correa-moda",
  storageBucket: "jeh-correa-moda.firebasestorage.app",
  messagingSenderId: "COLE_AQUI_SEU_MESSAGING_SENDER_ID",
  appId: "COLE_AQUI_SEU_APP_ID"
};

function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), ms)),
  ]);
}

function slugify(s) {
  return String(s || '')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-').replace(/(^-|-$)/g, '').toLowerCase();
}

function catSlug(categoria) { return slugify(categoria); }

function brl(v) { return Number(v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }); }

function cardHtml(p) {
  const nome = p.nome || '';
  const preco = Number(p.preco) || 0;
  const avista = preco * 0.97;
  const parcelas = Math.min(10, Math.max(1, Math.round(preco / 60) || 1));
  const parcelaValor = preco / parcelas;
  const fotos = p.fotos || [];
  const foto = fotos[0] || '';
  const foto2 = fotos[1] || foto;
  const slug = p.slug || p.id;
  const cores = p.cores || [];
  const tamanhos = p.tamanhos || [];
  const estoqueEsgotado = !!p.esgotado;

  const swatches = cores.map((c, i) =>
    `<button type="button" class="swatch${i === 0 ? ' is-active' : ''}" style="--sw:${c.hex}" data-color="${c.nome}" aria-label="${c.nome}" aria-pressed="${i === 0 ? 'true' : 'false'}"></button>`
  ).join('');
  const sizes = tamanhos.map(t =>
    `<button type="button" class="size-chip" data-size="${t}">${t}</button>`
  ).join('');

  return (
    `<article class="card" data-category="${catSlug(p.categoria)}">` +
    `<a class="card-media" href="produto.html?slug=${slug}" aria-label="Ver ${nome}">` +
    (p.badge ? `<span class="badge">${p.badge}</span>` : '') +
    (cores.length ? '<span class="badge-colors">+ Cores</span>' : '') +
    `<img class="img-primary" src="${foto}" alt="${nome}" loading="lazy">` +
    `<img class="img-hover" src="${foto2}" alt="${nome} (outro ângulo)" loading="lazy">` +
    '</a>' +
    '<div class="card-body">' +
    `<h3><a href="produto.html?slug=${slug}">${nome}</a></h3>` +
    `<div class="card-price"><span class="now">${brl(preco)}</span></div>` +
    `<div class="card-avista">${brl(avista)} no Pix</div>` +
    `<div class="card-parcel">ou ${parcelas}x de ${brl(parcelaValor)}</div>` +
    (estoqueEsgotado
      ? '<button type="button" class="card-buy" disabled style="opacity:.5;cursor:not-allowed;">Esgotado</button>'
      : '<button type="button" class="card-buy" data-toggle-options>Comprar</button>') +
    '<div class="card-options">' +
    (cores.length ? `<div class="card-colors"><span class="field-label">Cores</span><div class="swatch-row" role="group" aria-label="Cores disponíveis para ${nome}">${swatches}</div></div>` : '') +
    (tamanhos.length ? `<div class="card-sizes"><span class="field-label">Tamanho</span><div class="size-row" role="group" aria-label="Tamanhos disponíveis para ${nome}">${sizes}</div></div>` : '') +
    '<button type="button" class="card-confirm">Adicionar à sacola</button>' +
    '</div>' +
    '</div>' +
    '</article>'
  );
}

/**
 * Carrega produtos reais do Firestore num grid existente.
 * @param {string} gridId - id do elemento .grid a preencher
 * @param {function} [filterFn] - filtro adicional sobre os produtos ativos
 * @param {function} [sortFn] - comparador de ordenação
 * @param {number} [limit] - máximo de produtos
 * @returns {Promise<boolean>} true se substituiu a vitrine estática por dados reais
 */
export async function loadCatalog(gridId, { filterFn, sortFn, limit } = {}) {
  const grid = document.getElementById(gridId);
  if (!grid) return false;

  try {
    const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const snap = await withTimeout(getDocs(collection(db, 'produtos')), 6000);

    let produtos = snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(p => p.status === 'ativo');
    if (filterFn) produtos = produtos.filter(filterFn);
    if (sortFn) produtos.sort(sortFn);
    if (limit) produtos = produtos.slice(0, limit);

    if (!produtos.length) return false; // mantém a vitrine de demonstração do HTML

    grid.innerHTML = produtos.map(cardHtml).join('');
    if (window.JCCart && window.JCCart.wireProductCards) window.JCCart.wireProductCards();
    return true;
  } catch (e) {
    console.warn('Vitrine dinâmica indisponível agora (' + e.message + ') — mantendo a vitrine de demonstração.');
    return false;
  }
}

window.JCCatalog = { loadCatalog };
