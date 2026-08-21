import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/tokens.css";
import "./styles/responsive.css";
import App from "./App";

const rootElement = document.getElementById("root");

// react-snap injects prerendered markup into #root before hydration runs.
// If it has children, hydrate; otherwise this is a normal fresh client render.
if (rootElement.hasChildNodes()) {
  ReactDOM.hydrateRoot(rootElement, <App />);
} else {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
}
