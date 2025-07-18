export default function handler(req, res) {
  res.status(200).json({
    title: "VO2MaxApp RAG Pipeline Documentation",
    description: "This documentation describes the Retrieval-Augmented Generation (RAG) pipeline for the VO2MaxApp, including design, endpoints, PDF ingestion, chunking, embedding, uploading, and future considerations.",
    pipeline: {
      overview: "The RAG pipeline enables users to query research PDFs using OpenAI LLMs with context retrieved from a Supabase vector store.",
      flow: [
        "User submits a query via the frontend (e.g., /RagAIAssistantHero)",
        "Frontend sends POST to /api/rag-chat with { query }",
        "rag-chat calls /api/rag-retrieve to get top-k relevant chunks from Supabase",
        "rag-retrieve embeds the query using OpenAI, then calls Supabase RPC for vector similarity search",
        "rag-retrieve returns the top chunks to rag-chat",
        "rag-chat builds a context-augmented prompt and streams the answer from OpenAI back to the frontend"
      ],
      endpoints: {
        rag_chat: {
          path: "/api/rag-chat",
          method: "POST",
          payload: { query: "string" },
          description: "Main RAG chat endpoint. Retrieves relevant chunks and streams an OpenAI answer."
        },
        rag_retrieve: {
          path: "/api/rag-retrieve",
          method: "POST",
          payload: { query: "string" },
          description: "Retrieves top-k relevant chunks from Supabase using OpenAI embeddings."
        }
      },
      pdf_ingestion: {
        steps: [
          "Place new PDFs in the /pdfs directory.",
          "Run the script scripts/pdf-extract.cjs to extract text from PDFs.",
          "Run scripts/pdf-chunk-embed-upload.cjs to chunk the text, embed with OpenAI, and upload to Supabase (pdf_chunks table).",
          "Each chunk is stored with its embedding, filename, chunk index, and text."
        ],
        notes: [
          "You must have your Supabase and OpenAI API keys set in your environment.",
          "Chunk size and overlap can be configured in the chunking script.",
          "Embeddings use OpenAI's text-embedding-ada-002 model (1536 dims)."
        ]
      },
      supabase: {
        table: "pdf_chunks",
        function: "match_pdf_chunks(query_embedding vector, match_count int)",
        description: "Stores all document chunks and their embeddings. The match_pdf_chunks function performs a pgvector similarity search."
      },
      future_considerations: [
        "Add support for document metadata (author, year, tags) in pdf_chunks table.",
        "Implement chunk deduplication and better chunking strategies (e.g., overlap, sentence boundaries).",
        "Add user-specific document upload and access control.",
        "Support for re-embedding with new models as they become available.",
        "Add admin UI for PDF/document management.",
        "Monitor and handle OpenAI/Supabase API rate limits and errors gracefully.",
        "Add logging and analytics for query usage and retrieval quality."
      ]
    }
  });
} 