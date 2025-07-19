import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import { AuthProvider } from "./contexts/SupabaseAuthContext.tsx";
import { AuthProviderV2 } from "./contexts/SupabaseAuthContextV2.tsx";
import "./global.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AuthProviderV2>
          <App />
        </AuthProviderV2>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
