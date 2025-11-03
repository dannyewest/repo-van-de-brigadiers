import React from "react";
import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import AppRoutes from "./routes/AppRoutes";
import "@style/index.scss";

const el = document.getElementById("root");
if (!el) throw new Error("Root element #root not found");
createRoot(el).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </React.StrictMode>
);
