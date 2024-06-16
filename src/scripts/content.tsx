import { StrictMode } from "react";
import * as ReactDOM from "react-dom/client";

import ContentBookmark from "@/modules/ContentBookmark";

const root = document.createElement("div");

root.id = "grace-ext-root";

document.body.appendChild(root);

ReactDOM.createRoot(root).render(
  <StrictMode>
    <ContentBookmark />
  </StrictMode>,
);
