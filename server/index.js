import "dotenv/config";
import cors from "cors";
import express from "express";
import mysql from "mysql2/promise";

const app = express();
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "shopbooks",
  waitForConnections: true,
  connectionLimit: 10,
});

app.use(cors());
app.use(express.json());

app.get("/api/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ ok: true, database: "connected" });
  } catch (error) {
    res.status(503).json({ ok: false, message: error.message });
  }
});

app.get("/api/books", async (_req, res) => {
  const [rows] = await pool.query("SELECT * FROM books ORDER BY id DESC");
  res.json(rows);
});
app.post("/api/books", async (req, res) => {
  const { name, category, price, image, description = "", stock = 0 } = req.body;
  const [result] = await pool.execute("INSERT INTO books (name, category, price, image, description, stock) VALUES (?, ?, ?, ?, ?, ?)", [name, category, price, image, description, stock]);
  res.status(201).json({ id: result.insertId });
});
app.put("/api/books/:id", async (req, res) => {
  const { name, category, price, image, description = "", stock = 0 } = req.body;
  await pool.execute("UPDATE books SET name=?, category=?, price=?, image=?, description=?, stock=? WHERE id=?", [name, category, price, image, description, stock, req.params.id]);
  res.sendStatus(204);
});

app.get("/api/orders", async (_req, res) => {
  const [orders] = await pool.query("SELECT * FROM orders ORDER BY created_at DESC");
  const [items] = await pool.query("SELECT * FROM order_items");
  res.json(orders.map((order) => ({ ...order, items: items.filter((item) => item.order_id === order.id).map((item) => ({ id: item.book_id, name: item.book_name, price: item.price, quantity: item.quantity })) })));
});
app.patch("/api/orders/:id/status", async (req, res) => {
  await pool.execute("UPDATE orders SET status=? WHERE id=?", [req.body.status, req.params.id]);
  res.sendStatus(204);
});

app.listen(process.env.PORT || 3001, () => console.log("ShopBooks API running on port " + (process.env.PORT || 3001)));
