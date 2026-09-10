const request = async (path, options) => {
  const response = await fetch(`/api${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!response.ok) throw new Error((await response.json().catch(() => ({}))).message || "Không thể kết nối máy chủ");
  return response.status === 204 ? null : response.json();
};

export const api = {
  health: () => request("/health"),
  books: () => request("/books"),
  createBook: (data) => request("/books", { method: "POST", body: JSON.stringify(data) }),
  updateBook: (id, data) => request(`/books/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteBook: (id) => request(`/books/${id}`, { method: "DELETE" }),
  users: () => request("/users"),
  register: (data) => request("/users/register", { method: "POST", body: JSON.stringify(data) }),
  login: (data) => request("/users/login", { method: "POST", body: JSON.stringify(data) }),
  orders: () => request("/orders"),
  createOrder: (data) => request("/orders", { method: "POST", body: JSON.stringify(data) }),
  updateOrderStatus: (id, status) => request(`/orders/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),
  deleteOrder: (id) => request(`/orders/${id}`, { method: "DELETE" }),
};
