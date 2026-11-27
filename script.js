document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.querySelector(".nav__toggle");
  const navMenu = document.getElementById("nav-menu");
  const navLinks = Array.from(document.querySelectorAll(".nav__link"));
  const sections = Array.from(document.querySelectorAll("main section[id]"));
  const filterButtons = Array.from(document.querySelectorAll(".filter-btn"));
  const skillCards = Array.from(document.querySelectorAll(".skill-card"));
  const revealItems = Array.from(document.querySelectorAll(".reveal"));

  // Mobile navigation toggle
  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const isExpanded = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!isExpanded));
      navMenu.classList.toggle("is-open");
    });

    navMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navToggle.setAttribute("aria-expanded", "false");
        navMenu.classList.remove("is-open");
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && navMenu.classList.contains("is-open")) {
        navToggle.setAttribute("aria-expanded", "false");
        navMenu.classList.remove("is-open");
      }
    });
  }

  // Smooth scrolling for in-page anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const targetId = anchor.getAttribute("href");
      if (!targetId || targetId === "#") return;
      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      event.preventDefault();
      targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  // Highlight active navigation link based on scroll position
  if ("IntersectionObserver" in window && sections.length > 0) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const activeId = entry.target.getAttribute("id");
          navLinks.forEach((link) => {
            const matches = link.getAttribute("href") === `#${activeId}`;
            link.classList.toggle("is-active", matches);
          });
        });
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: 0 }
    );

    sections.forEach((section) => sectionObserver.observe(section));
  }

  // Interactive skill category filtering
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter || "all";

      filterButtons.forEach((btn) => btn.classList.toggle("is-active", btn === button));

      skillCards.forEach((card) => {
        const matches = filter === "all" || card.dataset.category === filter;
        card.classList.toggle("is-hidden", !matches);
        if (matches) {
          card.classList.add("is-visible");
        }
      });
    });
  });

  // Subtle reveal animation on scroll
  if ("IntersectionObserver" in window && revealItems.length > 0) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12 }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  // Bot-safe click-to-copy email button with brief "Copied!" confirmation
  const copyEmailBtn = document.getElementById("copy-email-btn");
  const copyEmailLabel = document.getElementById("copy-email-label");
  if (copyEmailBtn && copyEmailLabel) {
    let resetTimerId = null;

    copyEmailBtn.addEventListener("click", async () => {
      // Construct email dynamically at click time so plain-text email is absent from HTML
      const localPart = ["2024ad", "0172"].join("");
      const domainPart = ["svce", "ac", "in"].join(".");
      const email = `${localPart}@${domainPart}`;

      let copied = false;
      if (navigator.clipboard && window.isSecureContext) {
        try {
          await navigator.clipboard.writeText(email);
          copied = true;
        } catch {
          copied = false;
        }
      }

      if (!copied) {
        const helper = document.createElement("textarea");
        helper.value = email;
        helper.setAttribute("readonly", "");
        helper.style.position = "fixed";
        helper.style.opacity = "0";
        document.body.appendChild(helper);
        helper.select();
        copied = document.execCommand("copy");
        document.body.removeChild(helper);
      }

      if (copied) {
        copyEmailLabel.textContent = "Copied!";
        copyEmailBtn.classList.add("is-copied");
        window.clearTimeout(resetTimerId);
        resetTimerId = window.setTimeout(() => {
          copyEmailLabel.textContent = "Copy Email";
          copyEmailBtn.classList.remove("is-copied");
        }, 2000);
      }
    });
  }
});
