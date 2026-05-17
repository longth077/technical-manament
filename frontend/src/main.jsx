import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Remove the HTML loading overlay once React has painted
requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    const loader = document.getElementById("app-loading");
    if (loader) loader.classList.add("hidden");
  });
});
