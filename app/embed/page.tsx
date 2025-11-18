import React from "react";
import { createRoot } from "react-dom/client";
import { ChatWidget } from "../components/ChatWidget";
import cssText from "./chat-widget.css?raw";

(function () {
  const rootId = "kalibry-chat-widget-root";
  let rootDiv = document.getElementById(rootId);

  if (!rootDiv) {
    rootDiv = document.createElement("div");
    rootDiv.id = rootId;
    document.body.appendChild(rootDiv);
  }

  // Attach shadow DOM for style isolation
  const shadow = rootDiv.attachShadow({ mode: 'open' });
  
  // Create wrapper for React
  const wrapper = document.createElement('div');
  shadow.appendChild(wrapper);
  
  // Inject styles into shadow DOM
  const style = document.createElement('style');
  style.textContent = cssText;
  shadow.appendChild(style);

  const root = createRoot(wrapper);
  root.render(<ChatWidget />);
})();