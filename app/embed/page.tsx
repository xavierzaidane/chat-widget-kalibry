import React from "react";
import { createRoot } from "react-dom/client";
import "./chat-widget.css";
import { ChatWidget } from "../components/ChatWidget";

/**
 * Ensure widget can read API URL when injected:
 * - chatbot.liquid should set window.__KALIBRY_WIDGET_CONFIG__ or add data-chat-api-url on the script tag.
 * - This init block copies dataset into window config as a fallback so route.ts can read it.
 */
(function initWidget() {
  try {
    const win = (window as any);
    if (!win.__KALIBRY_WIDGET_CONFIG__) {
      // Try currentScript first, then any script with data-chat-api-url
      const cs = document.currentScript as HTMLScriptElement | null;
      const script = cs?.dataset?.chatApiUrl ? cs : document.querySelector('script[data-chat-api-url]') as HTMLScriptElement | null;
      const api = script?.dataset?.chatApiUrl || '';
      win.__KALIBRY_WIDGET_CONFIG__ = { CHAT_API_URL: api };
    }
  } catch (e) {
    // ignore in non-browser environments
  }

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