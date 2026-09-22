/* ============================================================
   Jeh Corrêa Moda Feminina — interações
   Lenis (smooth scroll) + GSAP (hero) + IntersectionObserver (reveals)
   Todas as libs carregadas via CDN gratuito (cdnjs / jsdelivr)
   ============================================================ */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- smooth scroll (Lenis) ---------- */
  var lenis = null;
  if (!reduceMotion && window.Lenis) {
    lenis = new window.Lenis({ duration: 1.1, smoothWheel: true });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  /* ---------- GSAP hero entrance (apenas em páginas com hero) ---------- */
  var heroEls = document.querySelectorAll("[data-hero-in]");
  if (window.gsap && heroEls.length) {
    var tl = window.gsap.timeline({ defaults: { ease: "power3.out", duration: 1 } });
    tl.from(heroEls, {
      y: 34,
      opacity: 0,
      stagger: 0.14,
      duration: 0.9
    });
  }

  /* ---------- header on scroll ---------- */
  var header = document.querySelector("[data-header]");
  var ring = document.querySelector("[data-progress-ring]");
  var ringBar = ring ? ring.querySelector(".bar") : null;
  var RADIUS = 24;
  var CIRC = 2 * Math.PI * RADIUS;
  if (ringBar) {
    ringBar.style.strokeDasharray = CIRC.toFixed(1);
    ringBar.style.strokeDashoffset = CIRC.toFixed(1);
  }

  function onScroll() {
    var y = window.scrollY || 0;
    if (header) header.classList.toggle("is-scrolled", y > 40);

    var max = document.documentElement.scrollHeight - window.innerHeight;
    var pct = max > 0 ? Math.min(y / max, 1) : 0;
    if (ring) ring.classList.toggle("is-active", y > 320);
    if (ringBar) ringBar.style.strokeDashoffset = (CIRC * (1 - pct)).toFixed(1);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (ring) {
    ring.addEventListener("click", function () {
      if (lenis) lenis.scrollTo(0);
      else window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
  }

  /* ---------- reveal on scroll ---------- */
  var revealEls = document.querySelectorAll(".reveal, .reveal-scale");
  if (reduceMotion) {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  } else if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- animated counters ---------- */
  var counters = document.querySelectorAll("[data-count]");
  if (counters.length && "IntersectionObserver" in window) {
    var counted = new WeakSet();
    var cio = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && !counted.has(entry.target)) {
            counted.add(entry.target);
            animateCount(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach(function (el) { cio.observe(el); });
  }
  function animateCount(el) {
    var target = parseInt(el.getAttribute("data-count"), 10) || 0;
    if (reduceMotion) { el.textContent = target.toLocaleString("pt-BR"); return; }
    var start = 0;
    var duration = 1400;
    var startTime = null;
    function step(ts) {
      if (!startTime) startTime = ts;
      var progress = Math.min((ts - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var value = Math.floor(start + (target - start) * eased);
      el.textContent = value.toLocaleString("pt-BR");
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ---------- mobile menu ---------- */
  var menuToggle = document.querySelector("[data-menu-toggle]");
  var mobileNav = document.querySelector("[data-mobile-nav]");
  if (menuToggle && mobileNav) {
    menuToggle.addEventListener("click", function () {
      var open = mobileNav.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  /* ---------- product filters ---------- */
  var pills = document.querySelectorAll("[data-filter]");
  var cards = document.querySelectorAll("[data-category]");
  if (pills.length && cards.length) {
    pills.forEach(function (pill) {
      pill.addEventListener("click", function () {
        pills.forEach(function (p) { p.classList.remove("active"); });
        pill.classList.add("active");
        var filter = pill.getAttribute("data-filter");
        cards.forEach(function (card) {
          var show = filter === "todos" || card.getAttribute("data-category") === filter;
          card.style.display = show ? "" : "none";
        });
      });
    });
  }

  /* ---------- newsletter (fake submit) ---------- */
  var nlForm = document.querySelector("[data-newsletter]");
  if (nlForm) {
    nlForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var success = nlForm.parentElement.querySelector(".nl-success");
      if (success) success.classList.add("show");
      nlForm.reset();
    });
  }

  /* ---------- contact form (fake submit) ---------- */
  var contactForm = document.querySelector("[data-contact-form]");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var success = document.querySelector("[data-contact-success]");
      if (success) success.classList.add("show");
      contactForm.reset();
    });
  }
})();
