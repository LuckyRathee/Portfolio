// "Ask my AI" chat widget — talks to /api/chat (see api/_core.js).
(function () {
  const STAR = window.ICONS ? window.ICONS.star : "✱";
  const SUGGESTIONS = [
    "What has Lucky built with AI agents?",
    "Is Lucky open to full-time roles?",
    "Tell me about the 6G research",
    "What's Lucky's tech stack?",
  ];
  const KEY = "askChat";
  let history = [];
  try { history = JSON.parse(sessionStorage.getItem(KEY) || "[]"); } catch (e) {}
  const save = () => { try { sessionStorage.setItem(KEY, JSON.stringify(history.slice(-20))); } catch (e) {} };

  const root = document.createElement("div");
  root.className = "chat";
  root.innerHTML = `
    <button class="chat-launch" aria-label="Ask my AI assistant" aria-expanded="false">
      <span class="chat-star">${STAR}</span><span class="chat-launch-text">Ask my AI</span>
    </button>
    <section class="chat-panel" role="dialog" aria-label="Ask about Lucky" hidden>
      <header class="chat-head">
        <span class="chat-avatar">${STAR}</span>
        <div><strong>Ask about Lucky</strong><small><i></i> AI assistant · answers from the portfolio</small></div>
        <button class="chat-close" aria-label="Close chat">✕</button>
      </header>
      <div class="chat-log" aria-live="polite"></div>
      <div class="chat-suggest"></div>
      <form class="chat-form">
        <input name="q" type="text" placeholder="Ask about projects, skills, research…" maxlength="600" autocomplete="off" aria-label="Your question" />
        <button type="submit" aria-label="Send">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
        </button>
      </form>
    </section>`;
  document.body.appendChild(root);

  const launch = root.querySelector(".chat-launch");
  const panel = root.querySelector(".chat-panel");
  const log = root.querySelector(".chat-log");
  const suggest = root.querySelector(".chat-suggest");
  const form = root.querySelector(".chat-form");
  const input = form.q;
  let busy = false;

  const escape = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const format = (s) =>
    escape(s)
      .replace(/\*\*(.+?)\*\*/g, "<b>$1</b>")
      .replace(/(https?:\/\/[^\s)]+)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>')
      .replace(/([\w.+-]+@[\w-]+\.[\w.]+)/g, '<a href="mailto:$1">$1</a>')
      .replace(/\n/g, "<br>");

  function bubble(role, text, typed) {
    const el = document.createElement("div");
    el.className = `msg ${role}`;
    log.appendChild(el);
    if (!typed) el.innerHTML = format(text);
    else {
      let i = 0;
      const step = () => {
        i = Math.min(text.length, i + Math.max(2, Math.ceil(text.length / 120)));
        el.innerHTML = format(text.slice(0, i)) + (i < text.length ? '<span class="caret"></span>' : "");
        log.scrollTop = log.scrollHeight;
        if (i < text.length) setTimeout(step, 16);
      };
      step();
    }
    log.scrollTop = log.scrollHeight;
    return el;
  }

  function renderSuggestions() {
    suggest.innerHTML = history.length ? "" : SUGGESTIONS.map((s) => `<button type="button">${s}</button>`).join("");
  }

  function renderHistory() {
    log.innerHTML = "";
    bubble("assistant", "Hi! I'm Lucky's AI assistant. Ask me about Lucky’s projects, experience, skills or research.");
    history.forEach((m) => bubble(m.role, m.content));
    renderSuggestions();
  }

  async function ask(q) {
    q = q.trim();
    if (!q || busy) return;
    busy = true;
    history.push({ role: "user", content: q });
    bubble("user", q);
    suggest.innerHTML = "";
    input.value = "";
    const typing = document.createElement("div");
    typing.className = "msg assistant typing";
    typing.innerHTML = "<span></span><span></span><span></span>";
    log.appendChild(typing);
    log.scrollTop = log.scrollHeight;
    try {
      if (location.protocol === "file:") throw new Error("file");
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });
      const data = await r.json().catch(() => ({}));
      typing.remove();
      if (!r.ok || !data.reply) throw new Error(data.error || "error");
      history.push({ role: "assistant", content: data.reply });
      save();
      bubble("assistant", data.reply, true);
    } catch (e) {
      typing.remove();
      history.pop();
      const msg = e.message === "file"
        ? "The assistant only works when the site is served. Run `npm run dev` in the Portfolio folder and open http://localhost:3000."
        : e.message && e.message !== "error" && e.message !== "Failed to fetch"
          ? e.message
          : `I couldn't reach the assistant just now. You can email Lucky at ${SITE.email}.`;
      bubble("assistant error", msg);
    }
    busy = false;
    input.focus();
  }

  function toggle(open) {
    panel.hidden = !open;
    root.classList.toggle("open", open);
    launch.setAttribute("aria-expanded", open);
    if (open) {
      if (!log.children.length) renderHistory();
      setTimeout(() => input.focus(), 50);
    }
  }

  launch.addEventListener("click", () => toggle(panel.hidden));
  root.querySelector(".chat-close").addEventListener("click", () => toggle(false));
  document.addEventListener("keydown", (e) => e.key === "Escape" && !panel.hidden && toggle(false));
  suggest.addEventListener("click", (e) => e.target.matches("button") && ask(e.target.textContent));
  form.addEventListener("submit", (e) => { e.preventDefault(); ask(input.value); });
})();
