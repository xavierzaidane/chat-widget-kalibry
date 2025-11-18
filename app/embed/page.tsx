import React from "react";
import { createRoot } from "react-dom/client";
import { ChatWidget } from "../components/ChatWidget";
import cssText from "./chat-widget.css?raw";

declare global {
  interface Window {
    KalibryChat?: {
      init: (config?: any) => void;
    };
  }
}

function initKalibryChat(config?: any) {
  const rootId = "kalibry-chat-widget-root";
  
  // Check if already initialized
  if (document.getElementById(rootId)?.shadowRoot) {
    console.warn("Kalibry Chat already initialized");
    return;
  }

  // Create root container
  let rootDiv = document.getElementById(rootId);
  if (!rootDiv) {
    rootDiv = document.createElement("div");
    rootDiv.id = rootId;
    rootDiv.style.cssText = "all: initial; position: fixed; z-index: 99999;";
    document.body.appendChild(rootDiv);
  }

  // Attach shadow DOM
  const shadow = rootDiv.attachShadow({ mode: "open" });

  // Inject CSS into shadow DOM
  const style = document.createElement("style");
  style.textContent = cssText;
  shadow.appendChild(style);

  // Create React root wrapper
  const wrapper = document.createElement("div");
  wrapper.id = "kalibry-react-root";
  shadow.appendChild(wrapper);

  // Render React component
  const root = createRoot(wrapper);
  root.render(<ChatWidget />);

  // Expose global API
  window.KalibryChat = {
    init: initKalibryChat,
  };
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initKalibryChat);
} else {
  initKalibryChat();
}

// Also expose for manual initialization
window.KalibryChat = {
  init: initKalibryChat,
};