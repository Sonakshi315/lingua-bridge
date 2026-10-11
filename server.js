import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/languages", async (req, res) => {
  try {
    const response = await fetch(
      "http://127.0.0.1:5000/languages"
    );

    const languages = await response.json();

    res.json(languages);
  } catch (error) {
    console.error("Language loading error:", error);
    res.status(500).json({
      error: "Could not load available languages."
    });
  }
});
app.post("/api/translate", async (req, res) => {
  try {
    const { text, source, target } = req.body;

    const response = await fetch("http://127.0.0.1:5000/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        q: text,
        source,
        target,
        format: "text"
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error || "Translation failed"
      });
    }

    res.json({ translatedText: data.translatedText });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Could not connect to LibreTranslate."
    });
  }
});

app.listen(3001, () => {
  console.log("Translation server running at http://localhost:3001");
});