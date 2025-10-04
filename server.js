import express from "express";
import cors from "cors";
import multer from "multer";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());
const upload = multer({ storage: multer.memoryStorage() });

app.get("/", (req, res) => res.send("✅ Veo3 AI Video Generator API is live!"));

// --- /video route ---
app.post("/video", upload.single("image"), async (req, res) => {
  try {
    const prompt = req.body.prompt || "Cinematic nature video";
    const image = req.file;

    console.log("📩 Prompt received:", prompt);
    if (image) console.log("📸 Image uploaded:", image.originalname);

    // --- Convert image to Base64 if present ---
    let image_base64 = null;
    if (image) {
      image_base64 = image.buffer.toString("base64");
    }

    // --- Build Veo3 API request ---
    const body = {
      model: "veo3",
      prompt: prompt,
      duration: 5,
      resolution: "720p",
      aspect_ratio: "16:9"
    };

    if (image_base64) {
      body.input_image = "data:" + image.mimetype + ";base64," + image_base64;
    }

    const response = await fetch("https://api.aimlapi.com/v1/veo3/video", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.AIML_API_KEY}`
      },
      body: JSON.stringify(body)
    });

    console.log("🌐 Veo3 API Status:", response.status);
    const text = await response.text();
    console.log("🧾 Veo3 API Raw Response:", text);

    let result;
    try {
      result = JSON.parse(text);
    } catch (e) {
      console.error("⚠️ JSON Parse Error:", e);
      result = { error: text };
    }

    if (result && result.video_url) {
      res.json({ videoUrl: result.video_url });
    } else {
      console.error("❌ Video generation failed:", result);
      res.status(400).json({ error: "Video generation failed", details: result });
    }

  } catch (err) {
    console.error("💥 Internal Server Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(3000, () => console.log("🚀 Server running on port 3000"));
