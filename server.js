import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "images")));

const client = new MongoClient(process.env.MONGODB_URI);
let lessonsCollection;

async function connectDB() {
  await client.connect();
  const db = client.db("afterschool");
  lessonsCollection = db.collection("lessons");
  console.log("MongoDB connected");
}

app.get("/lessons", async (req, res) => {
  const lessons = await lessonsCollection.find({}).toArray();
  res.json(lessons);
});

app.post("/order", async (req, res) => {
  const cart = req.body.cart;

  if (!Array.isArray(cart)) return res.status(400).json({ message: "Invalid cart" });

  for (let item of cart) {
    const lesson = await lessonsCollection.findOne({ _id: item._id });

    if (!lesson || lesson.space < item.quantity) {
      return res.status(400).json({ message: "Not enough space" });
    }
  }

  for (let item of cart) {
    await lessonsCollection.updateOne(
      { _id: item._id },
      { $inc: { space: -item.quantity } }
    );
  }

  res.json({ message: "Booking successful" });
});

app.listen(3000, () => console.log("Server running on port 3000"));

connectDB();
