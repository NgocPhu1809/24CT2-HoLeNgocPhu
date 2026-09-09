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
  orders: () => request("/orders"),
  updateOrderStatus: (id, status) => request(`/orders/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),
};
