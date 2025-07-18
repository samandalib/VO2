// scripts/pdf-extract.cjs
const fs = require('fs');
const path = require('path');
let pdfjsLib;
try {
  pdfjsLib = require('pdfjs-dist');
} catch (e1) {
  try {
    pdfjsLib = require('pdfjs-dist/cjs/build/pdf.js');
  } catch (e2) {
    console.error('Could not load pdfjs-dist. Tried both main and cjs/legacy build.');
    process.exit(1);
  }
}

const PDF_DIR = path.join(__dirname, '../pdfs');
const OUTPUT_DIR = path.join(__dirname, '../pdfs-output');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR);
}

async function extractTextFromPDF(pdfPath) {
  const data = new Uint8Array(fs.readFileSync(pdfPath));
  const pdf = await pdfjsLib.getDocument({ data }).promise;
  let text = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map(item => item.str).join(' ') + '\n';
  }
  return text;
}

async function processAllPDFs() {
  const files = fs.readdirSync(PDF_DIR).filter(f => f.endsWith('.pdf'));
  for (const file of files) {
    const outPath = path.join(OUTPUT_DIR, file.replace(/\.pdf$/i, '.txt'));
    if (fs.existsSync(outPath)) {
      console.log(`Skipping (already processed): ${file}`);
      continue;
    }
    const pdfPath = path.join(PDF_DIR, file);
    console.log(`Extracting: ${file}`);
    try {
      const text = await extractTextFromPDF(pdfPath);
      fs.writeFileSync(outPath, text, 'utf8');
      console.log(`Saved: ${outPath}`);
    } catch (err) {
      console.error(`Failed to process ${file}:`, err);
    }
  }
}

processAllPDFs(); 