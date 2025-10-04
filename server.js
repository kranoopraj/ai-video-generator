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

    const response = await fetch("https://api.aimlapi.com/v1/veo3/video", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${process.env.AIML_API_KEY}`
  },
  body: JSON.stringify({
    prompt: prompt,
    duration: 5, // example
    resolution: "720p"
  })
});

app.get("/", (req, res) => res.send("✅ Veo3 AI Video Generator API is live!"));

app.listen(3000, () => console.log("Server running on port 3000"));
