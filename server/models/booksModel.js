import { pool } from "../config/database.js";

export const getBooks = async () => {
  const [rows] = await pool.query("SELECT * FROM books ORDER BY id DESC");
  return rows;
};

export const createBook = async ({ name, category, price, image, description, stock }) => {
  const [result] = await pool.execute(
    "INSERT INTO books (name, category, price, image, description, stock) VALUES (?, ?, ?, ?, ?, ?)",
    [name, category, price, image, description, stock],
  );
  return result.insertId;
};

export const updateBook = async (id, { name, category, price, image, description, stock }) => {
  await pool.execute(
    "UPDATE books SET name=?, category=?, price=?, image=?, description=?, stock=? WHERE id=?",
    [name, category, price, image, description, stock, id],
  );
};

export const deleteBook = async (id) => {
  await pool.execute("DELETE FROM books WHERE id=?", [id]);
};