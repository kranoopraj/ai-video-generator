import express from "express";
import multer from "multer";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
const upload = multer({ storage: multer.memoryStorage() });

app.post("/video", upload.single("image"), async (req, res) => {
  try {
    const prompt = req.body.prompt || "Cinematic short video of nature";
    const image = req.file;

    // Build request to Veo3 API via AIMLAPI
    const formData = new FormData();
    formData.append("prompt", prompt);
    if (image) {
      formData.append("image", image.buffer, image.originalname);
    }

    const response = await fetch("https://api.aimlapi.com/v1/veo3/video", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.AIML_API_KEY}`
      },
      body: formData
    });

    const result = await response.json();

    if (result && result.video_url) {
      res.json({ videoUrl: result.video_url });
    } else {
      console.error("Unexpected response:", result);
      res.status(400).json({ error: "Video generation failed", details: result });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/", (req, res) => res.send("✅ Veo3 AI Video Generator API is live!"));

app.listen(3000, () => console.log("Server running on port 3000"));
