/* ============================================================
   i18n engine — Matcha Madness
   7 languages · RTL support · localStorage persistence
   Depends on window.I18N (translations.js)
   ============================================================ */
(function () {
  "use strict";

  // language metadata: code, native name, flag, direction
  window.LANGS = [
    { code: "de", name: "Deutsch",    flag: "🇩🇪", dir: "ltr" },
    { code: "en", name: "English",    flag: "🇬🇧", dir: "ltr" },
    { code: "ar", name: "العربية",     flag: "🇸🇦", dir: "rtl" },
    { code: "tr", name: "Türkçe",     flag: "🇹🇷", dir: "ltr" },
    { code: "bs", name: "Bosanski",   flag: "🇧🇦", dir: "ltr" },
    { code: "sq", name: "Shqip",      flag: "🇦🇱", dir: "ltr" },
    { code: "fr", name: "Français",   flag: "🇫🇷", dir: "ltr" }
  ];

  var STORE_KEY = "mm_lang";
  var DEFAULT = "de";

  function supported(code) {
    return window.LANGS.some(function (l) { return l.code === code; });
  }

  function getLang() {
    var saved;
    try { saved = localStorage.getItem(STORE_KEY); } catch (e) {}
    if (saved && supported(saved)) return saved;
    var nav = (navigator.language || "de").slice(0, 2).toLowerCase();
    if (supported(nav)) return nav;
    return DEFAULT;
  }

  function meta(code) {
    return window.LANGS.find(function (l) { return l.code === code; }) || window.LANGS[0];
  }

  // resolve a key with fallback chain: lang -> de -> en -> key
  function t(lang, key) {
    var dict = window.I18N || {};
    if (dict[lang] && dict[lang][key] != null) return dict[lang][key];
    if (dict.de && dict.de[key] != null) return dict.de[key];
    if (dict.en && dict.en[key] != null) return dict.en[key];
    return null;
  }

  // Harvest German defaults straight from the DOM so the markup stays the
  // single source of truth for German (and SEO-friendly without JS).
  function harvestDefaults() {
    window.I18N = window.I18N || {};
    var de = window.I18N.de = window.I18N.de || {};
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var k = el.getAttribute("data-i18n"); if (de[k] == null) de[k] = el.textContent.trim();
    });
    document.querySelectorAll("[data-i18n-html]").forEach(function (el) {
      var k = el.getAttribute("data-i18n-html"); if (de[k] == null) de[k] = el.innerHTML.trim();
    });
    document.querySelectorAll("[data-i18n-ph]").forEach(function (el) {
      var k = el.getAttribute("data-i18n-ph"); if (de[k] == null) de[k] = el.getAttribute("placeholder") || "";
    });
    document.querySelectorAll("[data-i18n-attr]").forEach(function (el) {
      el.getAttribute("data-i18n-attr").split(",").forEach(function (pair) {
        var p = pair.split(":"); if (p.length === 2) { var k = p[1].trim(); if (de[k] == null) de[k] = el.getAttribute(p[0].trim()) || ""; }
      });
    });
    var b = document.body, tk = b && b.getAttribute("data-title-key");
    if (tk && de[tk] == null) de[tk] = (document.title || "").replace(/ · Matcha Madness$/, "");
  }

  function applyLang(lang) {
    if (!supported(lang)) lang = DEFAULT;
    var m = meta(lang);
    var html = document.documentElement;
    html.setAttribute("lang", lang);
    html.setAttribute("dir", m.dir);

    // text content
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var val = t(lang, el.getAttribute("data-i18n"));
      if (val != null) el.textContent = val;
    });
    // innerHTML (for copy needing <br>, <em>, <strong>)
    document.querySelectorAll("[data-i18n-html]").forEach(function (el) {
      var val = t(lang, el.getAttribute("data-i18n-html"));
      if (val != null) el.innerHTML = val;
    });
    // placeholders
    document.querySelectorAll("[data-i18n-ph]").forEach(function (el) {
      var val = t(lang, el.getAttribute("data-i18n-ph"));
      if (val != null) el.setAttribute("placeholder", val);
    });
    // aria-labels / generic attributes: data-i18n-attr="attr:key,attr2:key2"
    document.querySelectorAll("[data-i18n-attr]").forEach(function (el) {
      el.getAttribute("data-i18n-attr").split(",").forEach(function (pair) {
        var p = pair.split(":");
        if (p.length === 2) {
          var val = t(lang, p[1].trim());
          if (val != null) el.setAttribute(p[0].trim(), val);
        }
      });
    });
    // <title> + meta description per page (key from body data attrs)
    var b = document.body;
    if (b.getAttribute("data-title-key")) {
      var tv = t(lang, b.getAttribute("data-title-key"));
      if (tv != null) document.title = tv + " · Matcha Madness";
    }

    // update switcher UI
    document.querySelectorAll(".lang-toggle .flag").forEach(function (f) { f.textContent = m.flag; });
    document.querySelectorAll(".lang-toggle .lang-label").forEach(function (f) { f.textContent = lang.toUpperCase(); });
    document.querySelectorAll(".lang-menu button").forEach(function (btn) {
      btn.classList.toggle("active", btn.getAttribute("data-lang") === lang);
    });

    try { localStorage.setItem(STORE_KEY, lang); } catch (e) {}

    // let other scripts know (booking wizard re-renders)
    document.dispatchEvent(new CustomEvent("langchange", { detail: { lang: lang } }));
  }

  function buildSwitchers() {
    document.querySelectorAll(".lang").forEach(function (wrap) {
      var menu = wrap.querySelector(".lang-menu");
      if (!menu) return;
      menu.innerHTML = "";
      window.LANGS.forEach(function (l) {
        var btn = document.createElement("button");
        btn.setAttribute("data-lang", l.code);
        btn.innerHTML = '<span class="flag">' + l.flag + '</span><span>' + l.name + "</span>";
        btn.addEventListener("click", function () {
          applyLang(l.code);
          wrap.classList.remove("open");
        });
        menu.appendChild(btn);
      });
      var toggle = wrap.querySelector(".lang-toggle");
      if (toggle) {
        toggle.addEventListener("click", function (e) {
          e.stopPropagation();
          document.querySelectorAll(".lang.open").forEach(function (o) { if (o !== wrap) o.classList.remove("open"); });
          wrap.classList.toggle("open");
        });
      }
    });
    document.addEventListener("click", function () {
      document.querySelectorAll(".lang.open").forEach(function (o) { o.classList.remove("open"); });
    });
  }

  window.MM_I18N = { applyLang: applyLang, getLang: getLang, t: t, meta: meta };

  document.addEventListener("DOMContentLoaded", function () {
    harvestDefaults();
    buildSwitchers();
    applyLang(getLang());
  });
})();
