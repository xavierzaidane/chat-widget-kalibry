import React from "react";
import { createRoot } from "react-dom/client";
import { ChatWidget } from "../components/ChatWidget";
import styles from "./chat-widget.css?inline";

(function () {
  const rootId = "kalibry-chat-widget-root";
  let container = document.getElementById(rootId);

  if (!container) {
    container = document.createElement("div");
    container.id = rootId;
    document.body.appendChild(container);
  }

  const shadow = container.attachShadow({ mode: "open" });

  const styleTag = document.createElement("style");
  styleTag.textContent = styles; // Tailwind v4 + custom CSS
  shadow.appendChild(styleTag);

  const mountEl = document.createElement("div");
  shadow.appendChild(mountEl);

  const root = createRoot(mountEl);
  root.render(<ChatWidget />);
})();
