import React from "react";
import { createRoot } from "react-dom/client";
import cssText from "./chat-widget.css?raw";
import { ChatWidget } from "../components/ChatWidget";

(function () {
  const rootId = "kalibry-chat-widget-root";
  let rootDiv = document.getElementById(rootId);

  if (!rootDiv) {
    rootDiv = document.createElement("div");
    rootDiv.id = rootId;
    document.body.appendChild(rootDiv);
  }

  // Attach Shadow DOM for full style isolation
  const shadow = rootDiv.attachShadow({ mode: "open" });

  // Inject widget CSS into shadow root
  const styleEl = document.createElement("style");
  styleEl.textContent = cssText;
  shadow.appendChild(styleEl);

  // Create container inside shadow for React to mount
  const wrapper = document.createElement("div");
  shadow.appendChild(wrapper);

  const root = createRoot(wrapper);
  root.render(<ChatWidget />);
})();