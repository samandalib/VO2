// No import needed for fetch in Node.js 18+ on Vercel

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_EMBEDDING_MODEL = 'text-embedding-ada-002';
const TOP_K = 5;

async function getEmbedding(text) {
  const res = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      input: text,
      model: OPENAI_EMBEDDING_MODEL,
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'OpenAI embedding error');
  return data.data[0].embedding;
}

async function retrieveChunks(query) {
  const embedding = await getEmbedding(query);
  // Supabase pgvector similarity search
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/match_pdf_chunks`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query_embedding: embedding,
      match_count: TOP_K,
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'Supabase match error');
  return data;
}

export default async function handler(req, res) {
  try {
    console.log('rag-retrieve invoked:', req.method, req.body);
    console.log('SUPABASE_URL:', SUPABASE_URL);
    console.log('SUPABASE_KEY:', SUPABASE_KEY ? 'set' : 'missing');
    console.log('OPENAI_API_KEY:', OPENAI_API_KEY ? 'set' : 'missing');
    if (!SUPABASE_URL || !SUPABASE_KEY || !OPENAI_API_KEY) {
      return res.status(500).json({ error: 'Missing required environment variables' });
    }
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method Not Allowed' });
    }
    let query;
    try {
      query = req.body.query;
    } catch (e) {
      return res.status(400).json({ error: 'Invalid JSON body' });
    }
    if (!query) {
      return res.status(400).json({ error: 'Missing query' });
    }
    const results = await retrieveChunks(query);
    res.status(200).json({ chunks: results });
  } catch (err) {
    console.error('RAG Retrieve Error:', err);
    res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
} 