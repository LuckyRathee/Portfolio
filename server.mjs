// Local dev server: serves the site and /api/chat.  Run:  node server.mjs   → http://localhost:3000
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { existsSync, readFileSync } from "node:fs";
import { extname, join, normalize } from "node:path";

// Load .env (no dependency needed)
if (existsSync(".env")) {
  for (const line of readFileSync(".env", "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}
const { answer, rateLimited } = await import("./api/_core.js");

const TYPES = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".jpg": "image/jpeg", ".png": "image/png", ".pdf": "application/pdf", ".svg": "image/svg+xml" };
const ROOT = process.cwd();

createServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost");
  if (url.pathname === "/api/chat") {
    if (req.method !== "POST") return send(res, 405, { error: "Use POST." });
    if (rateLimited(req.socket.remoteAddress)) return send(res, 429, { error: "Message limit reached — try again later." });
    let raw = "";
    for await (const chunk of req) raw += chunk;
    try {
      const { status, body } = await answer(JSON.parse(raw || "{}").messages);
      return send(res, status, body);
    } catch (e) {
      console.error(e);
      return send(res, 500, { error: "Something went wrong." });
    }
  }
  const path = normalize(join(ROOT, url.pathname === "/" ? "index.html" : decodeURIComponent(url.pathname)));
  if (!path.startsWith(ROOT) || /\/(api|\.env)/.test(path.slice(ROOT.length))) return send(res, 404, "Not found");
  try {
    const file = await readFile(path);
    res.writeHead(200, { "Content-Type": TYPES[extname(path)] || "application/octet-stream" });
    res.end(file);
  } catch {
    send(res, 404, "Not found");
  }
}).listen(process.env.PORT || 3000, () => console.log(`Portfolio running at http://localhost:${process.env.PORT || 3000}`));

function send(res, status, body) {
  const json = typeof body !== "string";
  res.writeHead(status, { "Content-Type": json ? "application/json" : "text/plain" });
  res.end(json ? JSON.stringify(body) : body);
}
