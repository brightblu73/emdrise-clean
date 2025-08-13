import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { installAuthListener } from './lib/auth';

createRoot(document.getElementById("root")!).render(<App />);

// Install global sign-out listener (multi-tab safety)
try {
  installAuthListener(() => { window.location.assign('/'); });
} catch (e) {
  console.warn('Auth listener not installed:', e);
}
