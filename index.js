import { createRoot } from "react-dom/client";

import App from "./App";

const rootElement = document.querySelector("body");
const root = createRoot(rootElement);

root.render(<App />);
