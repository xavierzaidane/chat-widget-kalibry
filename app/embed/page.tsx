import { createRoot } from "react-dom/client";
import { ChatWidget } from "../components/ChatWidget";
import widgetCSS from "./chat-widget.css?inline";

(function () {
  const container = document.createElement("div");
  document.body.appendChild(container);

  const shadow = container.attachShadow({ mode: "open" });

  // inject CSS
  const style = document.createElement("style");
  style.textContent = widgetCSS;
  shadow.appendChild(style);

  // root div untuk React
  const rootDiv = document.createElement("div");
  shadow.appendChild(rootDiv);

  const root = createRoot(rootDiv);
  root.render(<ChatWidget />);
})();
