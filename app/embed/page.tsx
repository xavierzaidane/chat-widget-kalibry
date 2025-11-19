import React from "react";
import { createRoot } from "react-dom/client";
import { ChatWidget } from "../components/ChatWidget";
import widgetCSS from "./chat-widget.css?inline";

(function () {
  const rootId = "kalibry-chat-widget-root";
  let rootDiv = document.getElementById(rootId);

  if (!rootDiv) {
    rootDiv = document.createElement("div");
    rootDiv.id = rootId;
    document.body.appendChild(rootDiv);
  }

  // Attach shadow root
  const shadow = rootDiv.attachShadow({ mode: "open" });

  // Inject CSS ke shadow tree
  const style = document.createElement("style");
  style.textContent = widgetCSS;
  shadow.appendChild(style);

  // Tempat React render
  const app = document.createElement("div");
  shadow.appendChild(app);

  const root = createRoot(app);
  root.render(<ChatWidget />);
})();
