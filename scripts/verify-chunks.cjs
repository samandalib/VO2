// scripts/verify-chunks.cjs
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const readline = require('readline');

const PDF_OUTPUT_DIR = path.join(__dirname, '../pdfs-output');
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_TABLE = 'pdf_chunks';

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your environment.');
  process.exit(1);
}

function chunkText(text, size = 800) {
  const chunks = [];
  let i = 0;
  while (i < text.length) {
    let end = i + size;
    if (end < text.length) {
      let period = text.lastIndexOf('.', end);
      if (period > i + size / 2) end = period + 1;
    }
    chunks.push(text.slice(i, end).trim());
    i = end;
  }
  return chunks.filter(Boolean);
}

async function getSupabaseChunks() {
  let all = [];
  let from = 0;
  const pageSize = 1000;
  while (true) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${SUPABASE_TABLE}?select=filename,chunk_index&order=filename.asc,chunk_index.asc&offset=${from}&limit=${pageSize}`, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
    });
    const data = await res.json();
    if (!Array.isArray(data)) throw new Error('Supabase query error: ' + JSON.stringify(data));
    all = all.concat(data);
    if (data.length < pageSize) break;
    from += pageSize;
  }
  return all;
}

async function getEmbedding(text) {
  const res = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      input: text,
      model: 'text-embedding-ada-002',
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

async function verifyChunks() {
  // 1. Get all local (filename, chunk_index) pairs
  const localPairs = [];
  const files = fs.readdirSync(PDF_OUTPUT_DIR).filter(f => f.endsWith('.txt'));
  for (const file of files) {
    const filePath = path.join(PDF_OUTPUT_DIR, file);
    const text = fs.readFileSync(filePath, 'utf8');
    const chunks = chunkText(text);
    for (let i = 0; i < chunks.length; i++) {
      localPairs.push({ filename: file, chunk_index: i });
    }
  }
  // 2. Get all uploaded pairs from Supabase
  const uploadedPairs = await getSupabaseChunks();
  // 3. Find missing pairs
  const uploadedSet = new Set(uploadedPairs.map(p => `${p.filename}::${p.chunk_index}`));
  const missing = localPairs.filter(p => !uploadedSet.has(`${p.filename}::${p.chunk_index}`));
  if (missing.length === 0) {
    console.log('All local chunks are uploaded to Supabase!');
  } else {
    console.log('Missing chunks:');
    missing.forEach(p => console.log(`${p.filename} [chunk ${p.chunk_index}]`));
    console.log(`Total missing: ${missing.length}`);

    // Prompt for confirmation
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question('Do you want to re-upload missing chunks? (y/N): ', async (answer) => {
      rl.close();
      if (answer.trim().toLowerCase() === 'y') {
        for (const p of missing) {
          const filePath = path.join(PDF_OUTPUT_DIR, p.filename);
          const text = fs.readFileSync(filePath, 'utf8');
          const chunks = chunkText(text);
          const chunkTextVal = chunks[p.chunk_index];
          try {
            const embedding = await getEmbedding(chunkTextVal);
            await uploadChunkToSupabase(p.filename, p.chunk_index, chunkTextVal, embedding);
            console.log(`Uploaded: ${p.filename} [chunk ${p.chunk_index}]`);
          } catch (err) {
            console.error(`Failed to upload ${p.filename} [chunk ${p.chunk_index}]:`, err);
          }
        }
        console.log('Re-upload complete.');
      } else {
        console.log('No chunks were re-uploaded.');
      }
    });
  }
  console.log(`Local chunks: ${localPairs.length}, Uploaded: ${uploadedPairs.length}`);
}

verifyChunks(); 