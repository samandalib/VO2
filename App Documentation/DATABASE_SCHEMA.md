# Database Schema

## Main Tables

### user_profiles
- `id` (UUID, primary key, matches Supabase Auth user id)
- `email` (text)
- `name` (text)
- `picture` (text)
- `is_admin` (boolean)

**Example SQL:**
```sql
create table user_profiles (
  id uuid primary key references auth.users(id),
  email text,
  name text,
  picture text,
  is_admin boolean default false
);
```

### pdf_chunks (RAG)
- `id` (serial primary key)
- `filename` (text)
- `embedding` (vector)
- ... (other RAG fields)

### Other Tables
- `user_details` (optional, for demographics)
- `chat_history` (if tracking chat)

---
For full schema, see `supabase-schema.sql` and `prisma/schema.prisma`. 