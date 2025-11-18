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

  // Attach shadow DOM for style isolation
  const shadow = rootDiv.attachShadow({ mode: 'open' });
  
  // Create wrapper for React
  const wrapper = document.createElement('div');
  shadow.appendChild(wrapper);
  
  // Inject styles into shadow DOM
  const style = document.createElement('style');
  style.textContent = require('./chat-widget.css?raw');
  shadow.appendChild(style);

  const root = createRoot(wrapper);
  root.render(<ChatWidget />);
})();