export default async function handler(req, res) {
  try {
    console.log("---- RAG RETRIEVE DEBUG ----");
    console.log("Method:", req.method);
    console.log("Headers:", req.headers);

    // Log all env vars
    console.log("SUPABASE_URL:", process.env.SUPABASE_URL);
    console.log("SUPABASE_SERVICE_ROLE_KEY:", process.env.SUPABASE_SERVICE_ROLE_KEY ? "set" : "missing");
    console.log("OPENAI_API_KEY:", process.env.OPENAI_API_KEY ? "set" : "missing");

    // Parse body
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

    if (!body || !body.query) {
      return res.status(400).json({ error: "Missing query in body", body });
    }

    // Step 2: Call OpenAI Embeddings API
    let embedding = null;
    try {
      const openaiRes = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: body.query,
          model: 'text-embedding-ada-002',
        }),
      });
      const openaiData = await openaiRes.json();
      console.log("OpenAI Embedding response:", openaiData);
      if (!openaiRes.ok) throw new Error(openaiData.error?.message || 'OpenAI embedding error');
      embedding = openaiData.data[0].embedding;
    } catch (err) {
      console.error("OpenAI Embedding error:", err);
      return res.status(500).json({ error: "OpenAI Embedding error", details: err.message });
    }

    // Step 3: Call Supabase vector search
    let chunks = null;
    try {
      const supabaseRes = await fetch(`${process.env.SUPABASE_URL}/rest/v1/rpc/match_pdf_chunks`, {
        method: 'POST',
        headers: {
          'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query_embedding: embedding,
          match_count: 5,
        }),
      });
      const supabaseData = await supabaseRes.json();
      console.log("Supabase vector search response:", supabaseData);
      if (!supabaseRes.ok) throw new Error(supabaseData.error?.message || 'Supabase match error');
      chunks = supabaseData;
    } catch (err) {
      console.error("Supabase vector search error:", err);
      return res.status(500).json({ error: "Supabase vector search error", details: err.message });
    }

    // Return chunks for now
    return res.status(200).json({
      ok: true,
      method: req.method,
      env: {
        SUPABASE_URL: process.env.SUPABASE_URL,
        SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? "set" : "missing",
        OPENAI_API_KEY: process.env.OPENAI_API_KEY ? "set" : "missing"
      },
      body,
      embedding,
      chunks
    });
  } catch (err) {
    console.error("UNEXPECTED ERROR:", err);
    return res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
} 