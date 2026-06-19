/* ============================================================
   booking.js — multi-step booking wizard (demo / no payment)
   Reads data-attributes from markup; text is translated via i18n.
   ============================================================ */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var wizard = document.querySelector(".wizard");
    if (!wizard) return;

    var steps = Array.prototype.slice.call(wizard.querySelectorAll(".wz-step"));
    var tabs  = Array.prototype.slice.call(wizard.querySelectorAll(".wz-tab"));
    var btnNext = wizard.querySelector("[data-wz-next]");
    var btnBack = wizard.querySelector("[data-wz-back]");
    var estEl = wizard.querySelector(".wz-estimate b");
    var foot = wizard.querySelector(".wizard-foot");
    var successEl = document.querySelector(".wizard-success");
    var form = wizard.querySelector("form") || wizard;

    var cur = 0;
    var state = { pkg: null, pkgPrice: 0, flavorsIncluded: 1, flavors: [], guests: null, surcharge: 0 };

    var EXTRA_FLAVOR = 25; // € per extra flavor beyond package

    /* ---------- package selection (single) ---------- */
    wizard.querySelectorAll(".option[data-pkg]").forEach(function (op) {
      op.addEventListener("click", function () {
        wizard.querySelectorAll(".option[data-pkg]").forEach(function (o) { o.classList.remove("selected"); });
        op.classList.add("selected");
        state.pkg = op.getAttribute("data-pkg");
        state.pkgPrice = parseInt(op.getAttribute("data-price"), 10) || 0;
        state.flavorsIncluded = parseInt(op.getAttribute("data-flavors-included"), 10) || 1;
        updateFlavorHint();
        recalc();
      });
    });

    /* ---------- flavor selection (multi) ---------- */
    var flavorHint = wizard.querySelector("[data-flavor-hint]");
    function updateFlavorHint() {
      if (!flavorHint) return;
      var tmpl = flavorHint.getAttribute("data-tmpl") || flavorHint.textContent;
      flavorHint.setAttribute("data-tmpl", tmpl);
      flavorHint.textContent = tmpl.replace("{n}", state.flavorsIncluded);
    }
    wizard.querySelectorAll(".option--flavor").forEach(function (op) {
      op.addEventListener("click", function () {
        var f = op.getAttribute("data-flavor");
        var i = state.flavors.indexOf(f);
        if (i >= 0) { state.flavors.splice(i, 1); op.classList.remove("selected"); }
        else { state.flavors.push(f); op.classList.add("selected"); }
        recalc();
      });
    });

    /* ---------- guests selection (single) ---------- */
    wizard.querySelectorAll(".option[data-guests]").forEach(function (op) {
      op.addEventListener("click", function () {
        wizard.querySelectorAll(".option[data-guests]").forEach(function (o) { o.classList.remove("selected"); });
        op.classList.add("selected");
        state.guests = op.getAttribute("data-guests");
        state.surcharge = parseInt(op.getAttribute("data-surcharge"), 10) || 0;
        recalc();
      });
    });

    /* ---------- price estimate ---------- */
    function estimate() {
      var extra = Math.max(0, state.flavors.length - state.flavorsIncluded) * EXTRA_FLAVOR;
      return state.pkgPrice + state.surcharge + extra;
    }
    function recalc() {
      if (estEl) estEl.textContent = state.pkgPrice ? "€ " + estimate() : "—";
    }

    /* ---------- step navigation ---------- */
    function showStep(n) {
      cur = Math.max(0, Math.min(steps.length - 1, n));
      steps.forEach(function (s, i) { s.classList.toggle("active", i === cur); });
      tabs.forEach(function (t, i) {
        t.classList.toggle("active", i === cur);
        t.classList.toggle("done", i < cur);
      });
      if (btnBack) btnBack.style.visibility = cur === 0 ? "hidden" : "visible";
      if (btnNext) {
        var lastKey = cur === steps.length - 1 ? "book.submit" : "book.next";
        btnNext.setAttribute("data-i18n", lastKey);
        var tv = window.MM_I18N ? window.MM_I18N.t(document.documentElement.lang, lastKey) : null;
        if (tv) btnNext.textContent = tv;
      }
      if (cur === steps.length - 1) buildSummary();
      wizard.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    function validateStep(n) {
      // step 0 = package required; step 2 (details) requires date+location; step 3 contact requires name+email
      if (n === 0 && !state.pkg) { flash(steps[0]); return false; }
      if (n === 2) {
        var req = steps[2].querySelectorAll("[required]");
        for (var i = 0; i < req.length; i++) { if (!req[i].value) { req[i].focus(); flash(req[i]); return false; } }
        if (!state.guests) { var g = steps[2].querySelector(".option-grid"); if (g) flash(g); return false; }
      }
      if (n === 3) {
        var req2 = steps[3].querySelectorAll("[required]");
        for (var j = 0; j < req2.length; j++) { if (!req2[j].value) { req2[j].focus(); flash(req2[j]); return false; } }
      }
      return true;
    }
    function flash(el) {
      el.animate([{ boxShadow: "0 0 0 3px rgba(192,98,119,.5)" }, { boxShadow: "0 0 0 0 rgba(192,98,119,0)" }], { duration: 700 });
    }

    if (btnNext) btnNext.addEventListener("click", function () {
      if (!validateStep(cur)) return;
      if (cur === steps.length - 1) { submit(); return; }
      showStep(cur + 1);
    });
    if (btnBack) btnBack.addEventListener("click", function () { showStep(cur - 1); });

    tabs.forEach(function (t, i) {
      t.addEventListener("click", function () { if (i < cur) showStep(i); });
    });

    /* ---------- summary ---------- */
    function val(sel) { var e = steps[2].querySelector(sel) || steps[3].querySelector(sel); return e ? e.value : ""; }
    function lbl(forKey) {
      return window.MM_I18N ? window.MM_I18N.t(document.documentElement.lang, forKey) : forKey;
    }
    function buildSummary() {
      var box = wizard.querySelector("[data-summary]");
      if (!box) return;
      function txtFor(op) {
        var n = op ? op.querySelector("[data-i18n]") : null;
        return n ? n.textContent : (op ? op.textContent.trim() : "—");
      }
      var pkgOp = wizard.querySelector(".option[data-pkg].selected");
      var guestOp = wizard.querySelector(".option[data-guests].selected");
      var flavorNames = state.flavors.map(function (f) {
        var op = wizard.querySelector('.option--flavor[data-flavor="' + f + '"] [data-i18n]');
        return op ? op.textContent : f;
      });
      var rows = [
        [lbl("book.sum.package"), pkgOp ? txtFor(pkgOp.querySelector(".o-tier")) || pkgOp.querySelector(".o-tier").textContent : "—"],
        [lbl("book.sum.flavors"), flavorNames.length ? flavorNames.join(", ") : "—"],
        [lbl("book.sum.guests"), guestOp ? guestOp.querySelector(".o-tier").textContent : "—"],
        [lbl("book.sum.date"), val("[name=date]") || "—"],
        [lbl("book.sum.location"), val("[name=location]") || "—"],
        [lbl("book.sum.name"), (val("[name=firstname]") + " " + val("[name=lastname]")).trim() || "—"],
        [lbl("book.sum.email"), val("[name=email]") || "—"]
      ];
      box.innerHTML = rows.map(function (r) {
        return '<div class="sum-row"><span>' + r[0] + "</span><b>" + escapeHtml(r[1]) + "</b></div>";
      }).join("");
      var estBox = wizard.querySelector("[data-summary-est]");
      if (estBox) estBox.textContent = "€ " + estimate();
    }
    function escapeHtml(s) { return String(s).replace(/[&<>"]/g, function (c) { return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]; }); }

    /* ---------- submit (demo) ---------- */
    function fieldVal(sel) { var e = wizard.querySelector(sel); return e ? e.value : ""; }
    function submit() {
      // deliver the inquiry by email (via forms.js → Formsubmit)
      if (typeof window.MM_SEND === "function") {
        window.MM_SEND({
          _subject: "Neue Event-Anfrage – Matcha Madness",
          _template: "table",
          Paket: state.pkg ? "Paket " + state.pkg : "—",
          Geschmacksrichtungen: state.flavors.length ? state.flavors.join(", ") : "—",
          Gaeste: state.guests || "—",
          Datum: fieldVal("[name=date]") || "—",
          Uhrzeit: fieldVal("[name=time]") || "—",
          Ort: fieldVal("[name=location]") || "—",
          Vorname: fieldVal("[name=firstname]"),
          Nachname: fieldVal("[name=lastname]"),
          "E-Mail": fieldVal("[name=email]"),
          Telefon: fieldVal("[name=phone]") || "—",
          Nachricht: fieldVal("[name=message]") || "—",
          "Preis-Orientierung": "€ " + estimate()
        }).catch(function () {});
      }
      if (foot) foot.style.display = "none";
      tabs.forEach(function (t) { t.classList.add("done"); t.classList.remove("active"); });
      steps.forEach(function (s) { s.classList.remove("active"); });
      wizard.querySelector(".wizard-body").style.display = "none";
      var prog = wizard.querySelector(".wizard-progress");
      if (prog) prog.style.display = "none";
      if (successEl) successEl.classList.add("show");
      // reflect chosen estimate in success message
      var estOut = document.querySelector("[data-success-est]");
      if (estOut) estOut.textContent = "€ " + estimate();
    }

    document.addEventListener("langchange", function () {
      updateFlavorHint();
      if (cur === steps.length - 1) buildSummary();
      if (btnNext) {
        var key = cur === steps.length - 1 ? "book.submit" : "book.next";
        var tv = window.MM_I18N ? window.MM_I18N.t(document.documentElement.lang, key) : null;
        if (tv) btnNext.textContent = tv;
      }
    });

    // init
    showStep(0);
    recalc();
  });
})();
