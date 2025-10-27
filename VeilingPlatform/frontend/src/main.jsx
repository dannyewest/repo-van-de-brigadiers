import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes.jsx";
import { AuctionProvider } from "./context/AuctionContext.jsx";
import 'bootstrap/dist/css/bootstrap.min.css';
import './style/index.scss'

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuctionProvider>
        <AppRoutes />
      </AuctionProvider>
    </BrowserRouter>
  </React.StrictMode>
);