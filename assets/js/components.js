/* ============================================================
   components.js — shared header & footer injection
   Runs synchronously (placed at end of <body>) BEFORE i18n,
   so harvested German defaults & translations apply to it.
   ============================================================ */
(function () {
  "use strict";

  var IG = "https://www.instagram.com/matchamadness_cgn";
  var MAIL = "matchamadness.cgn@gmail.com";

  var leaf =
    '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true" width="26" height="26">' +
    '<path d="M20 4C20 4 6 4 5 14c-.6 6 4 6 4 6 0-7 4-11 9-13" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path d="M9 20c0-4 2-8 6-10" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>';

  var nav = [
    ["index.html",          "nav.home"],
    ["anlaesse.html",       "nav.occasions"],
    ["ablauf.html",         "nav.process"],
    ["pakete-preise.html",  "nav.pricing"],
    ["galerie.html",        "nav.gallery"],
    ["ueber-uns.html",      "nav.about"],
    ["blog.html",           "nav.blog"],
    ["kontakt.html",        "nav.contact"]
  ];

  var navLinks = nav.map(function (n) {
    return '<a class="nav-link" href="' + n[0] + '" data-i18n="' + n[1] + '"></a>';
  }).join("");

  var header =
    '<header class="site-header"><div class="container header-inner">' +
      '<a class="brand" href="index.html" aria-label="Matcha Madness">' +
        '<span class="logo-lockup"><span class="ll-1">MATCHA</span><span class="ll-2">MADNESS<span class="ll-jp">抹茶</span></span></span>' +
      '</a>' +
      '<nav class="main-nav">' + navLinks +
        '<a class="btn btn--primary" href="buchen.html" data-i18n="nav.book" style="margin-inline-start:.5rem"></a>' +
      '</nav>' +
      '<div class="header-actions">' +
        '<div class="lang"><button class="lang-toggle" aria-label="Language">' +
          '<span class="flag">🇩🇪</span><span class="lang-label">DE</span>' +
          '<svg class="chev" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
        '</button><div class="lang-menu"></div></div>' +
        '<button class="hamburger" aria-label="Menu"><span></span><span></span><span></span></button>' +
      '</div>' +
    '</div></header>';

  var footer =
    '<footer class="site-footer"><div class="container">' +
      '<div class="footer-top">' +
        '<div class="footer-brand">' +
          '<div class="brand" style="margin-bottom:1rem"><span class="logo-lockup"><span class="ll-1">MATCHA</span><span class="ll-2">MADNESS<span class="ll-jp">抹茶</span></span></span></div>' +
          '<p data-i18n="footer.tagline"></p>' +
          '<div class="social">' +
            '<a href="' + IG + '" target="_blank" rel="noopener" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" stroke-width="1.7"/><circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.7"/><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor"/></svg></a>' +
            '<a href="mailto:' + MAIL + '" aria-label="E-Mail"><svg viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2.5" stroke="currentColor" stroke-width="1.7"/><path d="M4 7l8 6 8-6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg></a>' +
          '</div>' +
        '</div>' +
        '<div class="footer-col"><h4 data-i18n="footer.discover"></h4>' +
          '<a href="anlaesse.html" data-i18n="nav.occasions"></a>' +
          '<a href="ablauf.html" data-i18n="nav.process"></a>' +
          '<a href="galerie.html" data-i18n="nav.gallery"></a>' +
          '<a href="testimonials.html" data-i18n="nav.testimonials"></a>' +
          '<a href="ueber-uns.html" data-i18n="nav.about"></a>' +
        '</div>' +
        '<div class="footer-col"><h4 data-i18n="footer.service"></h4>' +
          '<a href="pakete-preise.html" data-i18n="nav.pricing"></a>' +
          '<a href="buchen.html" data-i18n="nav.book"></a>' +
          '<a href="faq.html" data-i18n="nav.faq"></a>' +
          '<a href="kontakt.html" data-i18n="nav.contact"></a>' +
          '<a href="blog.html" data-i18n="nav.blog"></a>' +
        '</div>' +
        '<div class="footer-col"><h4 data-i18n="footer.contact"></h4>' +
          '<p>Aloeweg 44<br>51109 Köln</p>' +
          '<a href="mailto:' + MAIL + '">' + MAIL + '</a>' +
          '<a href="' + IG + '" target="_blank" rel="noopener">@matchamadness_cgn</a>' +
          '<p data-i18n="footer.area"></p>' +
        '</div>' +
      '</div>' +
      '<div class="footer-bottom">' +
        '<span>© <span data-year></span> Matcha Madness · <span data-i18n="footer.rights"></span></span>' +
        '<span style="display:flex;gap:1.2rem;flex-wrap:wrap">' +
          '<a href="impressum.html" data-i18n="nav.imprint"></a>' +
          '<a href="datenschutz.html" data-i18n="nav.privacy"></a>' +
        '</span>' +
        '<span class="footer-credit" data-i18n-html="footer.credit"></span>' +
      '</div>' +
    '</div></footer>';

  var h = document.getElementById("site-header");
  if (h) h.outerHTML = header;
  var f = document.getElementById("site-footer");
  if (f) f.outerHTML = footer;
})();
