import { createRoot } from "react-dom/client";
import "./index.css";

const root = createRoot(document.getElementById("root")!);

if (window.location.pathname.startsWith("/admin")) {
    import("./admin/AdminApp").then(({ default: AdminApp }) => {
        root.render(<AdminApp />);
    });
} else {
    import("./app/App").then(({ default: App }) => {
        root.render(<App />);
    });
}
