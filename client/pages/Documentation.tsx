import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

const markdownStyle = {
  maxWidth: '800px',
  margin: '0 auto',
  background: 'var(--background-color, #fff)',
  color: 'var(--foreground-color, #222)',
  borderRadius: '16px',
  padding: '2rem',
  boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
  fontSize: '1.1rem',
};

function formatDocToMarkdown(doc) {
  if (!doc) return '';
  return `
# ${doc.title}

${doc.description}

---

## Pipeline Overview
${doc.pipeline.overview}

### Flow
${doc.pipeline.flow.map((step, i) => `${i + 1}. ${step}`).join('\n')}

---

## Endpoints

### /api/rag-chat
- **Method:** POST
- **Payload:** \`{ query: string }\`
- **Description:** ${doc.pipeline.endpoints.rag_chat.description}

### /api/rag-retrieve
- **Method:** POST
- **Payload:** \`{ query: string }\`
- **Description:** ${doc.pipeline.endpoints.rag_retrieve.description}

---

## PDF Ingestion & Chunking

**Steps:**
${doc.pipeline.pdf_ingestion.steps.map(s => `- ${s}`).join('\n')}

**Notes:**
${doc.pipeline.pdf_ingestion.notes.map(s => `- ${s}`).join('\n')}

---

## Supabase
- **Table:** \`${doc.pipeline.supabase.table}\`
- **Function:** \`${doc.pipeline.supabase.function}\`
- **Description:** ${doc.pipeline.supabase.description}

---

## Future Considerations
${doc.pipeline.future_considerations.map(s => `- ${s}`).join('\n')}
`;
}

export default function Documentation() {
  const [markdown, setMarkdown] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/documentation')
      .then(res => res.json())
      .then(doc => setMarkdown(formatDocToMarkdown(doc)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-primary/10 py-12 px-4 flex flex-col items-center">
      <div style={markdownStyle} className="prose prose-neutral dark:prose-invert w-full">
        {loading ? (
          <div className="text-center text-lg text-muted-foreground">Loading documentation...</div>
        ) : (
          <ReactMarkdown>{markdown}</ReactMarkdown>
        )}
      </div>
    </section>
  );
} 