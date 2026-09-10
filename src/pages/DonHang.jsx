import { useEffect, useState } from "react";
import { api } from "../api";

function DonHang({ user, onBack }) {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    loadOrders();
  }, [user]);

  const loadOrders = () => {
    api.orders()
      .then((serverOrders) => {
        const myOrders = serverOrders.filter((order) => order.customerEmail === user?.email);
        setOrders(myOrders);
      })
      .catch(() => setOrders([]));
  };

  const formatPrice = (price) => {
    return Number(price || 0).toLocaleString("vi-VN") + " ₫";
  };

  const getStatusInfo = (status) => {
    const currentStatus = status || "Chờ xử lý";

    if (currentStatus === "Đã giao") {
      return {
        icon: "✅",
        background: "#dcfce7",
        color: "#166534",
      };
    }

    if (currentStatus === "Đang giao") {
      return {
        icon: "🚚",
        background: "#dbeafe",
        color: "#1d4ed8",
      };
    }

    if (currentStatus === "Đã hủy") {
      return {
        icon: "❌",
        background: "#fee2e2",
        color: "#b91c1c",
      };
    }

    return {
      icon: "⏳",
      background: "#fef3c7",
      color: "#92400e",
    };
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f6fa",
        display: "flex",
      }}
    >
      {/* SIDEBAR */}

      <aside
        style={{
          width: "260px",
          background: "#fff",
          borderRight: "1px solid #e5e5e5",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div
          style={{
            padding: "25px 20px",
            fontSize: "22px",
            fontWeight: "700",
            color: "#d62828",
            borderBottom: "1px solid #eee",
          }}
        >
          📚 SHOPBOOKS
        </div>

        <div
          style={{
            padding: "25px 20px",
            textAlign: "center",
            borderBottom: "1px solid #eee",
          }}
        >
          <div
            style={{
              fontSize: "45px",
              marginBottom: "8px",
            }}
          >
            👤
          </div>

          <strong>
            {user?.hoTen || "Khách hàng"}
          </strong>

          <p
            style={{
              margin: "5px 0 0",
              color: "#777",
            }}
          >
            Khách hàng
          </p>
        </div>

        <div style={{ padding: "20px 13px" }}>
          <button
            onClick={onBack}
            style={{
              width: "100%",
              padding: "13px 16px",
              border: "none",
              borderRadius: "9px",
              background: "#f5f5f5",
              cursor: "pointer",
              textAlign: "left",
              fontSize: "15px",
              marginBottom: "8px",
            }}
          >
            🏠 Trang chủ
          </button>

          <button
            style={{
              width: "100%",
              padding: "13px 16px",
              border: "none",
              borderRadius: "9px",
              background: "#d62828",
              color: "#fff",
              cursor: "pointer",
              textAlign: "left",
              fontSize: "15px",
              fontWeight: "600",
            }}
          >
            📦 Đơn hàng của tôi
          </button>
        </div>
      </aside>

      {/* MAIN */}

      <main
        style={{
          marginLeft: "260px",
          width: "calc(100% - 260px)",
          minHeight: "100vh",
        }}
      >
        {/* TOPBAR */}

        <div
          style={{
            background: "#fff",
            padding: "25px 35px",
            borderBottom: "1px solid #e5e5e5",
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: "30px",
            }}
          >
            📦 Đơn hàng của tôi
          </h1>

          <p
            style={{
              margin: "7px 0 0",
              color: "#777",
            }}
          >
            Theo dõi các đơn hàng bạn đã đặt
          </p>
        </div>

        {/* CONTENT */}

        <div
          style={{
            padding: "35px",
          }}
        >
          {orders.length === 0 ? (
            <div
              style={{
                background: "#fff",
                borderRadius: "15px",
                padding: "70px 20px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "60px",
                }}
              >
                📦
              </div>

              <h2>Chưa có đơn hàng</h2>

              <p
                style={{
                  color: "#777",
                }}
              >
                Bạn chưa đặt đơn hàng nào.
              </p>

              <button
                onClick={onBack}
                style={{
                  marginTop: "15px",
                  padding: "12px 22px",
                  border: "none",
                  borderRadius: "8px",
                  background: "#d62828",
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                Tiếp tục mua sách
              </button>
            </div>
          ) : (
            <>
              {/* THỐNG KÊ */}

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(3, 1fr)",
                  gap: "18px",
                  marginBottom: "25px",
                }}
              >
                <div
                  style={{
                    background: "#fff",
                    padding: "22px",
                    borderRadius: "14px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "30px",
                    }}
                  >
                    📦
                  </div>

                  <p
                    style={{
                      color: "#777",
                      marginBottom: "5px",
                    }}
                  >
                    Tổng đơn hàng
                  </p>

                  <strong
                    style={{
                      fontSize: "26px",
                    }}
                  >
                    {orders.length}
                  </strong>
                </div>

                <div
                  style={{
                    background: "#fff",
                    padding: "22px",
                    borderRadius: "14px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "30px",
                    }}
                  >
                    🚚
                  </div>

                  <p
                    style={{
                      color: "#777",
                      marginBottom: "5px",
                    }}
                  >
                    Đang giao
                  </p>

                  <strong
                    style={{
                      fontSize: "26px",
                    }}
                  >
                    {
                      orders.filter(
                        (order) =>
                          order.status ===
                          "Đang giao"
                      ).length
                    }
                  </strong>
                </div>

                <div
                  style={{
                    background: "#fff",
                    padding: "22px",
                    borderRadius: "14px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "30px",
                    }}
                  >
                    ✅
                  </div>

                  <p
                    style={{
                      color: "#777",
                      marginBottom: "5px",
                    }}
                  >
                    Đã giao
                  </p>

                  <strong
                    style={{
                      fontSize: "26px",
                    }}
                  >
                    {
                      orders.filter(
                        (order) =>
                          order.status ===
                          "Đã giao"
                      ).length
                    }
                  </strong>
                </div>
              </div>

              {/* DANH SÁCH */}

              <div
                style={{
                  background: "#fff",
                  borderRadius: "15px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    padding: "25px",
                    borderBottom:
                      "1px solid #eee",
                  }}
                >
                  <h2
                    style={{
                      margin: 0,
                    }}
                  >
                    Danh sách đơn hàng
                  </h2>
                </div>

                <div
                  style={{
                    padding: "20px",
                  }}
                >
                  {orders.map((order) => {
                    const statusInfo =
                      getStatusInfo(
                        order.status
                      );

                    return (
                      <div
                        key={order.id}
                        style={{
                          border:
                            "1px solid #eee",
                          borderRadius: "12px",
                          padding: "20px",
                          marginBottom: "15px",
                        }}
                      >
                        {/* HEADER ĐƠN */}

                        <div
                          style={{
                            display: "flex",
                            justifyContent:
                              "space-between",
                            alignItems:
                              "center",
                            gap: "15px",
                            flexWrap: "wrap",
                          }}
                        >
                          <div>
                            <strong
                              style={{
                                fontSize:
                                  "18px",
                              }}
                            >
                              {order.id}
                            </strong>

                            <p
                              style={{
                                margin:
                                  "5px 0 0",
                                color:
                                  "#777",
                              }}
                            >
                              {order.createdAt ||
                                "-"}
                            </p>
                          </div>

                          <span
                            style={{
                              background:
                                statusInfo.background,
                              color:
                                statusInfo.color,
                              padding:
                                "8px 14px",
                              borderRadius:
                                "20px",
                              fontWeight:
                                "600",
                              fontSize:
                                "14px",
                            }}
                          >
                            {statusInfo.icon}{" "}
                            {order.status ||
                              "Chờ xử lý"}
                          </span>
                        </div>

                        {/* SẢN PHẨM */}

                        <div
                          style={{
                            marginTop:
                              "18px",
                            paddingTop:
                              "15px",
                            borderTop:
                              "1px solid #eee",
                          }}
                        >
                          {order.items?.map(
                            (item) => (
                              <div
                                key={
                                  item.id
                                }
                                style={{
                                  display:
                                    "flex",
                                  justifyContent:
                                    "space-between",
                                  padding:
                                    "8px 0",
                                }}
                              >
                                <span>
                                  {
                                    item.name
                                  }{" "}
                                  ×{" "}
                                  {
                                    item.quantity
                                  }
                                </span>

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
                              </div>
                            )
                          )}
                        </div>

                        {/* FOOTER */}

                        <div
                          style={{
                            marginTop:
                              "15px",
                            paddingTop:
                              "15px",
                            borderTop:
                              "1px solid #eee",
                            display:
                              "flex",
                            justifyContent:
                              "space-between",
                            alignItems:
                              "center",
                            flexWrap:
                              "wrap",
                            gap: "10px",
                          }}
                        >
                          <div>
                            <span
                              style={{
                                color:
                                  "#777",
                              }}
                            >
                              Thanh toán:{" "}
                            </span>

                            <strong>
                              {order.payment ===
                              "BANK"
                                ? "🏦 Chuyển khoản"
                                : "💵 COD"}
                            </strong>
                          </div>

                          <div>
                            <span
                              style={{
                                marginRight:
                                  "10px",
                              }}
                            >
                              Tổng:
                            </span>

                            <strong
                              style={{
                                color:
                                  "#d62828",
                                fontSize:
                                  "20px",
                              }}
                            >
                              {formatPrice(
                                order.total
                              )}
                            </strong>
                          </div>
                        </div>

                        {/* BUTTON */}

                        <button
                          onClick={() =>
                            setSelectedOrder(
                              order
                            )
                          }
                          style={{
                            marginTop:
                              "15px",
                            padding:
                              "9px 18px",
                            border:
                              "1px solid #ddd",
                            background:
                              "#fff",
                            borderRadius:
                              "7px",
                            cursor:
                              "pointer",
                          }}
                        >
                          👁 Xem chi tiết
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      {/* MODAL */}

      {selectedOrder && (
        <div
          onClick={() =>
            setSelectedOrder(null)
          }
          style={{
            position: "fixed",
            inset: 0,
            background:
              "rgba(0,0,0,.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            zIndex: 100,
          }}
        >
          <div
            onClick={(e) =>
              e.stopPropagation()
            }
            style={{
              background: "#fff",
              width: "650px",
              maxWidth: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              borderRadius: "15px",
              padding: "30px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <h2
                  style={{
                    margin: 0,
                  }}
                >
                  📦 Chi tiết đơn hàng
                </h2>

                <p
                  style={{
                    color: "#777",
                  }}
                >
                  Mã đơn:{" "}
                  <strong>
                    {selectedOrder.id}
                  </strong>
                </p>
              </div>

              <button
                onClick={() =>
                  setSelectedOrder(null)
                }
                style={{
                  border: "none",
                  background: "#eee",
                  borderRadius: "50%",
                  width: "35px",
                  height: "35px",
                  cursor: "pointer",
                }}
              >
                ✕
              </button>
            </div>

            {/* TRẠNG THÁI */}

            <div
              style={{
                marginTop: "20px",
                padding: "20px",
                borderRadius: "12px",
                background:
                  getStatusInfo(
                    selectedOrder.status
                  ).background,
                color:
                  getStatusInfo(
                    selectedOrder.status
                  ).color,
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "35px",
                }}
              >
                {
                  getStatusInfo(
                    selectedOrder.status
                  ).icon
                }
              </div>

              <strong
                style={{
                  fontSize: "20px",
                }}
              >
                {selectedOrder.status ||
                  "Chờ xử lý"}
              </strong>
            </div>

            {/* THÔNG TIN */}

            <div
              style={{
                marginTop: "20px",
                background: "#f8f9fa",
                padding: "18px",
                borderRadius: "10px",
              }}
            >
              <h3>
                👤 Thông tin giao hàng
              </h3>

              <p>
                <strong>
                  Họ tên:
                </strong>{" "}
                {selectedOrder.customer ||
                  "-"}
              </p>

              <p>
                <strong>
                  Số điện thoại:
                </strong>{" "}
                {selectedOrder.phone ||
                  "-"}
              </p>

              <p>
                <strong>
                  Địa chỉ:
                </strong>{" "}
                {selectedOrder.address ||
                  "-"}
              </p>
            </div>

            {/* SẢN PHẨM */}

            <h3
              style={{
                marginTop: "25px",
              }}
            >
              📚 Sản phẩm
            </h3>

            {selectedOrder.items?.map(
              (item) => (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    padding: "12px 0",
                    borderBottom:
                      "1px solid #eee",
                  }}
                >
                  <span>
                    {item.name} ×{" "}
                    {item.quantity}
                  </span>

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
                </div>
              )
            )}

            {/* TỔNG */}

            <div
              style={{
                marginTop: "20px",
                paddingTop: "15px",
                borderTop:
                  "1px solid #ddd",
                display: "flex",
                justifyContent:
                  "space-between",
                fontSize: "20px",
              }}
            >
              <strong>
                Tổng tiền
              </strong>

              <strong
                style={{
                  color: "#d62828",
                }}
              >
                {formatPrice(
                  selectedOrder.total
                )}
              </strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DonHang;