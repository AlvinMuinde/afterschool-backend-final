import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGODB_URI;
const DB_NAME = "afterschool";

app.use(cors());
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "images")));

let lessons = [];

MongoClient.connect(MONGO_URI)
  .then((client) => {
    const db = client.db(DB_NAME);
    const lessonsCollection = db.collection("lessons");

    app.get("/", (req, res) => {
      res.send("Afterschool Backend is Running ✅");
    });

    app.get("/lessons", async (req, res) => {
      const data = await lessonsCollection.find().toArray();
      lessons = data;
      res.json(data);
    });

    app.post("/order", async (req, res) => {
      const { cart } = req.body;
      if (!cart || !Array.isArray(cart)) {
        return res.status(400).json({ message: "Invalid cart data." });
      }

      let failed = false;

      for (const item of cart) {
        const lesson = await lessonsCollection.findOne({ _id: new ObjectId(item._id) });

        if (!lesson || lesson.spaces < item.quantity) {
          failed = true;
          break;
        }
      }

      if (failed) {
        return res.status(400).json({ message: "Booking failed. Not enough space available." });
      }

      for (const item of cart) {
        await lessonsCollection.updateOne(
          { _id: new ObjectId(item._id) },
          { $inc: { spaces: -item.quantity } }
        );
      }

      res.json({ message: "Booking successful." });
    });

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("DB connection error:", error);
  });
