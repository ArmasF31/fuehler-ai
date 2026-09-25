document.getElementById("year").textContent = new Date().getFullYear();

const header = document.getElementById("siteHeader");
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

function setMenu(open) {
  navLinks.classList.toggle("open", open);
  navToggle.setAttribute("aria-expanded", String(open));
  navToggle.setAttribute("aria-label", open ? "Menü schließen" : "Menü öffnen");
}

navToggle.addEventListener("click", () => {
  setMenu(!navLinks.classList.contains("open"));
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMenu(false));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && navLinks.classList.contains("open")) {
    setMenu(false);
    navToggle.focus();
  }
});

// Header bekommt beim Scrollen einen Rahmen
const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 8);
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

// Elemente beim Scrollen einblenden (gestaffelt innerhalb von Gruppen)
const revealEls = document.querySelectorAll(".reveal");

document.querySelectorAll(".cards, .steps, .principles, .hero-copy").forEach((group) => {
  group.querySelectorAll(".reveal").forEach((el, i) => {
    el.style.setProperty("--reveal-delay", `${i * 0.08}s`);
  });
});

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  revealEls.forEach((el) => revealObserver.observe(el));

  // Aktiven Menüpunkt hervorheben
  const navMap = new Map();
  navLinks.querySelectorAll('a[href^="#"]:not(.btn)').forEach((a) => {
    const section = document.querySelector(a.getAttribute("href"));
    if (section) navMap.set(section, a);
  });

  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const link = navMap.get(entry.target);
        if (link) link.classList.toggle("active", entry.isIntersecting);
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  navMap.forEach((_, section) => navObserver.observe(section));
} else {
  revealEls.forEach((el) => el.classList.add("visible"));
}
