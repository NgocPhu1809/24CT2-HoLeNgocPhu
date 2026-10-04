import { Router } from "express";
import { addBook, editBook, listBooks, removeBook } from "../controllers/booksController.js";

const router = Router();

router.get("/", listBooks);
router.post("/", addBook);
router.put("/:id", editBook);
router.delete("/:id", removeBook);

export default router;