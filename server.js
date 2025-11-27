import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "images")));

const client = new MongoClient(process.env.MONGODB_URI);
let db, lessons;

client.connect().then(() => {
  db = client.db("afterschool");
  lessons = db.collection("lessons");
  console.log("Connected to MongoDB");
}).catch(err => console.error("MongoDB Connection Failed:", err));

app.get("/", (req, res) => res.send("Backend running"));

app.get("/lessons", async (req, res) => {
  const all = await lessons.find().toArray();
  res.json(all);
});

app.post("/order", async (req, res) => {
  try {
    const cart = req.body.cart;

    if (!cart || !Array.isArray(cart))
      return res.status(400).json({ message: "Invalid cart" });

    for (const item of cart) {
      const lesson = await lessons.findOne({ _id: item._id }); // NO ObjectId

      if (!lesson)
        return res.status(500).json({ message: "Lesson not found" });

      if (lesson.space < item.quantity)
        return res.status(400).json({ message: "Not enough space" });

      await lessons.updateOne(
        { _id: item._id },
        { $inc: { space: -item.quantity } }
      );
    }

    res.json({ message: "Booking successful" });
  } catch (e) {
    console.error("ORDER ERROR:", e);
    res.status(500).json({ message: "Server error. Details in console." });
  }
});

app.listen(PORT, () => console.log("Server running on port", PORT));
