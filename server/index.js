import "dotenv/config";
import crypto from "node:crypto";
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
app.use((error, _req, res, next) => {
  if (error.type === "entity.parse.failed") {
    return res.status(400).json({ message: "Dữ liệu JSON không hợp lệ" });
  }
  next(error);
});

const hashPassword = (password) => crypto.createHash("sha256").update(password).digest("hex");

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
app.delete("/api/books/:id", async (req, res) => {
  await pool.execute("DELETE FROM books WHERE id=?", [req.params.id]);
  res.sendStatus(204);
});

app.get("/api/users", async (_req, res) => {
  const [rows] = await pool.query("SELECT id, full_name AS hoTen, email, password_hash AS matKhau, role AS vaiTro FROM users ORDER BY id DESC");
  res.json(rows);
});
app.post("/api/users/register", async (req, res) => {
  const { fullName, email, password } = req.body;
  if (!fullName?.trim() || !email?.trim() || !password) return res.status(400).json({ message: "Thiếu thông tin đăng ký" });
  try {
    const [result] = await pool.execute("INSERT INTO users (full_name, email, password_hash, role) VALUES (?, ?, ?, 'KhachHang')", [fullName.trim(), email.trim().toLowerCase(), hashPassword(password)]);
    res.status(201).json({ id: result.insertId, hoTen: fullName.trim(), email: email.trim().toLowerCase(), vaiTro: "KhachHang" });
  } catch (error) {
    res.status(error.code === "ER_DUP_ENTRY" ? 409 : 500).json({ message: error.code === "ER_DUP_ENTRY" ? "Email này đã được đăng ký" : error.message });
  }
});
app.post("/api/users/login", async (req, res) => {
  const { email, password } = req.body;
  const [rows] = await pool.execute("SELECT id, full_name AS hoTen, email, password_hash, role AS vaiTro FROM users WHERE email=? LIMIT 1", [email?.trim().toLowerCase()]);
  const user = rows[0];
  if (!user || user.password_hash !== hashPassword(password || "")) return res.status(401).json({ message: "Email hoặc mật khẩu không chính xác" });
  const { password_hash: _passwordHash, ...safeUser } = user;
  res.json(safeUser);
});

app.get("/api/orders", async (_req, res) => {
  const [orders] = await pool.query("SELECT * FROM orders ORDER BY created_at DESC");
  const [items] = await pool.query("SELECT * FROM order_items");
  res.json(orders.map((order) => ({
    ...order,
    customer: order.customer_name,
    customerEmail: order.customer_email,
    createdAt: order.created_at,
    payment: order.payment_method === "Chuyển khoản" ? "BANK" : "COD",
    items: items.filter((item) => item.order_id === order.id).map((item) => ({ id: item.book_id, name: item.book_name, price: item.price, quantity: item.quantity })),
  })));
});
app.post("/api/orders", async (req, res) => {
  const { customerEmail = "", customer, phone, address, total, payment, items = [] } = req.body;
  if (!customer?.trim() || !phone?.trim() || !address?.trim() || !items.length) return res.status(400).json({ message: "Thông tin đơn hàng chưa đầy đủ" });
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const paymentMethod = payment === "BANK" ? "Chuyển khoản" : "COD";
    const [result] = await connection.execute("INSERT INTO orders (customer_email, customer_name, phone, address, total, payment_method, status) VALUES (?, ?, ?, ?, ?, ?, 'Chờ xử lý')", [customerEmail, customer.trim(), phone.trim(), address.trim(), Number(total) || 0, paymentMethod]);
    for (const item of items) {
      await connection.execute("INSERT INTO order_items (order_id, book_id, book_name, price, quantity) VALUES (?, ?, ?, ?, ?)", [result.insertId, item.id, item.name, Number(item.price) || 0, Number(item.quantity) || 1]);
    }
    await connection.commit();
    res.status(201).json({ id: result.insertId });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ message: error.message });
  } finally {
    connection.release();
  }
});
app.patch("/api/orders/:id/status", async (req, res) => {
  const allowedStatuses = ["Chờ xử lý", "Đã duyệt", "Đang giao", "Đã giao", "Đã hủy", "Từ chối"];
  const { status } = req.body;
  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ message: "Trạng thái đơn hàng không hợp lệ" });
  }

  try {
    const [result] = await pool.execute("UPDATE orders SET status=? WHERE id=?", [status, req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ message: `Không thể cập nhật trạng thái: ${error.message}` });
  }
});
app.delete("/api/orders/:id", async (req, res) => {
  await pool.execute("DELETE FROM orders WHERE id=?", [req.params.id]);
  res.sendStatus(204);
});

app.listen(process.env.PORT || 3001, () => console.log("ShopBooks API running on port " + (process.env.PORT || 3001)));
