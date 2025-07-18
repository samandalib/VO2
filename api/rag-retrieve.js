// No import needed for fetch in Node.js 18+ on Vercel

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const SUPABASE_TABLE = 'pdf_chunks';
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
  console.log('rag-retrieve invoked:', req.method, req.body);
  console.log('SUPABASE_URL:', SUPABASE_URL);
  console.log('SUPABASE_KEY:', SUPABASE_KEY ? 'set' : 'missing');
  console.log('OPENAI_API_KEY:', OPENAI_API_KEY ? 'set' : 'missing');
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }
  const { query } = req.body;
  if (!query) {
    res.status(400).json({ error: 'Missing query' });
    return;
  }
  try {
    const results = await retrieveChunks(query);
    res.status(200).json({ chunks: results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
} 