import { StrictMode } from "react";
import * as ReactDOM from "react-dom/client";

import Bookmarks from "@/modules/Bookmarks";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Bookmarks />
  </StrictMode>,
);
