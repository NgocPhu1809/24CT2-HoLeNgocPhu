function ChiTietDonHang({ order, onBack }) {
  if (!order) {
    return null;
  }

  const formatPrice = (price) => {
    return Number(price).toLocaleString("vi-VN") + " đ";
  };

  const getStatusClass = (status) => {
    if (status === "Đã giao") {
      return "order-status success";
    }

    if (status === "Đã hủy") {
      return "order-status danger";
    }

    if (status === "Đang giao") {
      return "order-status shipping";
    }

    return "order-status pending";
  };

  return (
    <div className="admin-page">

      {/* SIDEBAR */}

      <div className="admin-sidebar">

        <div className="admin-logo">
          📚 SHOPBOOKS
        </div>

        <div className="admin-menu">

          <button
            onClick={onBack}
          >
            📦 Đơn hàng của tôi
          </button>

        </div>

      </div>

      {/* NỘI DUNG */}

      <div className="admin-main">

        {/* TOPBAR */}

        <div className="admin-topbar">

          <div>

            <h1>
              Chi tiết đơn hàng
            </h1>

            <p>
              Mã đơn hàng:{" "}
              <strong>
                {order.id}
              </strong>
            </p>

          </div>

          <button
            className="admin-btn"
            onClick={onBack}
          >
            ← Quay lại
          </button>

        </div>

        <div className="admin-content">

          {/* TRẠNG THÁI */}

          <div className="admin-table-card">

            <div className="admin-table-header">

              <h2>
                Trạng thái đơn hàng
              </h2>

              <span
                className={getStatusClass(
                  order.status
                )}
              >
                {order.status ||
                  "Chờ xử lý"}
              </span>

            </div>

          </div>

          {/* THÔNG TIN ĐƠN */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "1fr 1fr",
              gap: "20px",
              marginTop: "20px",
            }}
          >

            {/* THÔNG TIN KHÁCH */}

            <div className="admin-table-card">

              <div className="admin-table-header">
                <h2>
                  👤 Thông tin nhận hàng
                </h2>
              </div>

              <div
                style={{
                  padding: "20px",
                  lineHeight: "1.8",
                }}
              >

                <p>
                  <strong>
                    Họ tên:
                  </strong>{" "}
                  {order.customer ||
                    "-"}
                </p>

                <p>
                  <strong>
                    Số điện thoại:
                  </strong>{" "}
                  {order.phone ||
                    "-"}
                </p>

                <p>
                  <strong>
                    Địa chỉ:
                  </strong>{" "}
                  {order.address ||
                    "-"}
                </p>

              </div>

            </div>

            {/* THÔNG TIN THANH TOÁN */}

            <div className="admin-table-card">

              <div className="admin-table-header">
                <h2>
                  💳 Thanh toán
                </h2>
              </div>

              <div
                style={{
                  padding: "20px",
                  lineHeight: "1.8",
                }}
              >

                <p>
                  <strong>
                    Phương thức:
                  </strong>{" "}

                  {order.payment ===
                  "BANK"
                    ? "🏦 Chuyển khoản ngân hàng"
                    : "💵 Thanh toán khi nhận hàng"}
                </p>

                <p>
                  <strong>
                    Ngày đặt:
                  </strong>{" "}
                  {order.createdAt ||
                    "-"}
                </p>

                <p>
                  <strong>
                    Tổng tiền:
                  </strong>{" "}

                  <span
                    style={{
                      color: "#d00",
                      fontWeight:
                        "700",
                      fontSize:
                        "18px",
                    }}
                  >
                    {formatPrice(
                      order.total
                    )}
                  </span>
                </p>

              </div>

            </div>

          </div>

          {/* DANH SÁCH SÁCH */}

          <div
            className="admin-table-card"
            style={{
              marginTop: "20px",
            }}
          >

            <div className="admin-table-header">

              <h2>
                📚 Sản phẩm trong đơn hàng
              </h2>

            </div>

            <div className="admin-table-wrapper">

              <table className="admin-table">

                <thead>

                  <tr>
                    <th>
                      Sản phẩm
                    </th>

                    <th>
                      Đơn giá
                    </th>

                    <th>
                      Số lượng
                    </th>

                    <th>
                      Thành tiền
                    </th>
                  </tr>

                </thead>

                <tbody>

                  {order.items &&
                  order.items.length > 0 ? (

                    order.items.map(
                      (item) => (

                        <tr
                          key={item.id}
                        >

                          <td>
                            <strong>
                              {item.name}
                            </strong>
                          </td>

                          <td>
                            {formatPrice(
                              item.price
                            )}
                          </td>

                          <td>
                            {item.quantity}
                          </td>

                          <td>
                            <strong>
                              {formatPrice(
                                Number(
                                  item.price
                                ) *
                                  Number(
                                    item.quantity
                                  )
                              )}
                            </strong>
                          </td>

                        </tr>

                      )
                    )

                  ) : (

                    <tr>

                      <td
                        colSpan="4"
                        style={{
                          textAlign:
                            "center",
                        }}
                      >
                        Không có sản phẩm
                      </td>

                    </tr>

                  )}

                </tbody>

              </table>

            </div>

            {/* TỔNG TIỀN */}

            <div
              style={{
                padding: "20px",
                textAlign: "right",
                borderTop:
                  "1px solid #eee",
              }}
            >

              <span
                style={{
                  fontSize:
                    "18px",
                  fontWeight:
                    "600",
                }}
              >
                Tổng cộng:{" "}
              </span>

              <span
                style={{
                  fontSize:
                    "24px",
                  fontWeight:
                    "700",
                  color: "#d00",
                }}
              >
                {formatPrice(
                  order.total
                )}
              </span>

            </div>

          </div>

          {/* MÃ ĐƠN */}

          <div
            className="admin-info-box"
            style={{
              marginTop: "20px",
            }}
          >

            <strong>
              📦 Mã đơn hàng:
            </strong>{" "}

            {order.id}

          </div>

        </div>

      </div>

    </div>
  );
}

export default ChiTietDonHang;