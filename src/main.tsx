
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Main } from "./App";

// 创建根元素并渲染
const container = document.getElementById("root");
if (!container)
{
  throw new Error("Root container missing in index.html");
}

// Ensure createRoot() is called only once
const root = createRoot(container);
root.render(
  <StrictMode>
    <Main />
  </StrictMode>
);