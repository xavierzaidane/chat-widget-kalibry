import React from "react";
import { createRoot } from "react-dom/client";
import { ChatWidget } from "../components/ChatWidget";

(function () {
  const rootId = "kalibry-chat-widget-root";
  let rootDiv = document.getElementById(rootId);

  if (!rootDiv) {
    rootDiv = document.createElement("div");
    rootDiv.id = rootId;
    document.body.appendChild(rootDiv);
  }

  const shadow = rootDiv.attachShadow({ mode: "open" });
  const wrapper = document.createElement("div");
  shadow.appendChild(wrapper);

  const root = createRoot(wrapper);
  root.render(<ChatWidget />);
})();
