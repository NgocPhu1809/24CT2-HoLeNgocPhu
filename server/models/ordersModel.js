import { pool } from "../config/database.js";

export const getOrders = async () => {
  const [orders] = await pool.query("SELECT * FROM orders ORDER BY created_at DESC");
  const [items] = await pool.query("SELECT * FROM order_items");
  return orders.map((order) => ({
    ...order,
    customer: order.customer_name,
    customerEmail: order.customer_email,
    createdAt: order.created_at,
    payment: order.payment_method === "Chuyển khoản" ? "BANK" : "COD",
    items: items
      .filter((item) => item.order_id === order.id)
      .map((item) => ({ id: item.book_id, name: item.book_name, price: item.price, quantity: item.quantity })),
  }));
};

export const createOrder = async ({ customerEmail, customer, phone, address, total, payment, items }) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const paymentMethod = payment === "BANK" ? "Chuyển khoản" : "COD";
    const [result] = await connection.execute(
      "INSERT INTO orders (customer_email, customer_name, phone, address, total, payment_method, status) VALUES (?, ?, ?, ?, ?, ?, 'Chờ xử lý')",
      [customerEmail, customer.trim(), phone.trim(), address.trim(), Number(total) || 0, paymentMethod],
    );
    for (const item of items) {
      await connection.execute(
        "INSERT INTO order_items (order_id, book_id, book_name, price, quantity) VALUES (?, ?, ?, ?, ?)",
        [result.insertId, item.id, item.name, Number(item.price) || 0, Number(item.quantity) || 1],
      );
    }
    await connection.commit();
    return result.insertId;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

export const updateOrderStatus = async (id, status) => {
  const [result] = await pool.execute("UPDATE orders SET status=? WHERE id=?", [status, id]);
  return result.affectedRows;
};

export const deleteOrder = async (id) => {
  await pool.execute("DELETE FROM orders WHERE id=?", [id]);
};