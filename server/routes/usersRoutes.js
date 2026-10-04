import { Router } from "express";
import { listUsers, loginUser, registerUser } from "../controllers/usersController.js";

const router = Router();

router.get("/", listUsers);
router.post("/register", registerUser);
router.post("/login", loginUser);

export default router;