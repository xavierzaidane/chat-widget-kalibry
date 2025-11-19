import { createRoot } from "react-dom/client";
import { ChatWidget } from "../components/ChatWidget";
import widgetCSS from "./chat-widget.css?inline";

(function () {
  const container = document.createElement("div");
  document.body.appendChild(container);

  const shadow = container.attachShadow({ mode: "open" });

  const style = document.createElement("style");
  style.textContent = widgetCSS;
  shadow.appendChild(style);

  const root = document.createElement("div");
  shadow.appendChild(root);

  createRoot(root).render(<ChatWidget />);
})();

