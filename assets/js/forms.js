/* ============================================================
   forms.js — deliver form submissions by email via Formsubmit
   (no backend; works on static hosting like GitHub Pages)
   First submission triggers a one-time activation email to the
   recipient — confirm it once and all future inquiries arrive.
   ============================================================ */
(function () {
  "use strict";
  var EMAIL = "matchamadness.cgn@gmail.com";
  var ENDPOINT = "https://formsubmit.co/ajax/" + EMAIL;

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("form[data-formsubmit]").forEach(function (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var payload = { _subject: form.getAttribute("data-subject") || "Neue Anfrage – Matcha Madness", _template: "table" };
        new FormData(form).forEach(function (v, k) { payload[k] = v; });

        var btn = form.querySelector("[type=submit]");
        if (btn) { btn.disabled = true; btn.dataset.label = btn.textContent; btn.textContent = "…"; }

        fetch(ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify(payload)
        }).then(finish).catch(finish);

        function finish() {
          var s = document.querySelector(form.getAttribute("data-success"));
          form.style.display = "none";
          if (s) s.style.display = "block";
        }
      });
    });
  });

  // expose for the booking wizard
  window.MM_SEND = function (data) {
    return fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(data)
    });
  };
})();
