import { pool } from "../config/database.js";

export const getUsers = async () => {
  const [rows] = await pool.query(
    "SELECT id, full_name AS hoTen, email, password_hash AS matKhau, role AS vaiTro FROM users ORDER BY id DESC",
  );
  return rows;
};

export const createUser = async ({ fullName, email, passwordHash }) => {
  const [result] = await pool.execute(
    "INSERT INTO users (full_name, email, password_hash, role) VALUES (?, ?, ?, 'KhachHang')",
    [fullName, email, passwordHash],
  );
  return result.insertId;
};

export const getUserByEmail = async (email) => {
  const [rows] = await pool.execute(
    "SELECT id, full_name AS hoTen, email, password_hash, role AS vaiTro FROM users WHERE email=? LIMIT 1",
    [email],
  );
  return rows[0];
};