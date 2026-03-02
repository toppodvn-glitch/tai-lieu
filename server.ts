import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("leads.db");

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post("/api/leads", async (req, res) => {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required" });
    }

    try {
      // 1. Save to local database
      const stmt = db.prepare("INSERT INTO leads (name, email) VALUES (?, ?)");
      stmt.run(name, email);

      // 2. Sync with Mautic (Optional but recommended)
      const mauticUrl = process.env.MAUTIC_URL;
      const mauticFormId = process.env.MAUTIC_FORM_ID;

      if (mauticUrl && mauticFormId) {
        try {
          // Mautic Form Submission endpoint
          const submitUrl = `${mauticUrl.replace(/\/$/, "")}/form/submit?formId=${mauticFormId}`;
          
          // Prepare form data for Mautic
          // Mautic expects fields in the format mautic_form[alias]
          const formData = new URLSearchParams();
          formData.append(`mautic_form[f_name]`, name); // Assuming 'f_name' is the alias in Mautic
          formData.append(`mautic_form[email]`, email);
          formData.append(`mautic_form[formId]`, mauticFormId);
          formData.append(`mautic_form[return]`, ""); // Optional return URL

          // Send to Mautic
          const mauticResponse = await fetch(submitUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              "X-Requested-With": "XMLHttpRequest",
            },
            body: formData.toString(),
          });

          if (!mauticResponse.ok) {
            console.warn("Mautic sync failed:", await mauticResponse.text());
          } else {
            console.log("Successfully synced with Mautic");
          }
        } catch (mauticError) {
          console.error("Error syncing with Mautic:", mauticError);
          // We don't fail the whole request if Mautic fails, 
          // as the lead is already saved locally.
        }
      }

      res.status(201).json({ success: true });
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ error: "Failed to save lead" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist/index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
