import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
// import TestMode from './test-components/TestMode.jsx';

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
    {/* <TestMode /> */}
  </StrictMode>,
);
