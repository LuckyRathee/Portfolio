// Vercel serverless function: POST /api/chat  { messages: [{ role, content }] } → { reply }
import { answer, rateLimited } from "./_core.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Use POST." });
  const ip = (req.headers["x-forwarded-for"] || "").split(",")[0].trim() || "unknown";
  if (rateLimited(ip)) return res.status(429).json({ error: "You've hit the message limit — please try again later, or reach Lucky via the contact page." });
  try {
    const { status, body } = await answer(req.body?.messages);
    res.status(status).json(body);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Something went wrong." });
  }
}
