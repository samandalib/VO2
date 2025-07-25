import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { Dashboard } from "./pages/Dashboard";
import { ProtocolPicker } from "./pages/ProtocolPicker";
import AuthCallback from "./pages/AuthCallback";
import EmailConfirmation from "./pages/EmailConfirmation";
import TestAIAssistantHero from "@/pages/TestAIAssistantHero";
import RagAIAssistantHeroPage from "./pages/RagAIAssistantHero";
import Documentation from "./pages/Documentation";
import { RagAdmin } from "./pages/admin/RagAdmin";

import { ThemeProvider } from "@/contexts/ThemeContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />

        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/protocols" element={<ProtocolPicker />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/confirm" element={<EmailConfirmation />} />
          <Route path="/test-ai-hero" element={<TestAIAssistantHero />} />
          <Route path="/RagAIAssistantHero" element={<RagAIAssistantHeroPage />} />
          <Route path="/Documentation" element={<Documentation />} />
          <Route path="/admin/rag" element={<RagAdmin />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
