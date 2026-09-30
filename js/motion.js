// Motion layer: transitions, split-text, neural canvas, cursor, magnetic, tilt, typing, scroll effects.
(function () {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(pointer: fine)").matches;
  if (reduced) return;

  /* ---------- Intro: preloader (home, once per session) ---------- */
  const pre = document.querySelector(".preloader");
  let seen = false;
  try { seen = sessionStorage.getItem("introSeen") === "1"; } catch (e) {}
  const showPre = pre && !seen;
  if (pre && !showPre) pre.classList.add("skip");
  // How long first-screen content should wait before animating in (ms)
  const INTRO = showPre ? 2700 : 750;
  window.__introDelay = INTRO;
  if (showPre) {
    const count = pre.querySelector(".pre-count");
    const bar = pre.querySelector(".pre-bar");
    const t0 = Date.now(), dur = 1900;
    const timer = setInterval(() => {
      const k = Math.min(1, (Date.now() - t0) / dur);
      const v = Math.round(100 * (1 - Math.pow(1 - k, 2.2)));
      count.textContent = String(v).padStart(3, "0");
      bar.style.width = v + "%";
      if (k < 1) return;
      clearInterval(timer);
      setTimeout(() => {
        pre.classList.add("done");
        try { sessionStorage.setItem("introSeen", "1"); } catch (e) {}
        setTimeout(() => pre.remove(), 1100);
      }, 250);
    }, 30);
  }

  /* ---------- Page leave transition ---------- */
  document.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || a.target === "_blank") return;
    const href = a.getAttribute("href") || "";
    if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:") || /^https?:/.test(href) || href.endsWith(".pdf")) return;
    e.preventDefault();
    document.body.classList.add("leaving");
    setTimeout(() => (location.href = href), 550);
  });
  window.addEventListener("pageshow", () => document.body.classList.remove("leaving"));

  document.addEventListener("DOMContentLoaded", () => {
    const grain = document.createElement("div");
    grain.className = "grain";
    document.body.appendChild(grain);
    // Stagger whatever is on the first screen so it plays after the intro
    let n = 0;
    document.querySelectorAll(".reveal").forEach((el) => {
      if (el.getBoundingClientRect().top < innerHeight) el.style.transitionDelay = `${INTRO / 1000 - 0.3 + n++ * 0.08}s`;
    });
    splitHeadings();
    roleScramble();
    networks();
    if (finePointer) {
      cursor();
      magnetic();
      tilt();
      spotlight();
    }
    typing();
    marquee();
    scrollFx();
  });

  /* ---------- Split headings into masked words ---------- */
  function splitHeadings() {
    const els = document.querySelectorAll(".hero-title, .about-copy h1, .page-head h1, .cta h2, .h2");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && (e.target.classList.add("in"), io.unobserve(e.target))),
      { threshold: 0.2 }
    );
    els.forEach((el) => {
      let i = 0;
      const wrap = (node) => {
        const w = document.createElement("span");
        w.className = "w";
        const wi = document.createElement("span");
        wi.className = "wi";
        wi.style.setProperty("--i", i++);
        w.appendChild(wi);
        return [w, wi];
      };
      [...el.childNodes].forEach((node) => {
        if (node.nodeType === 3) {
          const frag = document.createDocumentFragment();
          node.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) return frag.appendChild(document.createTextNode(" "));
            const [w, wi] = wrap();
            wi.textContent = part;
            frag.appendChild(w);
          });
          node.replaceWith(frag);
        } else if (node.nodeType === 1 && node.tagName !== "BR") {
          const [w, wi] = wrap();
          node.replaceWith(w);
          wi.appendChild(node);
        }
      });
      el.classList.remove("reveal", "d1", "d2", "d3", "d4", "in");
      el.classList.add("split");
      if (el.getBoundingClientRect().top < innerHeight) el.style.setProperty("--base", `${INTRO / 1000 - 0.4}s`);
      io.observe(el);
    });
  }

  /* ---------- Scrambling role text ---------- */
  function roleScramble() {
    const el = document.querySelector(".hero-role");
    if (!el) return;
    const roles = ["AI Engineer", "Agent Architect", "Automation Engineer", "AI Researcher"];
    const glyphs = "!<>-_\\/[]{}—=+*^?#01";
    el.innerHTML = `<span class="role-text">${roles[0]}</span>`;
    const t = el.firstChild;
    let idx = 0;
    const scramble = (to) => {
      const from = t.textContent;
      const len = Math.max(from.length, to.length);
      const q = [...Array(len)].map((_, i) => ({ f: from[i] || "", t: to[i] || "", s: Math.floor(Math.random() * 14), e: 14 + Math.floor(Math.random() * 18) }));
      let frame = 0;
      const step = () => {
        let out = "", done = 0;
        q.forEach((c) => {
          if (frame >= c.e) { done++; out += c.t; }
          else if (frame >= c.s) out += `<span class="glyph">${glyphs[Math.floor(Math.random() * glyphs.length)]}</span>`;
          else out += c.f;
        });
        t.innerHTML = out;
        frame++;
        if (done < q.length) requestAnimationFrame(step);
      };
      step();
    };
    setInterval(() => scramble(roles[(idx = (idx + 1) % roles.length)]), 3200);
  }

  /* ---------- Neural network canvas ---------- */
  function networks() {
    const hosts = document.querySelectorAll("section.hero, .page-head, .cta, .article-head");
    hosts.forEach((host) => {
      host.classList.add("has-net");
      const c = document.createElement("canvas");
      c.className = "net";
      host.insertBefore(c, host.querySelector(".container"));
      const ctx = c.getContext("2d");
      let w, h, nodes, visible = false;
      const mouse = { x: -9999, y: -9999 };
      const dpr = Math.min(devicePixelRatio || 1, 2);

      const resize = () => {
        w = host.clientWidth; h = host.clientHeight;
        c.width = w * dpr; c.height = h * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        const n = Math.min(90, Math.floor((w * h) / 16000));
        nodes = [...Array(n)].map(() => ({
          x: Math.random() * w, y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
          r: Math.random() * 1.6 + 0.6, red: Math.random() < 0.12,
        }));
      };
      resize();
      new ResizeObserver(resize).observe(host);
      new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) requestAnimationFrame(draw); }).observe(host);
      host.addEventListener("mousemove", (e) => { const r = host.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; });
      host.addEventListener("mouseleave", () => { mouse.x = mouse.y = -9999; });

      const LINK = 140, MOUSE = 200;
      function draw() {
        if (!visible) return;
        ctx.clearRect(0, 0, w, h);
        for (const p of nodes) {
          const dx = mouse.x - p.x, dy = mouse.y - p.y, d = Math.hypot(dx, dy);
          if (d < MOUSE) { p.x += dx * 0.004; p.y += dy * 0.004; }
          p.x += p.vx; p.y += p.vy;
          if (p.x < 0 || p.x > w) p.vx *= -1;
          if (p.y < 0 || p.y > h) p.vy *= -1;
        }
        for (let i = 0; i < nodes.length; i++) {
          const a = nodes[i];
          for (let j = i + 1; j < nodes.length; j++) {
            const b = nodes[j], d = Math.hypot(a.x - b.x, a.y - b.y);
            if (d < LINK) {
              ctx.strokeStyle = `rgba(255,255,255,${(1 - d / LINK) * 0.14})`;
              ctx.lineWidth = 1;
              ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
            }
          }
          const dm = Math.hypot(a.x - mouse.x, a.y - mouse.y);
          if (dm < MOUSE) {
            ctx.strokeStyle = `rgba(229,50,59,${(1 - dm / MOUSE) * 0.7})`;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
          }
          ctx.fillStyle = a.red ? "rgba(229,50,59,.9)" : "rgba(255,255,255,.45)";
          ctx.beginPath(); ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2); ctx.fill();
        }
        requestAnimationFrame(draw);
      }
    });
  }

  /* ---------- Custom cursor ---------- */
  function cursor() {
    const dot = document.createElement("div");
    const ring = document.createElement("div");
    dot.className = "cursor-dot";
    ring.className = "cursor-ring";
    ring.innerHTML = "<span>View</span>";
    document.body.append(dot, ring);
    document.documentElement.classList.add("has-cursor");
    let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
    addEventListener("mousemove", (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px)`;
      document.body.classList.add("cursor-on");
    });
    document.addEventListener("mouseleave", () => document.body.classList.remove("cursor-on"));
    (function loop() {
      rx += (mx - rx) * 0.16; ry += (my - ry) * 0.16;
      ring.style.transform = `translate(${rx}px, ${ry}px)`;
      requestAnimationFrame(loop);
    })();
    document.addEventListener("mouseover", (e) => {
      const t = e.target;
      ring.classList.toggle("view", !!t.closest(".work-card, .post-card, .feature .work-visual"));
      ring.classList.toggle("hover", !!t.closest("a, button, .tag, .thumbs button"));
      document.body.classList.toggle("cursor-text", !!t.closest("input, textarea"));
    });
  }

  /* ---------- Magnetic elements ---------- */
  function magnetic() {
    document.querySelectorAll(".btn, .nav-right .social, .nav-cta, .logo, .link-arrow").forEach((el) => {
      const strength = el.classList.contains("btn") ? 0.3 : 0.45;
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * strength;
        const y = (e.clientY - r.top - r.height / 2) * strength;
        el.style.transform = `translate(${x}px, ${y}px)`;
      });
      el.addEventListener("mouseleave", () => (el.style.transform = ""));
    });
  }

  /* ---------- 3D tilt ---------- */
  function tilt() {
    document.addEventListener("mousemove", (e) => {
      const v = e.target.closest(".work-visual");
      document.querySelectorAll(".work-visual.tilting").forEach((x) => x !== v && ((x.style.transform = ""), x.classList.remove("tilting")));
      if (!v) return;
      const r = v.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      v.classList.add("tilting");
      v.style.transform = `perspective(1200px) rotateY(${px * 8}deg) rotateX(${-py * 8}deg)`;
      v.style.setProperty("--gx", `${(px + 0.5) * 100}%`);
      v.style.setProperty("--gy", `${(py + 0.5) * 100}%`);
    });
  }

  /* ---------- Cursor spotlight on service cards ---------- */
  function spotlight() {
    document.querySelectorAll(".service, .contact-card, .skill-group").forEach((el) =>
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${e.clientX - r.left}px`);
        el.style.setProperty("--my", `${e.clientY - r.top}px`);
      })
    );
  }

  /* ---------- Typing code windows ---------- */
  function typing() {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && (io.unobserve(e.target), type(e.target))),
      { threshold: 0.35 }
    );
    const prep = (body) => {
      if (body.dataset.typed) return;
      body.dataset.typed = "1";
      const walker = document.createTreeWalker(body, NodeFilter.SHOW_TEXT);
      const parts = [];
      while (walker.nextNode()) parts.push([walker.currentNode, walker.currentNode.textContent]);
      parts.forEach(([n]) => (n.textContent = ""));
      body._parts = parts;
      const caret = document.createElement("span");
      caret.className = "caret";
      body.appendChild(caret);
      io.observe(body);
    };
    const type = (body) => {
      const parts = body._parts;
      const total = parts.reduce((s, [, t]) => s + t.length, 0);
      const perFrame = Math.max(1, Math.ceil(total / 90));
      let pi = 0, ci = 0;
      (function step() {
        for (let k = 0; k < perFrame && pi < parts.length; k++) {
          const [node, text] = parts[pi];
          node.textContent = text.slice(0, ++ci);
          if (ci >= text.length) { pi++; ci = 0; }
        }
        if (pi < parts.length) requestAnimationFrame(step);
      })();
    };
    document.querySelectorAll(".art-body").forEach(prep);
    new MutationObserver((muts) =>
      muts.forEach((m) => m.addedNodes.forEach((n) => n.nodeType === 1 && n.querySelectorAll && n.querySelectorAll(".art-body").forEach(prep)))
    ).observe(document.body, { childList: true, subtree: true });
  }

  /* ---------- Scroll-velocity marquee ---------- */
  function marquee() {
    const track = document.querySelector(".marquee-track");
    if (!track) return;
    track.classList.add("js");
    let x = 0, dir = -1, boost = 0, lastY = scrollY;
    addEventListener("scroll", () => {
      const dy = scrollY - lastY;
      lastY = scrollY;
      if (dy) dir = dy > 0 ? -1 : 1;
      boost = Math.min(18, boost + Math.abs(dy) * 0.12);
    }, { passive: true });
    (function loop() {
      const half = track.scrollWidth / 2;
      x += dir * (0.8 + boost);
      boost *= 0.92;
      if (x <= -half) x += half;
      if (x > 0) x -= half;
      track.style.transform = `translateX(${x}px) skewX(${-dir * Math.min(boost, 12) * 0.6}deg)`;
      requestAnimationFrame(loop);
    })();
  }

  /* ---------- Scroll effects: progress, parallax, logo spin ---------- */
  function scrollFx() {
    const bar = document.createElement("div");
    bar.className = "scroll-progress";
    document.body.appendChild(bar);
    const heroImg = document.querySelector(".hero-media img, .about-media img");
    const stats = document.querySelector(".stats");
    const logo = document.querySelector(".site-header .logo svg");
    let ticking = false;
    const update = () => {
      const y = scrollY;
      const max = document.documentElement.scrollHeight - innerHeight;
      bar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
      if (heroImg && y < innerHeight * 1.5) heroImg.style.translate = `0 ${y * 0.25}px`;
      if (stats && y < innerHeight * 1.5) stats.style.translate = `0 ${y * -0.12}px`;
      if (logo) logo.style.rotate = `${y * 0.25}deg`;
      ticking = false;
    };
    addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    update();
  }
})();
