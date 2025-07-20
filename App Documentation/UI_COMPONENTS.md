# UI Components & Usage

## Main Areas
- **Dashboard:**
  - `DashboardLayout`, `DashboardHeader`, `ActiveProtocolCard`, `ProgressStatsGrid`, `ProgressChartSection`, `TrackingSectionsLayout`, `ProtocolCalendarView`, `WeeklyTrackingPanel`, `SessionMetricsLogging`, `BloodBiomarkerSection`, `ProfileModal`, `BottomNavigation`, `LoggingModal`, `FloatingChat`
- **Authentication:**
  - `AuthModal`, `SimpleAuthModal`, `DevAuthModal`
- **RAG Admin:**
  - `pages/admin/RagAdmin.tsx` (main admin UI)
  - `components/ui/UserInfo.tsx` (user info display)
- **Shared UI Elements:**
  - `components/ui/` (button, card, badge, dialog, table, etc.)
  - `lucide-react` icons
  - `shadcn/ui` custom components

## Usage
- Import from `@/components/...` or `@/components/ui/...`
- Compose in pages (e.g., `Dashboard.tsx`, `Index.tsx`)
- Use props for customization (see each component's file)

---
For full list, see the `client/components/` directory. 