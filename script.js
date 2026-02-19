// =========================
// Machine à écrire (accessibilité friendly)
// =========================
const titleText = "Fernandes Inês — Étudiante en Systèmes Industriels";
let i = 0;
function typeEffect() {
  const el = document.getElementById("typed");
  if (!el) return;
  if (document.hidden) { // évite de continuer en onglet inactif
    setTimeout(typeEffect, 200);
    return;
  }
  if (i < titleText.length) {
    el.textContent += titleText.charAt(i++);
    setTimeout(typeEffect, 55);
  }
}
typeEffect();

// =========================
/* Thème clair/sombre
   - Respecte la préférence OS au premier chargement
   - Persiste le choix utilisateur
   - Met à jour l’icône du bouton (☀️ / 🌙)
*/
// =========================
const root = document.documentElement;
const themeBtn = document.getElementById("theme-toggle");

// 1) Préférence OS par défaut
const prefersLight = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;

// 2) Charger préférence utilisateur si existante
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "light" || (!savedTheme && prefersLight)) {
  root.classList.add("light");
}

// Met à jour l’icône du bouton thème
function updateThemeIcon() {
  if (!themeBtn) return;
  themeBtn.textContent = root.classList.contains("light") ? "☀️" : "🌙";
}
updateThemeIcon();

themeBtn?.addEventListener("click", () => {
  root.classList.toggle("light");
  localStorage.setItem("theme", root.classList.contains("light") ? "light" : "dark");
  updateThemeIcon();
});

// =========================
// Apparition au scroll (scroll reveal)
// =========================
const obs = new IntersectionObserver(
  entries => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add("show");
    });
  },
  { threshold: 0.1 }
);
document.querySelectorAll(".fade").forEach(el => obs.observe(el));

// =========================
// Projets dynamiques
// =========================
const projects = [
  {
    title: "Site portfolio personnel",
    desc: "Un site web simple pour présenter mes projets et compétences, construit avec HTML, CSS et JavaScript.",
    stack: ["HTML", "CSS", "JavaScript"],
    links: { github: "https://github.com/Chicita04" } // ajoute demo: "https://..." si tu as
  }
];

// Rendu des projets (sécurisé pour champs optionnels)
const list = document.getElementById("project-list");
if (list) {
  list.innerHTML = projects.map(p => {
    const stackHtml = Array.isArray(p.stack)
      ? p.stack.map(s => `<span class="chip">${s}</span>`).join(" ")
      : "";
    const demoLink = p.links?.demo
      ? `<a href="${p.links.demo}" class="btn" target="_blank" rel="noopener">Démo</a>`
      : "";
    const codeLink = p.links?.github
      ? `<a href="${p.links.github}" class="btn" target="_blank" rel="noopener">Code</a>`
      : "";
    const actions = (demoLink || codeLink) ? `<div class="actions">${demoLink} ${codeLink}</div>` : "";

    return `
      <article class="project">
        <h3>${p.title}</h3>
        <p>${p.desc}</p>
        <p>${stackHtml}</p>
        ${actions}
      </article>
    `;
  }).join("");
}

// =========================
// Année dynamique (protégé)
// =========================
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// =========================
// Menu burger (mobile) avec overlay & accessibilité
// - Nécessite dans le HTML :
//   <button id="menu-toggle" class="burger" aria-expanded="false" aria-controls="main-menu" aria-label="Ouvrir le menu">☰</button>
//   <ul id="main-menu" class="nav-links" role="menubar">...</ul>
//   <div id="nav-overlay" class="nav-overlay" hidden></div>  (si overlay souhaité)
// =========================
const burger = document.getElementById("menu-toggle");
const menu = document.getElementById("main-menu");
const overlay = document.getElementById("nav-overlay");

if (burger && menu) {
  let lastFocused = null;

  const openMenu = () => {
    menu.classList.add("open");
    burger.setAttribute("aria-expanded", "true");
    lastFocused = document.activeElement;
    const firstLink = menu.querySelector("a");
    firstLink?.focus();

    // Overlay si présent
    if (overlay) {
      overlay.hidden = false;
      requestAnimationFrame(() => overlay.classList.add("show"));
    }

    document.addEventListener("click", onClickOutside);
    document.addEventListener("keydown", onKeyDown);
  };

  const closeMenu = () => {
    menu.classList.remove("open");
    burger.setAttribute("aria-expanded", "false");

    if (overlay) {
      overlay.classList.remove("show");
      setTimeout(() => { overlay.hidden = true; }, 180);
    }

    lastFocused?.focus();
    document.removeEventListener("click", onClickOutside);
    document.removeEventListener("keydown", onKeyDown);
  };

  const toggleMenu = () => {
    menu.classList.contains("open") ? closeMenu() : openMenu();
  };

  const onClickOutside = (e) => {
    const clickedInsideMenu = menu.contains(e.target);
    const clickedBurger = e.target === burger;
    const clickedOverlay = overlay && e.target === overlay;
    if (!clickedInsideMenu && !clickedBurger || clickedOverlay) {
      closeMenu();
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Escape") closeMenu();
  };

  burger.addEventListener("click", toggleMenu);
  overlay?.addEventListener("click", closeMenu);
  menu.querySelectorAll("a").forEach(a => a.addEventListener("click", closeMenu));
}
``