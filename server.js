import express from "express";
import multer from "multer";
import fetch from "node-fetch";
import cors from "cors";
import FormData from "form-data"; // ✅ required for Node environment

const app = express();
app.use(cors());
const upload = multer({ storage: multer.memoryStorage() });

app.post("/video", upload.single("image"), async (req, res) => {
  try {
    const prompt = req.body.prompt || "Cinematic video of nature";
    const image = req.file;

    const formData = new FormData();
    formData.append("prompt", prompt);
    if (image) {
      formData.append("image", image.buffer, image.originalname);
    }

    const response = await fetch("https://api.aimlapi.com/v1/veo3/video", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.AIML_API_KEY}` },
      body: formData,
    });

    const result = await response.json();
    console.log("Veo3 API result:", result);

    if (result.video_url) {
      res.json({ videoUrl: result.video_url });
    } else {
      res.status(400).json({ error: "Video generation failed", details: result });
    }
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/", (req, res) => res.send("✅ Veo3 AI Video Generator API is live!"));

app.listen(3000, () => console.log("Server running on port 3000"));
