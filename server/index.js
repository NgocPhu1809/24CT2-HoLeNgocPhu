import "dotenv/config";
import cors from "cors";
import express from "express";
import { pool } from "./config/database.js";
import booksRoutes from "./routes/booksRoutes.js";
import ordersRoutes from "./routes/ordersRoutes.js";
import usersRoutes from "./routes/usersRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use((error, _req, res, next) => {
  if (error.type === "entity.parse.failed") {
    return res.status(400).json({ message: "Dữ liệu JSON không hợp lệ" });
  }
  next(error);
});

app.get("/api/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ ok: true, database: "connected" });
  } catch (error) {
    res.status(503).json({ ok: false, message: error.message });
  }
});

app.use("/api/books", booksRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/orders", ordersRoutes);

app.listen(process.env.PORT || 3001, () => console.log("ShopBooks API running on port " + (process.env.PORT || 3001)));
