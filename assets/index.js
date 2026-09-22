(function () {
  "use strict";

  var prefersReduced =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Mobile navigation */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".site-nav");

  if (toggle && nav) {
    function closeNav() {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open menu");
      document.body.classList.remove("nav-open");
    }

    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      document.body.classList.toggle("nav-open", open);
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        closeNav();
      });
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        closeNav();
      }
    });
  }

  /* FAQ accordions */
  document.querySelectorAll(".accordion-trigger").forEach(function (btn) {
    var panel = document.getElementById(btn.getAttribute("aria-controls"));
    if (!panel) return;

    function setHeight(open) {
      var inner = panel.querySelector(".accordion-panel-inner");
      if (!inner) return;
      if (prefersReduced) {
        panel.style.height = open ? "auto" : "0";
        return;
      }
      if (open) {
        panel.style.height = inner.offsetHeight + "px";
      } else {
        panel.style.height = "0";
      }
    }

    panel.style.height = "0";
    panel.style.overflow = "hidden";

    btn.addEventListener("click", function () {
      var expanded = btn.getAttribute("aria-expanded") === "true";
      document.querySelectorAll(".accordion-trigger").forEach(function (o) {
        if (o !== btn && o.getAttribute("aria-expanded") === "true") {
          o.setAttribute("aria-expanded", "false");
          var p = document.getElementById(o.getAttribute("aria-controls"));
          if (p) {
            p.style.height = "0";
            p.setAttribute("hidden", "");
          }
        }
      });
      btn.setAttribute("aria-expanded", expanded ? "false" : "true");
      if (expanded) {
        panel.setAttribute("hidden", "");
        setHeight(false);
      } else {
        panel.removeAttribute("hidden");
        setHeight(true);
      }
    });

    window.addEventListener(
      "resize",
      function () {
        if (btn.getAttribute("aria-expanded") === "true") setHeight(true);
      },
      { passive: true }
    );
  });

  /* Scroll reveal */
  if (!prefersReduced && "IntersectionObserver" in window) {
    var stagger = 60;
    document.querySelectorAll(".reveal").forEach(function (el, i) {
      el.style.transitionDelay = i % 6 * stagger + "ms";
    });

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -40px 0px", threshold: 0.08 }
    );

    document.querySelectorAll(".reveal").forEach(function (el) {
      io.observe(el);
    });
  } else {
    document.querySelectorAll(".reveal").forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* Contact form — set data-form-endpoint on <form> to your Formspree / Netlify URL */
  var form = document.querySelector("[data-contact-form]");
  if (form) {
    var successEl = document.querySelector("[data-form-success]");

    form.addEventListener("submit", function (e) {
      var hp = form.querySelector('input[name="_gotcha"]');
      if (hp && hp.value) {
        e.preventDefault();
        return;
      }

      var endpoint = form.getAttribute("data-form-endpoint");
      if (!endpoint || endpoint === "#") {
        e.preventDefault();
        if (successEl) {
          successEl.classList.add("is-visible");
          successEl.setAttribute("tabindex", "-1");
          successEl.focus();
        }
        form.reset();
        return;
      }

      e.preventDefault();
      var fd = new FormData(form);
      fetch(endpoint, {
        method: "POST",
        body: fd,
        headers: { Accept: "application/json" },
      })
        .then(function (res) {
          if (res.ok) {
            if (successEl) {
              successEl.classList.add("is-visible");
              successEl.focus();
            }
            form.reset();
          } else {
            alert("Something went wrong. Please email hello@bvrdesignstudio.com.");
          }
        })
        .catch(function () {
          alert("Something went wrong. Please email hello@bvrdesignstudio.com.");
        });
    });
  }

  /* Insights filter (simple) */
  var filterBtns = document.querySelectorAll("[data-insight-filter]");
  var cards = document.querySelectorAll("[data-insight-card]");
  if (filterBtns.length && cards.length) {
    filterBtns.forEach(function (b) {
      b.addEventListener("click", function () {
        var cat = b.getAttribute("data-insight-filter");
        filterBtns.forEach(function (x) {
          x.setAttribute("aria-pressed", x === b ? "true" : "false");
        });
        cards.forEach(function (card) {
          var c = card.getAttribute("data-insight-card");
          var show = cat === "all" || c === cat;
          card.style.display = show ? "" : "none";
        });
      });
    });
  }
})();
