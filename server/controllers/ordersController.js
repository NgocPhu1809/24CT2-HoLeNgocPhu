import * as ordersModel from "../models/ordersModel.js";

const allowedStatuses = ["Chờ xử lý", "Đã duyệt", "Đang giao", "Đã giao", "Đã hủy", "Từ chối"];

export const listOrders = async (_req, res) => {
  res.json(await ordersModel.getOrders());
};

export const addOrder = async (req, res) => {
  const { customerEmail = "", customer, phone, address, total, payment, items = [] } = req.body;
  if (!customer?.trim() || !phone?.trim() || !address?.trim() || !items.length) {
    return res.status(400).json({ message: "Thông tin đơn hàng chưa đầy đủ" });
  }

  try {
    const id = await ordersModel.createOrder({ customerEmail, customer, phone, address, total, payment, items });
    res.status(201).json({ id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const changeOrderStatus = async (req, res) => {
  const { status } = req.body;
  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ message: "Trạng thái đơn hàng không hợp lệ" });
  }

  try {
    const affectedRows = await ordersModel.updateOrderStatus(req.params.id, status);
    if (affectedRows === 0) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ message: `Không thể cập nhật trạng thái: ${error.message}` });
  }
};

export const removeOrder = async (req, res) => {
  await ordersModel.deleteOrder(req.params.id);
  res.sendStatus(204);
};