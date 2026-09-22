import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const FB_CFG = {
  apiKey: "COLE_AQUI_SUA_API_KEY_DO_FIREBASE",
  authDomain: "jeh-correa-moda.firebaseapp.com",
  projectId: "jeh-correa-moda",
  storageBucket: "jeh-correa-moda.firebasestorage.app",
  messagingSenderId: "COLE_AQUI_SEU_MESSAGING_SENDER_ID",
  appId: "COLE_AQUI_SEU_APP_ID"
};
const app = getApps().length ? getApps()[0] : initializeApp(FB_CFG);
const db  = getFirestore(app);

const DEFAULT_FAIXA = ['Peças Exclusivas', 'Envio para Todo Brasil', 'Troca Fácil em 30 Dias', 'Até 10x Sem Juros ou 5% de Desconto no Pix'];

function formatPhone(raw) {
  const digits = String(raw || '').replace(/\D/g, '');
  const local = digits.startsWith('55') ? digits.slice(2) : digits;
  if (local.length === 11) return `(${local.slice(0, 2)}) ${local.slice(2, 7)}-${local.slice(7)}`;
  if (local.length === 10) return `(${local.slice(0, 2)}) ${local.slice(2, 6)}-${local.slice(6)}`;
  return raw;
}

/* Aplica os dados de configuração em qualquer elemento marcado com data-cfg="..." */
window.applySiteConfig = function applySiteConfig(d) {
  window.SITE_CONFIG = d;
  const g = d.geral || {};
  const r = d.rodape || {};
  const wa = g.whatsapp || '5500000000000';

  document.querySelectorAll('[data-cfg="whatsapp-float"]').forEach(el => {
    const msg = el.getAttribute('data-cfg-msg') || 'Olá! Gostaria de mais informações.';
    el.href = `https://wa.me/${wa}?text=${encodeURIComponent(msg)}`;
  });
  document.querySelectorAll('[data-cfg="whatsapp-link"]').forEach(el => { el.href = `https://wa.me/${wa}`; });

  if (g.instagramUrl) document.querySelectorAll('[data-cfg="social-ig"]').forEach(el => { el.href = g.instagramUrl; });
  if (g.facebookUrl)  document.querySelectorAll('[data-cfg="social-fb"]').forEach(el => { el.href = g.facebookUrl; });
  if (g.tiktokUrl)    document.querySelectorAll('[data-cfg="social-tt"]').forEach(el => { el.href = g.tiktokUrl; });

  if (g.whatsapp) {
    const phoneFmt = formatPhone(g.whatsapp);
    document.querySelectorAll('[data-cfg="footer-phone"]').forEach(el => { el.textContent = phoneFmt; });
  }
  if (g.email)   document.querySelectorAll('[data-cfg="footer-email"]').forEach(el => { el.textContent = g.email; });
  if (g.horario) document.querySelectorAll('[data-cfg="footer-hours"]').forEach(el => { el.innerHTML = g.horario.replace(/\n/g, '<br>'); });
  if (r.blurb)     document.querySelectorAll('[data-cfg="footer-blurb"]').forEach(el => { el.textContent = r.blurb; });
  if (r.copyright) document.querySelectorAll('[data-cfg="footer-copyright"]').forEach(el => { el.textContent = r.copyright; });

  /* Página Sobre (Nossa História) */
  const s = d.sobre;
  if (s) {
    const setTxt = (id, val) => { const el = document.getElementById(id); if (el && val) el.textContent = val; };
    setTxt('sobre-hero-tag', s.heroTag); setTxt('sobre-hero-t1', s.heroTitulo1);
    setTxt('sobre-hero-t2', s.heroTitulo2); setTxt('sobre-hero-sub', s.heroSub);
    [1, 2, 3, 4].forEach(n => {
      setTxt('sobre-stat' + n + '-num', s['stat' + n + 'Num']);
      setTxt('sobre-stat' + n + '-label', s['stat' + n + 'Label']);
    });
    setTxt('sobre-hist-tag', s.histTag); setTxt('sobre-hist-t1', s.histTitulo1); setTxt('sobre-hist-t2', s.histTitulo2);
    if (s.histTexto) {
      const box = document.getElementById('sobre-hist-texto');
      if (box) box.innerHTML = s.histTexto.split(/\n\s*\n/).map(p => {
        const txt = p.trim().replace(/\n/g, ' ').replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        return `<p>${txt}</p>`;
      }).join('');
    }
    if (s.histImg) {
      const img = document.getElementById('sobre-hist-img');
      if (img) {
        img.src = s.histImg;
        img.style.objectPosition = `${s.histImgPosX ?? 50}% ${s.histImgPosY ?? 50}%`;
        img.style.transform = `scale(${(s.histImgZoom ?? 100) / 100})`;
      }
    }
    setTxt('sobre-hist-quote', s.quote); setTxt('sobre-hist-quote-autor', s.quoteAutor);
    setTxt('sobre-hist-sig-nome', s.sigNome); setTxt('sobre-hist-sig-cargo', s.sigCargo);
    if (s.sigNome) setTxt('sobre-hist-sig-avatar', s.sigNome.trim().charAt(0).toUpperCase());
    setTxt('sobre-val-tag', s.valTag); setTxt('sobre-val-t1', s.valTitulo1); setTxt('sobre-val-t2', s.valTitulo2);
    setTxt('sobre-proc-tag', s.procTag); setTxt('sobre-proc-t1', s.procTitulo1); setTxt('sobre-proc-t2', s.procTitulo2);
    setTxt('sobre-dif-tag', s.difTag); setTxt('sobre-dif-t1', s.difTitulo1); setTxt('sobre-dif-t2', s.difTitulo2);
    [1, 2, 3, 4, 5, 6].forEach(n => {
      setTxt('sobre-val' + n + '-icon', s['val' + n + 'Icon']);
      setTxt('sobre-val' + n + '-titulo', s['val' + n + 'Titulo']);
      setTxt('sobre-val' + n + '-desc', s['val' + n + 'Desc']);
    });
    [1, 2, 3, 4].forEach(n => {
      setTxt('sobre-proc' + n + '-icon', s['proc' + n + 'Icon']);
      setTxt('sobre-proc' + n + '-titulo', s['proc' + n + 'Titulo']);
      setTxt('sobre-proc' + n + '-desc', s['proc' + n + 'Desc']);
      setTxt('sobre-dif' + n + '-icon', s['dif' + n + 'Icon']);
      setTxt('sobre-dif' + n + '-titulo', s['dif' + n + 'Titulo']);
      setTxt('sobre-dif' + n + '-desc', s['dif' + n + 'Desc']);
    });
    setTxt('sobre-cta-tag', s.ctaTag); setTxt('sobre-cta-t1', s.ctaTitulo1);
    setTxt('sobre-cta-t2', s.ctaTitulo2); setTxt('sobre-cta-texto', s.ctaTexto);
  }

  /* Faixa de avisos (ticker) — páginas que já têm sua própria lógica (ex: index.html)
     controlam window.__SITE_CONFIG_MANUAL e cuidam disso sozinhas. */
  if (!window.__SITE_CONFIG_MANUAL) {
    const track = document.getElementById('faixa-track');
    const bar   = document.getElementById('faixa-bar');
    if (track && bar) {
      const base = d.faixa?.length ? d.faixa : DEFAULT_FAIXA;
      const itens = g.aviso ? [g.aviso, ...base] : base;
      const dup = [...itens, ...itens];
      track.innerHTML = dup.map(txt => `<span class="faixa-item">${txt}</span>`).join('');
      bar.style.display = 'block';
      track.style.animationDuration = Math.max(18, itens.length * 4) + 's';
    }
  }
};

window.loadSiteConfig = async function loadSiteConfig() {
  try {
    const snap = await getDoc(doc(db, 'configuracoes', 'loja'));
    const d = snap.exists() ? snap.data() : {};
    window.applySiteConfig(d);
    return d;
  } catch (e) {
    console.warn('site-config:', e);
    return {};
  }
};

if (!window.__SITE_CONFIG_MANUAL) {
  window.loadSiteConfig();

  /* Preview ao vivo (painel admin) — páginas com lógica própria (ex:
     index.html) já cuidam disso sozinhas via window.__SITE_CONFIG_MANUAL. */
  window.addEventListener('message', (e) => {
    if (e.origin !== window.location.origin) return;
    if (e.data?.__previewDraft) window.applySiteConfig(e.data.config);
    if (e.data?.__scrollTo) {
      const el = document.querySelector(e.data.__scrollTo);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
}
