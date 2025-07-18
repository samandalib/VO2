// scripts/pdf-chunk-embed-upload.cjs
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
console.log('Loaded env:', process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, process.env.OPENAI_API_KEY);
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

// === CONFIG ===
const PDF_OUTPUT_DIR = path.join(__dirname, '../pdfs-output');
const CHUNK_SIZE = 800;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const SUPABASE_TABLE = 'pdf_chunks';
const OPENAI_EMBEDDING_MODEL = 'text-embedding-ada-002';

if (!SUPABASE_URL || !SUPABASE_KEY || !OPENAI_API_KEY) {
  console.error('Please set SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, and OPENAI_API_KEY in your environment.');
  process.exit(1);
}

function chunkText(text, size = CHUNK_SIZE) {
  const chunks = [];
  let i = 0;
  while (i < text.length) {
    let end = i + size;
    // Try to break at a sentence boundary if possible
    if (end < text.length) {
      let period = text.lastIndexOf('.', end);
      if (period > i + size / 2) end = period + 1;
    }
    chunks.push(text.slice(i, end).trim());
    i = end;
  }
  return chunks.filter(Boolean);
}

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

async function uploadChunkToSupabase(filename, chunkIndex, chunkText, embedding) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${SUPABASE_TABLE}`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal',
    },
    body: JSON.stringify([
      {
        filename,
        chunk_index: chunkIndex,
        chunk_text: chunkText,
        embedding,
      },
    ]),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Supabase upload error: ${err}`);
  }
}

async function processAllTxts() {
  const files = fs.readdirSync(PDF_OUTPUT_DIR).filter(f => f.endsWith('.txt'));
  for (const file of files) {
    const filePath = path.join(PDF_OUTPUT_DIR, file);
    const text = fs.readFileSync(filePath, 'utf8');
    const chunks = chunkText(text);
    console.log(`Processing ${file}: ${chunks.length} chunks`);
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      try {
        const embedding = await getEmbedding(chunk);
        await uploadChunkToSupabase(file, i, chunk, embedding);
        console.log(`Uploaded: ${file} [chunk ${i}]`);
      } catch (err) {
        console.error(`Failed to process chunk ${i} of ${file}:`, err);
      }
    }
  }
}

processAllTxts(); 