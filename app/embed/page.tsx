import { createRoot } from "react-dom/client";
import { ChatWidget } from "../components/ChatWidget";
import widgetCSS from "./style.css?inline";

declare global {
  interface Window {
    ChatWidgetEmbed?: boolean;
  }
}

(function () {
  // Prevent duplicate injection
  if (window.ChatWidgetEmbed || document.getElementById('chat-widget-embed')) {
    console.warn('Chat widget already initialized');
    return;
  }

  try {
    const container = document.createElement("div");
    container.id = 'chat-widget-embed';
    document.body.appendChild(container);

    const shadow = container.attachShadow({ mode: "open" });

    // Inject styles
    const style = document.createElement("style");
    style.textContent = widgetCSS;
    shadow.appendChild(style);

    // Create root for React
    const root = document.createElement("div");
    root.id = 'chat-widget-root';
    shadow.appendChild(root);

    // Render the widget
    createRoot(root).render(<ChatWidget />);
    
    // Mark as initialized
    window.ChatWidgetEmbed = true;

  } catch (error) {
    console.error('Failed to initialize chat widget:', error);
  }
})();