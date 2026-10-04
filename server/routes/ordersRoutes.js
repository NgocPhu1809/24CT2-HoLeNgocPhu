import { Router } from "express";
import { addOrder, changeOrderStatus, listOrders, removeOrder } from "../controllers/ordersController.js";

const router = Router();

router.get("/", listOrders);
router.post("/", addOrder);
router.patch("/:id/status", changeOrderStatus);
router.delete("/:id", removeOrder);

export default router;