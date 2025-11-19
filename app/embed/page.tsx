import React from "react";
import { createRoot } from "react-dom/client";
import "./chat-widget.css";
import { ChatWidget } from "../components/ChatWidget";

(function () {
  const rootId = "kalibry-chat-widget-root";
  let rootDiv = document.getElementById(rootId);

  if (!rootDiv) {
    rootDiv = document.createElement("div");
    rootDiv.id = rootId;
    document.body.appendChild(rootDiv);
  }

  const root = createRoot(rootDiv);
  root.render(<ChatWidget />);
})();