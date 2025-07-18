export default async function handler(req, res) {
  try {
    console.log("---- RAG RETRIEVE DEBUG ----");
    console.log("Method:", req.method);
    console.log("Headers:", req.headers);

    // Log all env vars
    console.log("SUPABASE_URL:", process.env.SUPABASE_URL);
    console.log("SUPABASE_SERVICE_ROLE_KEY:", process.env.SUPABASE_SERVICE_ROLE_KEY ? "set" : "missing");
    console.log("OPENAI_API_KEY:", process.env.OPENAI_API_KEY ? "set" : "missing");

    // Try to parse body
    let body = req.body;
    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
        console.log("Parsed body (from string):", body);
      } catch (e) {
        console.error("Body parse error:", e);
        return res.status(400).json({ error: "Invalid JSON body", details: e.message, raw: req.body });
      }
    } else {
      console.log("Parsed body (object):", body);
    }

    // Check for query
    if (!body || !body.query) {
      return res.status(400).json({ error: "Missing query in body", body });
    }

    // Dummy response for now
    return res.status(200).json({
      ok: true,
      method: req.method,
      headers: req.headers,
      env: {
        SUPABASE_URL: process.env.SUPABASE_URL,
        SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? "set" : "missing",
        OPENAI_API_KEY: process.env.OPENAI_API_KEY ? "set" : "missing"
      },
      body
    });
  } catch (err) {
    console.error("UNEXPECTED ERROR:", err);
    return res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
} 