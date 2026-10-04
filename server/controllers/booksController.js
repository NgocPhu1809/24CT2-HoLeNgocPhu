import * as booksModel from "../models/booksModel.js";

export const listBooks = async (_req, res) => {
  res.json(await booksModel.getBooks());
};

export const addBook = async (req, res) => {
  const { name, category, price, image, description = "", stock = 0 } = req.body;
  const id = await booksModel.createBook({ name, category, price, image, description, stock });
  res.status(201).json({ id });
};

export const editBook = async (req, res) => {
  const { name, category, price, image, description = "", stock = 0 } = req.body;
  await booksModel.updateBook(req.params.id, { name, category, price, image, description, stock });
  res.sendStatus(204);
};

export const removeBook = async (req, res) => {
  await booksModel.deleteBook(req.params.id);
  res.sendStatus(204);
};