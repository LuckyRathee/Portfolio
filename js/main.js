(function () {
  const S = window.SITE;
  const page = document.body.dataset.page || "";

  const ICONS = {
    star:
      '<svg viewBox="0 0 100 100" aria-hidden="true"><g stroke="#e5323b" stroke-width="15" stroke-linecap="butt">' +
      '<line x1="50" y1="4" x2="50" y2="96"/><line x1="10.2" y1="27" x2="89.8" y2="73"/><line x1="10.2" y1="73" x2="89.8" y2="27"/></g></svg>',
    github:
      '<svg viewBox="0 0 24 24"><path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.42-2.69 5.39-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z"/></svg>',
    linkedin:
      '<svg viewBox="0 0 24 24"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z"/></svg>',
    mail:
      '<svg viewBox="0 0 24 24"><path d="M2 4h20a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Zm10 8.2L3 6.6V18h18V6.6l-9 5.6ZM20.2 6H3.8L12 11.1 20.2 6Z"/></svg>',
    chevron:
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m6 9 6 6 6-6"/></svg>',
    arrow:
      '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  };
  window.ICONS = ICONS;

  const navLinks = [
    ["index.html", "Home", "home"],
    ["about.html", "About", "about"],
    ["work.html", "Portfolio", "work"],
  ];
  const pageLinks = [
    ["research.html", "Research", "research"],
    ["contact.html", "Contact", "contact"],
    [S.resume, "Resume (PDF)", ""],
  ];
  const cls = (key) => (key && key === page ? ' class="active"' : "");

  /* ---------- Header ---------- */
  const header = document.getElementById("site-header");
  if (header) {
    header.className = "site-header";
    header.innerHTML = `
      <div class="container">
        <nav class="nav-left" aria-label="Primary">
          ${navLinks.map(([h, t, k]) => `<a href="${h}"${cls(k)}>${t}</a>`).join("")}
          <div class="dropdown">
            <button class="dropdown-toggle" aria-expanded="false">Pages ${ICONS.chevron}</button>
            <div class="dropdown-menu">
              ${pageLinks.map(([h, t, k]) => `<a href="${h}"${cls(k)}${k ? "" : ' target="_blank" rel="noopener"'}>${t}</a>`).join("")}
            </div>
          </div>
        </nav>
        <a class="logo" href="index.html" aria-label="${S.name} — home">${ICONS.star}</a>
        <div class="nav-right">
          <a class="social" href="${S.github}" target="_blank" rel="noopener" aria-label="GitHub">${ICONS.github}</a>
          <a class="social" href="${S.linkedin}" target="_blank" rel="noopener" aria-label="LinkedIn">${ICONS.linkedin}</a>
          <a class="social" href="mailto:${S.email}" aria-label="Email">${ICONS.mail}</a>
          <a class="nav-cta" href="${S.resume}" target="_blank" rel="noopener">Resume <span>(↓)</span></a>
        </div>
        <button class="menu-btn" aria-label="Open menu" aria-expanded="false"><span></span><span></span><span></span></button>
      </div>
      <div class="mobile-nav">
        ${[...navLinks, ...pageLinks.slice(0, 2)].map(([h, t, k]) => `<a href="${h}"${cls(k)}>${t}</a>`).join("")}
        <div class="mobile-social">
          <a href="${S.github}" target="_blank" rel="noopener">GitHub</a>
          <a href="${S.linkedin}" target="_blank" rel="noopener">LinkedIn</a>
          <a href="${S.resume}" target="_blank" rel="noopener">Resume</a>
        </div>
      </div>`;

    const menuBtn = header.querySelector(".menu-btn");
    menuBtn.addEventListener("click", () => {
      const open = document.body.classList.toggle("nav-open");
      menuBtn.setAttribute("aria-expanded", open);
      document.body.style.overflow = open ? "hidden" : "";
    });

    const dd = header.querySelector(".dropdown");
    const ddBtn = dd.querySelector(".dropdown-toggle");
    ddBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      ddBtn.setAttribute("aria-expanded", dd.classList.toggle("open"));
    });
    document.addEventListener("click", () => dd.classList.remove("open"));
  }

  /* ---------- Footer ---------- */
  const footer = document.getElementById("site-footer");
  if (footer) {
    footer.className = "site-footer";
    footer.innerHTML = `
      <div class="container">
        <a class="logo" href="index.html" aria-label="Home">${ICONS.star}</a>
        <nav class="footer-links">
          <a href="index.html">Home</a><a href="about.html">About</a><a href="work.html">Portfolio</a>
          <a href="research.html">Research</a><a href="contact.html">Contact</a>
          <a href="${S.github}" target="_blank" rel="noopener">GitHub</a>
          <a href="${S.linkedin}" target="_blank" rel="noopener">LinkedIn</a>
        </nav>
        <small>© ${new Date().getFullYear()} ${S.name}. Built with care.</small>
      </div>`;
  }

  /* ---------- Shared renderers ---------- */
  window.renderArt = function (lines, opts = {}) {
    const body = lines
      .map(([type, txt]) => {
        const html = txt
          .replace(/<k>/g, '<span class="k">').replace(/<\/k>/g, "</span>")
          .replace(/<c>/g, '<span class="c">').replace(/<\/c>/g, "</span>");
        return type === "c" ? `<span class="c">${html}</span>` : html;
      })
      .join("\n");
    return `<div class="art">
      <div class="art-grid"></div>
      <div class="art-window${opts.tree ? " tree" : ""}"><div class="art-bar"><i></i><i></i><i></i></div><div class="art-body">${body}</div></div>
      ${opts.noStar ? "" : `<div class="art-star">${ICONS.star}</div>`}
    </div>`;
  };

  window.renderShot = function ([, src, alt, kind]) {
    return `<div class="shot${kind ? " " + kind : ""}"><img src="${src}" alt="${alt}" loading="lazy" /></div>`;
  };

  window.workCard = function (p, delay = 0) {
    return `<a class="work-card reveal d${delay}" href="project.html?id=${p.id}">
      <div class="work-visual">${p.images ? renderShot(p.images[0]) : renderArt(p.code)}${p.demo ? '<span class="live-badge"><i></i>Live</span>' : ""}</div>
      <div class="work-meta"><span>${p.category}</span><span class="sep"></span><span>${p.year}</span></div>
      <h3>${p.title}</h3>
    </a>`;
  };

  window.researchArt = function (r) {
    return renderArt([
      ["c", `// ${r.venue}`],
      ["", `status: <k>${r.status}</k>`],
      ["", `track:  ${r.category}`],
      ["", `year:   ${r.date}`],
      ...(r.metrics ? [["", `latency: <k>${r.metrics[0][0]} ${r.metrics[0][1]}</k>`]] : []),
    ]);
  };

  /* ---------- Reveal on scroll ---------- */
  window.initReveal = function () {
    const els = document.querySelectorAll(".reveal:not(.in)");
    if (!("IntersectionObserver" in window)) return els.forEach((el) => el.classList.add("in"));
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const el = e.target;
            el.classList.add("in");
            io.unobserve(el);
            // Drop the entrance delay once revealed so hover transitions stay snappy
            const delay = parseFloat(getComputedStyle(el).transitionDelay) * 1000 || 0;
            setTimeout(() => {
              el.style.transitionDelay = "";
              el.classList.remove("d1", "d2", "d3", "d4");
            }, delay + 1100);
          }
        }),
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    els.forEach((el) => io.observe(el));
  };

  /* ---------- Count-up numbers ---------- */
  function initCounters() {
    const nums = document.querySelectorAll("[data-count]");
    const run = (el) => {
      const target = +el.dataset.count;
      const decimals = (el.dataset.count.split(".")[1] || "").length;
      const t0 = performance.now();
      const dur = 1600;
      const tick = (t) => {
        const k = Math.min(1, (t - t0) / dur);
        const v = target * (1 - Math.pow(1 - k, 3));
        el.textContent = decimals ? v.toFixed(decimals) : Math.round(v);
        if (k < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    if (!("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver((entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const el = e.target;
          setTimeout(() => run(el), el.getBoundingClientRect().top < innerHeight ? window.__introDelay || 0 : 0);
          io.unobserve(e.target);
        }
      })
    );
    nums.forEach((n) => io.observe(n));
  }

  document.addEventListener("DOMContentLoaded", () => {
    initReveal();
    initCounters();
  });
})();
