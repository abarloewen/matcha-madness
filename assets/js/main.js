/* ============================================================
   main.js — interactions
   header scroll · mobile menu · scroll reveal · FAQ · lightbox
   ============================================================ */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var header = document.querySelector(".site-header");
    var body = document.body;

    /* ---- header scroll state ---- */
    function onScroll() {
      if (!header) return;
      if (window.scrollY > 30) header.classList.add("scrolled");
      else header.classList.remove("scrolled");
    }
    // pages without a full hero start "scrolled" (solid header)
    if (header && !document.querySelector(".hero, .page-hero")) header.classList.add("always-solid", "scrolled");
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    /* ---- mobile menu ---- */
    var burger = document.querySelector(".hamburger");
    if (burger) {
      burger.addEventListener("click", function () { body.classList.toggle("menu-open"); });
      document.querySelectorAll(".main-nav .nav-link").forEach(function (a) {
        a.addEventListener("click", function () { body.classList.remove("menu-open"); });
      });
    }

    /* ---- active nav link ---- */
    var path = location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".main-nav .nav-link").forEach(function (a) {
      var href = (a.getAttribute("href") || "").split("/").pop();
      if (href === path) a.classList.add("active");
    });

    /* ---- scroll reveal ---- */
    var reveals = document.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window && reveals.length) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
      reveals.forEach(function (r) { io.observe(r); });
    } else {
      reveals.forEach(function (r) { r.classList.add("in"); });
    }

    /* ---- FAQ accordion ---- */
    document.querySelectorAll(".faq-item").forEach(function (item) {
      var q = item.querySelector(".faq-q");
      var a = item.querySelector(".faq-a");
      if (!q || !a) return;
      q.addEventListener("click", function () {
        var open = item.classList.contains("open");
        // close siblings in same group
        var group = item.closest(".faq");
        if (group) group.querySelectorAll(".faq-item.open").forEach(function (s) {
          if (s !== item) { s.classList.remove("open"); s.querySelector(".faq-a").style.maxHeight = null; }
        });
        item.classList.toggle("open", !open);
        a.style.maxHeight = !open ? a.scrollHeight + "px" : null;
      });
    });
    // recompute open faq heights on language change (text length differs)
    document.addEventListener("langchange", function () {
      document.querySelectorAll(".faq-item.open .faq-a").forEach(function (a) {
        a.style.maxHeight = a.scrollHeight + "px";
      });
    });

    /* ---- gallery lightbox ---- */
    var figs = Array.prototype.slice.call(document.querySelectorAll(".gallery figure img"));
    if (figs.length) {
      var lb = document.createElement("div");
      lb.className = "lightbox";
      lb.innerHTML =
        '<button class="lb-close" aria-label="Close">&times;</button>' +
        '<button class="lb-nav lb-prev" aria-label="Previous">&#8249;</button>' +
        '<img alt="">' +
        '<button class="lb-nav lb-next" aria-label="Next">&#8250;</button>';
      document.body.appendChild(lb);
      var lbImg = lb.querySelector("img");
      var idx = 0;
      function show(i) { idx = (i + figs.length) % figs.length; lbImg.src = figs[idx].src; }
      figs.forEach(function (im, i) {
        im.addEventListener("click", function () { show(i); lb.classList.add("open"); });
      });
      lb.querySelector(".lb-close").addEventListener("click", function () { lb.classList.remove("open"); });
      lb.querySelector(".lb-prev").addEventListener("click", function (e) { e.stopPropagation(); show(idx - 1); });
      lb.querySelector(".lb-next").addEventListener("click", function (e) { e.stopPropagation(); show(idx + 1); });
      lb.addEventListener("click", function (e) { if (e.target === lb) lb.classList.remove("open"); });
      document.addEventListener("keydown", function (e) {
        if (!lb.classList.contains("open")) return;
        if (e.key === "Escape") lb.classList.remove("open");
        if (e.key === "ArrowRight") show(idx + 1);
        if (e.key === "ArrowLeft") show(idx - 1);
      });
    }

    /* ---- footer year ---- */
    document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
  });
})();
