import express from "express";
import multer from "multer";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
const upload = multer({ storage: multer.memoryStorage() });

app.post("/video", upload.single("image"), async (req, res) => {
  try {
    const prompt = req.body.prompt || "A cinematic video";
    const image = req.file;

    // Example: calling Pika Labs / Runway API (replace this with real one)
    const response = await fetch("https://api.runwayml.com/v1/videos", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.RUNWAY_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        prompt: prompt,
        aspect_ratio: "16:9"
      })
    });

    const result = await response.json();
    const videoUrl = result.output?.[0]?.url || result.output_url;

    if (!videoUrl) {
      return res.status(400).json({ error: "No video generated." });
    }

    res.json({ videoUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Video generation failed." });
  }
});

app.get("/", (req, res) => res.send("AI Video Generator API is live ✅"));

app.listen(3000, () => console.log("Server running on port 3000"));
