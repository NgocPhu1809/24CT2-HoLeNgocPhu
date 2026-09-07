import { useState } from "react";

function DatHang({
  cart,
  total,
  onBack,
  onOrderSuccess,
  user,
}) {
  const [hoTen, setHoTen] = useState(user?.hoTen || "");
  const [soDienThoai, setSoDienThoai] = useState("");
  const [diaChi, setDiaChi] = useState("");
  const [payment, setPayment] = useState("COD");
  const [error, setError] = useState("");

  const formatPrice = (price) => {
    return Number(price).toLocaleString("vi-VN") + " đ";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // Kiểm tra giỏ hàng
    if (!cart || cart.length === 0) {
      setError("Giỏ hàng đang trống!");
      return;
    }

    // Kiểm tra họ tên
    if (!hoTen.trim()) {
      setError("Vui lòng nhập họ tên!");
      return;
    }

    // Kiểm tra số điện thoại
    if (!soDienThoai.trim()) {
      setError("Vui lòng nhập số điện thoại!");
      return;
    }

    if (!/^[0-9]{9,11}$/.test(soDienThoai.trim())) {
      setError("Số điện thoại không hợp lệ!");
      return;
    }

    // Kiểm tra địa chỉ
    if (!diaChi.trim()) {
      setError("Vui lòng nhập địa chỉ giao hàng!");
      return;
    }

    // Tạo mã đơn hàng
    const orderCode =
      "SB" + Date.now().toString().slice(-6);

    // Tạo thông tin đơn hàng
    const newOrder = {
      id: orderCode,

      // Lưu email tài khoản để khách xem đúng đơn hàng của mình
      customerEmail: user?.email || "",

      customer: hoTen.trim(),

      phone: soDienThoai.trim(),

      address: diaChi.trim(),

      total: Number(total),

      payment,

      status: "Chờ xử lý",

      items: cart.map((item) => ({
        id: item.id,
        name: item.name,
        price: Number(item.price),
        quantity: Number(item.quantity),
      })),

      createdAt: new Date().toLocaleString("vi-VN"),
    };

    // Lấy danh sách đơn hàng cũ
    const oldOrders = JSON.parse(
      localStorage.getItem("shopbooks_orders") || "[]"
    );

    // Thêm đơn hàng mới
    const updatedOrders = [
      ...oldOrders,
      newOrder,
    ];

    // Lưu vào localStorage
    localStorage.setItem(
      "shopbooks_orders",
      JSON.stringify(updatedOrders)
    );

    // Xóa giỏ hàng
    localStorage.removeItem("shopbooks_cart");

    // Thông báo cho App
    if (onOrderSuccess) {
      onOrderSuccess(newOrder);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f5f5",
        padding: "30px",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        {/* Tiêu đề */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "25px",
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: "30px",
              }}
            >
              📦 Đặt hàng
            </h1>

            <p
              style={{
                color: "#666",
                marginTop: "8px",
              }}
            >
              Nhập thông tin nhận hàng và chọn
              phương thức thanh toán
            </p>
          </div>

          <button
            type="button"
            onClick={onBack}
            style={{
              padding: "10px 18px",
              border: "none",
              borderRadius: "8px",
              background: "#666",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            ← Quay lại
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "1fr 380px",
            gap: "25px",
          }}
        >
          {/* FORM ĐẶT HÀNG */}
          <div
            style={{
              background: "#fff",
              padding: "25px",
              borderRadius: "12px",
              boxShadow:
                "0 2px 10px rgba(0,0,0,0.08)",
            }}
          >
            <h2
              style={{
                marginTop: 0,
                marginBottom: "20px",
              }}
            >
              📝 Thông tin giao hàng
            </h2>

            {error && (
              <div
                style={{
                  background: "#ffe5e5",
                  color: "#d00",
                  padding: "12px",
                  borderRadius: "8px",
                  marginBottom: "20px",
                }}
              >
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* HỌ TÊN */}
              <div
                style={{
                  marginBottom: "18px",
                }}
              >
                <label
                  style={{
                    display: "block",
                    fontWeight: "600",
                    marginBottom: "7px",
                  }}
                >
                  Họ và tên *
                </label>

                <input
                  type="text"
                  value={hoTen}
                  onChange={(e) =>
                    setHoTen(e.target.value)
                  }
                  placeholder="Nhập họ và tên"
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    padding: "12px",
                    border:
                      "1px solid #ddd",
                    borderRadius: "8px",
                    fontSize: "15px",
                  }}
                />
              </div>

              {/* SỐ ĐIỆN THOẠI */}
              <div
                style={{
                  marginBottom: "18px",
                }}
              >
                <label
                  style={{
                    display: "block",
                    fontWeight: "600",
                    marginBottom: "7px",
                  }}
                >
                  Số điện thoại *
                </label>

                <input
                  type="tel"
                  value={soDienThoai}
                  onChange={(e) =>
                    setSoDienThoai(
                      e.target.value
                    )
                  }
                  placeholder="Nhập số điện thoại"
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    padding: "12px",
                    border:
                      "1px solid #ddd",
                    borderRadius: "8px",
                    fontSize: "15px",
                  }}
                />
              </div>

              {/* ĐỊA CHỈ */}
              <div
                style={{
                  marginBottom: "18px",
                }}
              >
                <label
                  style={{
                    display: "block",
                    fontWeight: "600",
                    marginBottom: "7px",
                  }}
                >
                  Địa chỉ nhận hàng *
                </label>

                <textarea
                  value={diaChi}
                  onChange={(e) =>
                    setDiaChi(e.target.value)
                  }
                  placeholder="Nhập địa chỉ nhận hàng"
                  rows="4"
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    padding: "12px",
                    border:
                      "1px solid #ddd",
                    borderRadius: "8px",
                    fontSize: "15px",
                    resize: "vertical",
                  }}
                />
              </div>

              {/* THANH TOÁN */}
              <div
                style={{
                  marginBottom: "20px",
                }}
              >
                <label
                  style={{
                    display: "block",
                    fontWeight: "600",
                    marginBottom: "10px",
                  }}
                >
                  Phương thức thanh toán *
                </label>

                {/* COD */}
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "14px",
                    border:
                      payment === "COD"
                        ? "2px solid #2563eb"
                        : "1px solid #ddd",
                    borderRadius: "8px",
                    marginBottom: "10px",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="COD"
                    checked={
                      payment === "COD"
                    }
                    onChange={(e) =>
                      setPayment(
                        e.target.value
                      )
                    }
                  />

                  <div>
                    <strong>
                      💵 Thanh toán khi nhận
                      hàng
                    </strong>

                    <div
                      style={{
                        color: "#666",
                        fontSize: "14px",
                        marginTop: "3px",
                      }}
                    >
                      Thanh toán tiền khi
                      nhận được sách
                    </div>
                  </div>
                </label>

                {/* BANK */}
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "14px",
                    border:
                      payment === "BANK"
                        ? "2px solid #2563eb"
                        : "1px solid #ddd",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="BANK"
                    checked={
                      payment === "BANK"
                    }
                    onChange={(e) =>
                      setPayment(
                        e.target.value
                      )
                    }
                  />

                  <div>
                    <strong>
                      🏦 Chuyển khoản ngân hàng
                    </strong>

                    <div
                      style={{
                        color: "#666",
                        fontSize: "14px",
                        marginTop: "3px",
                      }}
                    >
                      Thanh toán bằng chuyển
                      khoản
                    </div>
                  </div>
                </label>
              </div>

              {/* NÚT XÁC NHẬN */}
              <button
                type="submit"
                style={{
                  width: "100%",
                  padding: "14px",
                  border: "none",
                  borderRadius: "8px",
                  background: "#2563eb",
                  color: "#fff",
                  fontSize: "17px",
                  fontWeight: "700",
                  cursor: "pointer",
                }}
              >
                ✅ Xác nhận đặt hàng
              </button>
            </form>
          </div>

          {/* TÓM TẮT ĐƠN HÀNG */}
          <div
            style={{
              background: "#fff",
              padding: "25px",
              borderRadius: "12px",
              boxShadow:
                "0 2px 10px rgba(0,0,0,0.08)",
              height: "fit-content",
            }}
          >
            <h2
              style={{
                marginTop: 0,
                marginBottom: "20px",
              }}
            >
              🛒 Đơn hàng của bạn
            </h2>

            {cart.map((item) => (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  gap: "10px",
                  paddingBottom: "15px",
                  marginBottom: "15px",
                  borderBottom:
                    "1px solid #eee",
                }}
              >
                <div>
                  <strong>
                    {item.name}
                  </strong>

                  <div
                    style={{
                      color: "#666",
                      fontSize: "14px",
                      marginTop: "5px",
                    }}
                  >
                    Số lượng:{" "}
                    {item.quantity}
                  </div>
                </div>

                <strong>
                  {formatPrice(
                    Number(item.price) *
                      Number(item.quantity)
                  )}
                </strong>
              </div>
            ))}

            {/* TỔNG */}
            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                fontSize: "20px",
                fontWeight: "700",
                paddingTop: "10px",
              }}
            >
              <span>
                Tổng cộng:
              </span>

              <span
                style={{
                  color: "#d00",
                }}
              >
                {formatPrice(total)}
              </span>
            </div>

            {/* TÀI KHOẢN */}
            {user && (
              <div
                style={{
                  marginTop: "20px",
                  padding: "15px",
                  background: "#f5f7ff",
                  borderRadius: "8px",
                  fontSize: "14px",
                }}
              >
                <strong>
                  👤 Tài khoản đặt hàng
                </strong>

                <div
                  style={{
                    marginTop: "6px",
                  }}
                >
                  {user.email}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DatHang;