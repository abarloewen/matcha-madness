/* ============================================================
   Matcha Madness — Cookie consent + Google Consent Mode v2
   • GDPR-friendly: analytics denied by default
   • Google Analytics loads ONLY after explicit consent
   • Banner text in 7 languages (DE/EN/AR/TR/BS/SQ/FR)
   • Re-openable via any element with [data-cookie-settings]
   ============================================================ */
(function () {
  "use strict";

  /* --- CONFIG ------------------------------------------------ */
  var GA_ID = "G-EFWMFVD2KX";                 // GA4 Measurement-ID · Property "Matcha Madness"
  var STORE = "mm_consent";                   // "granted" | "denied"
  var LANG_STORE = "mm_lang";                 // shared with i18n engine

  /* --- Consent Mode v2 defaults (run immediately) ----------- */
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;
  gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied",
    functionality_storage: "granted",
    security_storage: "granted",
    wait_for_update: 500
  });

  /* --- Translations ----------------------------------------- */
  var T = {
    de: { body: "Wir verwenden Cookies, um unsere Website zu verbessern und die Nutzung zu analysieren. Du entscheidest, was wir verwenden dürfen.", accept: "Akzeptieren", decline: "Nur notwendige", more: "Mehr erfahren", aria: "Cookie-Hinweis" },
    en: { body: "We use cookies to improve our website and analyse how it is used. You decide what we may use.", accept: "Accept", decline: "Only essential", more: "Learn more", aria: "Cookie notice" },
    ar: { body: "نستخدم ملفات تعريف الارتباط لتحسين موقعنا وتحليل استخدامه. أنت تقرّر ما يُسمح لنا باستخدامه.", accept: "قبول", decline: "الضرورية فقط", more: "اعرف المزيد", aria: "إشعار ملفات تعريف الارتباط" },
    tr: { body: "Web sitemizi geliştirmek ve kullanımını analiz etmek için çerezler kullanıyoruz. Neyi kullanabileceğimize sen karar verirsin.", accept: "Kabul et", decline: "Yalnızca gerekli", more: "Daha fazla bilgi", aria: "Çerez bildirimi" },
    bs: { body: "Koristimo kolačiće kako bismo poboljšali našu web stranicu i analizirali njezino korištenje. Vi odlučujete što smijemo koristiti.", accept: "Prihvati", decline: "Samo neophodni", more: "Saznaj više", aria: "Obavijest o kolačićima" },
    sq: { body: "Përdorim cookie për të përmirësuar faqen tonë dhe për të analizuar përdorimin e saj. Ti vendos çfarë mund të përdorim.", accept: "Pranoj", decline: "Vetëm të nevojshmet", more: "Mëso më shumë", aria: "Njoftim për cookie" },
    fr: { body: "Nous utilisons des cookies pour améliorer notre site et analyser son utilisation. Vous décidez de ce que nous pouvons utiliser.", accept: "Accepter", decline: "Essentiels uniquement", more: "En savoir plus", aria: "Avis relatif aux cookies" }
  };
  var RTL = { ar: true };

  function lang() {
    var l;
    try { l = localStorage.getItem(LANG_STORE); } catch (e) {}
    if (!l && navigator.language) l = navigator.language.slice(0, 2).toLowerCase();
    return T[l] ? l : "de";
  }
  function stored() { try { return localStorage.getItem(STORE); } catch (e) { return null; } }
  function save(v) { try { localStorage.setItem(STORE, v); } catch (e) {} }

  /* --- Load Google Analytics (only on consent) -------------- */
  function loadGA() {
    if (!GA_ID || GA_ID.indexOf("XXXX") !== -1) return;   // no ID yet → skip
    gtag("consent", "update", { analytics_storage: "granted" });
    if (window.__mmGAloaded) return;
    window.__mmGAloaded = true;
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_ID;
    document.head.appendChild(s);
    gtag("js", new Date());
    gtag("config", GA_ID, { anonymize_ip: true });
  }

  /* --- Styles ----------------------------------------------- */
  function injectStyles() {
    if (document.getElementById("mm-consent-css")) return;
    var css = document.createElement("style");
    css.id = "mm-consent-css";
    css.textContent =
      "#mm-consent{position:fixed;z-index:9999;left:50%;transform:translateX(-50%);bottom:1.1rem;width:min(680px,calc(100% - 1.6rem));" +
      "background:var(--espresso,#36302A);color:#F6F3EC;border-radius:16px;box-shadow:0 18px 50px rgba(0,0,0,.34);" +
      "padding:1.15rem 1.25rem;display:flex;gap:1rem 1.2rem;align-items:center;flex-wrap:wrap;" +
      "font-family:inherit;line-height:1.5;opacity:0;translate:0 14px;transition:opacity .4s ease,translate .4s ease}" +
      "#mm-consent.mm-in{opacity:1;translate:0 0}" +
      "#mm-consent p{margin:0;flex:1 1 260px;font-size:.92rem;color:#EFE9DE}" +
      "#mm-consent a{color:#CFE3B8;text-decoration:underline;text-underline-offset:2px;white-space:nowrap}" +
      "#mm-consent .mm-actions{display:flex;gap:.6rem;flex:0 0 auto;flex-wrap:wrap}" +
      "#mm-consent button{font:inherit;font-weight:700;font-size:.9rem;border-radius:999px;padding:.62rem 1.25rem;cursor:pointer;border:1px solid transparent;transition:transform .15s ease,background .2s ease,border-color .2s ease}" +
      "#mm-consent button:active{transform:translateY(1px)}" +
      "#mm-consent .mm-accept{background:#7A8B3C;color:#fff}" +
      "#mm-consent .mm-accept:hover{background:#6b7b34}" +
      "#mm-consent .mm-decline{background:transparent;color:#EFE9DE;border-color:rgba(239,233,222,.4)}" +
      "#mm-consent .mm-decline:hover{border-color:#EFE9DE}" +
      "#mm-consent[dir=rtl]{direction:rtl}" +
      "@media(max-width:560px){#mm-consent{align-items:stretch}#mm-consent .mm-actions{width:100%}#mm-consent .mm-actions button{flex:1 1 0}}";
    document.head.appendChild(css);
  }

  /* --- Banner ----------------------------------------------- */
  function render() {
    var existing = document.getElementById("mm-consent");
    if (existing) existing.remove();
    var L = lang(), tr = T[L] || T.de;
    var el = document.createElement("aside");
    el.id = "mm-consent";
    el.setAttribute("role", "dialog");
    el.setAttribute("aria-label", tr.aria);
    el.setAttribute("aria-live", "polite");
    if (RTL[L]) el.setAttribute("dir", "rtl");
    el.innerHTML =
      '<p>' + tr.body + ' <a href="datenschutz.html">' + tr.more + '</a></p>' +
      '<div class="mm-actions">' +
      '<button type="button" class="mm-decline">' + tr.decline + '</button>' +
      '<button type="button" class="mm-accept">' + tr.accept + '</button>' +
      '</div>';
    document.body.appendChild(el);
    requestAnimationFrame(function () { el.classList.add("mm-in"); });

    el.querySelector(".mm-accept").addEventListener("click", function () {
      save("granted"); loadGA(); dismiss(el);
    });
    el.querySelector(".mm-decline").addEventListener("click", function () {
      save("denied"); dismiss(el);
    });
  }
  function dismiss(el) {
    el.classList.remove("mm-in");
    setTimeout(function () { if (el && el.parentNode) el.remove(); }, 400);
  }

  /* --- Re-render banner text on language change ------------- */
  document.addEventListener("langchange", function () {
    if (document.getElementById("mm-consent")) render();
  });

  /* --- Allow re-opening from a "Cookie settings" link ------- */
  document.addEventListener("click", function (e) {
    var t = e.target.closest && e.target.closest("[data-cookie-settings]");
    if (t) { e.preventDefault(); render(); }
  });

  /* --- Boot ------------------------------------------------- */
  function boot() {
    injectStyles();
    var choice = stored();
    if (choice === "granted") { loadGA(); return; }
    if (choice === "denied") return;
    render();                                  // first visit → ask
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else { boot(); }

  window.MM_CONSENT = { open: render, grant: function () { save("granted"); loadGA(); }, revoke: function () { save("denied"); } };
})();
