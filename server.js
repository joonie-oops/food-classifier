import express from "express";
import { Client } from "@gradio/client";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.static("public"));

app.post("/classify", async (req, res) => {
  try {
    const imageUrl = req.body.imageUrl;
    const response = await fetch(imageUrl);
    const imageBuffer = await response.blob();
    console.log("Successfully fetched image buffer");

    const client = await Client.connect("joonieoops/food_classifier");
    console.log("Connected to Gradio client");

    const result = await client.predict("/predict", {
      img: imageBuffer,
    });

    const foodType = result.data[0].label;
    const confidence = (result.data[0].confidences[0].confidence * 100).toFixed(
      1
    );

    res.json({
      message: `Hmm... seems like you are craving some delicious ${foodType}! 😋`,
      confidence: `We are ${confidence}% confident about our guess!`,
    });
  } catch (error) {
    console.error("Error processing image:", error);
    res.json({
      message: "Oops! Something went wrong while analyzing your food image.",
      confidence: "",
    });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
