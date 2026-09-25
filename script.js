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

// Animierter Hero-Hintergrund: ein Knoten-Netz, durch das Signale laufen
// und das den Mauszeiger „erfühlt“.
(function heroNetwork() {
  const hero = document.getElementById("top");
  const canvas = document.getElementById("heroCanvas");
  if (!hero || !canvas || !canvas.getContext) return;

  const ctx = canvas.getContext("2d");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const LINK_DIST = 150;
  const POINTER_DIST = 190;
  const COLORS = ["91, 140, 255", "139, 92, 246"];
  const SIGNAL = "52, 211, 153";

  let width = 0;
  let height = 0;
  let nodes = [];
  let packets = [];
  let frame = null;
  let inView = true;
  let lastPacket = 0;
  const pointer = { x: 0, y: 0, active: false };

  function createNodes() {
    const count = Math.round(Math.min(90, Math.max(26, (width * height) / 12000)));
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.4 + 1.1,
      color: COLORS[Math.random() < 0.6 ? 0 : 1],
      glow: 0,
    }));
    packets = [];
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const widthChanged = Math.abs(rect.width - width) > 1;
    width = rect.width;
    height = rect.height;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    // Nur bei neuer Breite neu verteilen (mobile Adressleiste ändert nur die Höhe)
    if (widthChanged || nodes.length === 0) createNodes();
    draw(false);
  }

  function spawnPacket() {
    const from = nodes[Math.floor(Math.random() * nodes.length)];
    const neighbours = nodes.filter(
      (n) => n !== from && Math.hypot(n.x - from.x, n.y - from.y) < LINK_DIST
    );
    if (neighbours.length) {
      const to = neighbours[Math.floor(Math.random() * neighbours.length)];
      packets.push({ from, to, t: 0 });
    }
  }

  function line(x1, y1, x2, y2, style) {
    ctx.strokeStyle = style;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

  function draw(move) {
    ctx.clearRect(0, 0, width, height);
    ctx.lineWidth = 1;

    if (move) {
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < -20) n.x = width + 20;
        else if (n.x > width + 20) n.x = -20;
        if (n.y < -20) n.y = height + 20;
        else if (n.y > height + 20) n.y = -20;
        n.glow *= 0.965;
      }
    }

    // Verbindungen zwischen nahen Knoten
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < LINK_DIST) line(a.x, a.y, b.x, b.y, `rgba(${a.color}, ${(1 - d / LINK_DIST) * 0.38})`);
      }
    }

    // Fühler zum Mauszeiger
    if (pointer.active) {
      for (const n of nodes) {
        const d = Math.hypot(n.x - pointer.x, n.y - pointer.y);
        if (d < POINTER_DIST) {
          const k = 1 - d / POINTER_DIST;
          line(pointer.x, pointer.y, n.x, n.y, `rgba(${COLORS[0]}, ${k * 0.65})`);
          n.glow = Math.max(n.glow, k * 0.8);
          if (move) {
            n.x += (pointer.x - n.x) * 0.002 * k;
            n.y += (pointer.y - n.y) * 0.002 * k;
          }
        }
      }
    }

    // Signale, die von Knoten zu Knoten laufen
    for (let i = packets.length - 1; i >= 0; i--) {
      const p = packets[i];
      if (move) p.t += 0.014;
      if (p.t >= 1) {
        p.to.glow = 1;
        packets.splice(i, 1);
        continue;
      }
      const x = p.from.x + (p.to.x - p.from.x) * p.t;
      const y = p.from.y + (p.to.y - p.from.y) * p.t;
      line(p.from.x, p.from.y, x, y, `rgba(${SIGNAL}, 0.35)`);
      const halo = ctx.createRadialGradient(x, y, 0, x, y, 8);
      halo.addColorStop(0, `rgba(${SIGNAL}, 0.9)`);
      halo.addColorStop(1, `rgba(${SIGNAL}, 0)`);
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, Math.PI * 2);
      ctx.fill();
    }

    // Knoten
    for (const n of nodes) {
      if (n.glow > 0.05) {
        ctx.fillStyle = `rgba(${SIGNAL}, ${n.glow * 0.18})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r + 7 * n.glow, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = `rgba(${n.color}, ${0.7 + n.glow * 0.3})`;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r + n.glow, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function loop(time) {
    if (time - lastPacket > 450 && packets.length < 6) {
      spawnPacket();
      lastPacket = time;
    }
    draw(true);
    frame = requestAnimationFrame(loop);
  }

  function start() {
    if (frame === null && inView && !document.hidden && !reducedMotion.matches) {
      frame = requestAnimationFrame(loop);
    }
  }

  function stop() {
    if (frame !== null) {
      cancelAnimationFrame(frame);
      frame = null;
    }
  }

  hero.addEventListener("pointermove", (event) => {
    const rect = canvas.getBoundingClientRect();
    pointer.x = event.clientX - rect.left;
    pointer.y = event.clientY - rect.top;
    pointer.active = true;
  });
  hero.addEventListener("pointerleave", () => {
    pointer.active = false;
  });

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView) start();
      else stop();
    }).observe(hero);
  }

  document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));
  if (reducedMotion.addEventListener) {
    reducedMotion.addEventListener("change", () => {
      stop();
      draw(false);
      start();
    });
  }

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 150);
  });

  resize();
  start();
})();

// Posteingang-Demo im Hero: neue Mails kommen an, die KI ordnet sie ein,
// und die älteste Mail wandert in ihren Kategorie-Ordner.
(function inboxDemo() {
  const list = document.getElementById("inboxList");
  const inbox = list && list.closest(".inbox");
  if (!inbox || !inbox.animate) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
  const CATS = {
    yes: { label: "Interesse", color: "#34d399" },
    ask: { label: "Rückfrage", color: "#fbbf24" },
    no: { label: "Absage", color: "#8a94a6" },
  };
  const MAILS = [
    { name: "Anna L.", text: "Gerne nächste Woche — passt Ihnen Dienstag?", cat: "yes", avatar: "a5" },
    { name: "Frank D.", text: "Abwesenheitsnotiz: bis Montag nicht im Büro", cat: "no", avatar: "a3" },
    { name: "Markus H.", text: "Funktioniert das auch mit unserem CRM?", cat: "ask", avatar: "a2" },
    { name: "Sabine W.", text: "Klingt gut — schicken Sie gern Unterlagen!", cat: "yes", avatar: "a6" },
    { name: "Petra S.", text: "Bitte nehmen Sie mich aus dem Verteiler.", cat: "no", avatar: "a4" },
    { name: "Nina R.", text: "Können Sie mir ein Angebot schicken?", cat: "yes", avatar: "a1" },
    { name: "Oliver T.", text: "Wer wäre bei Ihnen der Ansprechpartner?", cat: "ask", avatar: "a5" },
    { name: "Jan K.", text: "Danke, wir haben schon einen Dienstleister.", cat: "no", avatar: "a2" },
  ];
  const MAX_ROWS = 4;

  const buckets = {};
  inbox.querySelectorAll(".bucket").forEach((b) => {
    buckets[b.dataset.cat] = b;
  });

  let nextMail = 0;
  let timer = null;
  let inView = true;
  let ready = false;

  function categoryOf(row) {
    if (row.dataset.cat) return row.dataset.cat;
    if (row.querySelector(".tag-yes")) return "yes";
    if (row.querySelector(".tag-ask")) return "ask";
    return "no";
  }

  function createRow(mail) {
    const initials = mail.name.split(" ").map((part) => part[0]).join("");
    const row = document.createElement("li");
    row.className = "mail live scanning";
    row.dataset.cat = mail.cat;
    row.innerHTML =
      `<span class="avatar ${mail.avatar}">${initials}</span>` +
      `<span class="mail-body"><strong>${mail.name}<span class="new-badge">Neu</span></strong>` +
      `<span>${mail.text}</span></span>` +
      `<span class="tag tag-scan">KI liest</span>`;
    return row;
  }

  function addMail() {
    const row = createRow(MAILS[nextMail++ % MAILS.length]);
    list.prepend(row);
    const height = row.offsetHeight;
    row.animate(
      [
        { height: "0px", paddingTop: "0px", paddingBottom: "0px", opacity: 0, transform: "translateY(-10px)" },
        { height: `${height}px`, paddingTop: "12px", paddingBottom: "12px", opacity: 1, transform: "none" },
      ],
      { duration: 550, easing: EASE }
    );
  }

  function classify(row) {
    const cat = row.dataset.cat;
    const tag = row.querySelector(".tag");
    row.classList.remove("scanning");
    row.querySelector(".new-badge")?.remove();
    tag.className = `tag tag-${cat}`;
    tag.textContent = CATS[cat].label;
    tag.animate(
      [
        { transform: "scale(0.6)", opacity: 0 },
        { transform: "scale(1.12)", opacity: 1, offset: 0.6 },
        { transform: "scale(1)", opacity: 1 },
      ],
      { duration: 450, easing: EASE }
    );
    if (cat === "no") row.classList.add("mail-muted");
  }

  function bump(bucket) {
    const count = bucket.querySelector("b");
    count.textContent = Number(count.textContent) + 1;
    bucket.classList.remove("bump");
    void bucket.offsetWidth; // Animation neu starten
    bucket.classList.add("bump");
    setTimeout(() => bucket.classList.remove("bump"), 700);
  }

  function sortOut(row) {
    const cat = categoryOf(row);
    const bucket = buckets[cat];
    const box = inbox.getBoundingClientRect();
    const from = row.querySelector(".tag").getBoundingClientRect();
    const to = bucket.querySelector("i").getBoundingClientRect();
    const x1 = from.left + from.width / 2 - box.left;
    const y1 = from.top + from.height / 2 - box.top;
    const x2 = to.left + to.width / 2 - box.left;
    const y2 = to.top + to.height / 2 - box.top;

    // Farbiger Punkt fliegt in einem Bogen in den Ordner
    const dot = document.createElement("span");
    dot.className = "fly-dot";
    dot.style.background = CATS[cat].color;
    dot.style.boxShadow = `0 0 14px ${CATS[cat].color}`;
    inbox.appendChild(dot);
    dot.animate(
      [
        { transform: `translate(${x1}px, ${y1}px) scale(0.6)`, opacity: 0 },
        { transform: `translate(${x1}px, ${y1}px) scale(1.2)`, opacity: 1, offset: 0.15 },
        { transform: `translate(${(x1 + x2) / 2 + 40}px, ${(y1 + y2) / 2 - 20}px) scale(1)`, opacity: 1, offset: 0.55 },
        { transform: `translate(${x2}px, ${y2}px) scale(0.5)`, opacity: 0.9 },
      ],
      { duration: 850, easing: "cubic-bezier(0.45, 0, 0.25, 1)" }
    ).onfinish = () => {
      dot.remove();
      bump(bucket);
    };

    // Zeile rutscht zur Seite und klappt zusammen
    const height = row.offsetHeight;
    row.style.overflow = "hidden";
    row.animate(
      [
        { height: `${height}px`, opacity: getComputedStyle(row).opacity, transform: "none" },
        { height: `${height}px`, opacity: 0, transform: "translateX(30px)", offset: 0.5 },
        { height: "0px", paddingTop: "0px", paddingBottom: "0px", opacity: 0, transform: "translateX(30px)" },
      ],
      { duration: 650, easing: EASE, fill: "forwards" }
    ).onfinish = () => row.remove();
  }

  function tick() {
    const rows = list.querySelectorAll(".mail:not(.leaving)");
    if (rows.length >= MAX_ROWS) {
      const oldest = rows[rows.length - 1];
      oldest.classList.add("leaving");
      sortOut(oldest);
    }
    addMail();
    timer = setTimeout(() => {
      const newest = list.querySelector(".mail.scanning");
      if (newest) classify(newest);
      timer = setTimeout(tick, 1500);
    }, 1500);
  }

  function start() {
    if (!ready || timer !== null || !inView || document.hidden || reducedMotion.matches) return;
    // Falls beim Pausieren noch eine Mail „gelesen“ wurde, erst diese einordnen
    const pending = list.querySelector(".mail.scanning");
    if (pending) {
      timer = setTimeout(() => {
        classify(pending);
        timer = setTimeout(tick, 1500);
      }, 800);
    } else {
      timer = setTimeout(tick, 1200);
    }
  }

  function stop() {
    clearTimeout(timer);
    timer = null;
  }

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView) start();
      else stop();
    }).observe(inbox);
  }
  document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));
  if (reducedMotion.addEventListener) {
    reducedMotion.addEventListener("change", () => (reducedMotion.matches ? stop() : start()));
  }

  // Erst nach dem Einblenden der Start-Mails loslegen
  setTimeout(() => {
    ready = true;
    start();
  }, 2200);
})();
