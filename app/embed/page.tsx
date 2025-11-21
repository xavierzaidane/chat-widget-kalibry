import React from "react";
import { createRoot } from "react-dom/client";
import { ChatWidget } from "../components/ChatWidget";
import styles from "./chat-widget.css?inline"; // Tailwind + custom CSS

(function () {
  const rootId = "kalibry-chat-widget-root";
  let container = document.getElementById(rootId);

  if (!container) {
    container = document.createElement("div");
    container.id = rootId;
    document.body.appendChild(container);
  }

  // Shadow DOM untuk isolasi CSS
  const shadow = container.attachShadow({ mode: "open" });

  // Inject CSS ke Shadow DOM
  const styleTag = document.createElement("style");
  styleTag.textContent = styles;
  shadow.appendChild(styleTag);

  // Mount React widget
  const mountEl = document.createElement("div");
  shadow.appendChild(mountEl);

  const root = createRoot(mountEl);
  root.render(<ChatWidget />);
})();
