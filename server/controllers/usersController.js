import crypto from "node:crypto";
import * as usersModel from "../models/usersModel.js";

const hashPassword = (password) => crypto.createHash("sha256").update(password).digest("hex");

export const listUsers = async (_req, res) => {
  res.json(await usersModel.getUsers());
};

export const registerUser = async (req, res) => {
  const { fullName, email, password } = req.body;
  if (!fullName?.trim() || !email?.trim() || !password) {
    return res.status(400).json({ message: "Thiếu thông tin đăng ký" });
  }

  const normalizedName = fullName.trim();
  const normalizedEmail = email.trim().toLowerCase();
  try {
    const id = await usersModel.createUser({
      fullName: normalizedName,
      email: normalizedEmail,
      passwordHash: hashPassword(password),
    });
    res.status(201).json({ id, hoTen: normalizedName, email: normalizedEmail, vaiTro: "KhachHang" });
  } catch (error) {
    res.status(error.code === "ER_DUP_ENTRY" ? 409 : 500).json({
      message: error.code === "ER_DUP_ENTRY" ? "Email này đã được đăng ký" : error.message,
    });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await usersModel.getUserByEmail(email?.trim().toLowerCase());
  if (!user || user.password_hash !== hashPassword(password || "")) {
    return res.status(401).json({ message: "Email hoặc mật khẩu không chính xác" });
  }
  const { password_hash: _passwordHash, ...safeUser } = user;
  res.json(safeUser);
};