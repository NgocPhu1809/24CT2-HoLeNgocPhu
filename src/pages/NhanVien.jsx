import { useEffect, useState } from "react";

function NhanVien({ user, onLogout }) {
  // ==========================================
  // MENU
  // ==========================================

  const [activeMenu, setActiveMenu] =
    useState("orders");

  // ==========================================
  // ĐƠN HÀNG
  // ==========================================

  const [orders, setOrders] = useState([]);

  // ==========================================
  // TÌM KIẾM
  // ==========================================

  const [search, setSearch] = useState("");

  // ==========================================
  // TRẠNG THÁI LỌC
  // ==========================================

  const [statusFilter, setStatusFilter] =
    useState("Tất cả");

  // ==========================================
  // CHI TIẾT ĐƠN
  // ==========================================

  const [selectedOrder, setSelectedOrder] =
    useState(null);

  // ==========================================
  // ĐỌC ĐƠN HÀNG
  // ==========================================

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () => {
    const savedOrders =
      JSON.parse(
        localStorage.getItem(
          "shopbooks_orders"
        ) || "[]"
      );

    setOrders(savedOrders.reverse());
  };

  // ==========================================
  // FORMAT TIỀN
  // ==========================================

  const formatPrice = (price) => {
    return (
      Number(price || 0).toLocaleString(
        "vi-VN"
      ) + " ₫"
    );
  };

  // ==========================================
  // CẬP NHẬT TRẠNG THÁI
  // ==========================================

  const updateOrderStatus = (
    orderId,
    newStatus
  ) => {
    const savedOrders =
      JSON.parse(
        localStorage.getItem(
          "shopbooks_orders"
        ) || "[]"
      );

    const updatedOrders =
      savedOrders.map(
        (order) =>
          order.id === orderId
            ? {
                ...order,
                status: newStatus,
              }
            : order
      );

    localStorage.setItem(
      "shopbooks_orders",
      JSON.stringify(
        updatedOrders
      )
    );

    setOrders(
      [...updatedOrders].reverse()
    );

    if (
      selectedOrder &&
      selectedOrder.id === orderId
    ) {
      setSelectedOrder({
        ...selectedOrder,
        status: newStatus,
      });
    }

    window.showToast?.(
      `Đã cập nhật đơn ${orderId} thành "${newStatus}"`
    );
  };

  // ==========================================
  // XÓA ĐƠN HÀNG
  // ==========================================

  const deleteOrder = (orderId) => {
    const confirmDelete =
      window.confirm(
        "Bạn có chắc muốn xóa đơn hàng này không?"
      );

    if (!confirmDelete) {
      return;
    }

    const savedOrders =
      JSON.parse(
        localStorage.getItem(
          "shopbooks_orders"
        ) || "[]"
      );

    const updatedOrders =
      savedOrders.filter(
        (order) =>
          order.id !== orderId
      );

    localStorage.setItem(
      "shopbooks_orders",
      JSON.stringify(
        updatedOrders
      )
    );

    setOrders(
      [...updatedOrders].reverse()
    );

    setSelectedOrder(null);

    window.showToast?.("Đã xóa đơn hàng!");
  };

  // ==========================================
  // LỌC ĐƠN
  // ==========================================

  const filteredOrders =
    orders.filter((order) => {
      const keyword =
        search.toLowerCase().trim();

      const matchSearch =
        !keyword ||
        order.id
          ?.toLowerCase()
          .includes(keyword) ||
        order.customer
          ?.toLowerCase()
          .includes(keyword) ||
        order.phone
          ?.toLowerCase()
          .includes(keyword);

      const matchStatus =
        statusFilter ===
          "Tất cả" ||
        (order.status ||
          "Chờ xử lý") ===
          statusFilter;

      return (
        matchSearch &&
        matchStatus
      );
    });

  // ==========================================
  // THỐNG KÊ
  // ==========================================

  const totalOrders =
    orders.length;

  const pendingOrders =
    orders.filter(
      (order) =>
        (order.status ||
          "Chờ xử lý") ===
        "Chờ xử lý"
    ).length;

  const shippingOrders =
    orders.filter(
      (order) =>
        order.status ===
        "Đang giao"
    ).length;

  const deliveredOrders =
    orders.filter(
      (order) =>
        order.status ===
        "Đã giao"
    ).length;

  const totalRevenue =
    orders
      .filter(
        (order) =>
          order.status !==
          "Đã hủy"
      )
      .reduce(
        (sum, order) =>
          sum +
          Number(
            order.total || 0
          ),
        0
      );

  // ==========================================
  // CLASS TRẠNG THÁI
  // ==========================================

  const getStatusStyle = (
    status
  ) => {
    const currentStatus =
      status || "Chờ xử lý";

    if (
      currentStatus ===
      "Đã giao"
    ) {
      return {
        background: "#dcfce7",
        color: "#166534",
      };
    }

    if (
      currentStatus ===
      "Đang giao"
    ) {
      return {
        background: "#dbeafe",
        color: "#1d4ed8",
      };
    }

    if (
      currentStatus ===
      "Đã hủy"
    ) {
      return {
        background: "#fee2e2",
        color: "#b91c1c",
      };
    }

    return {
      background: "#fef3c7",
      color: "#92400e",
    };
  };

  // ==========================================
  // MENU STYLE
  // ==========================================

  const menuButton = (
    active
  ) => ({
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "13px 16px",
    marginBottom: "7px",
    border: "none",
    borderRadius: "9px",
    background: active
      ? "#d62828"
      : "transparent",
    color: active
      ? "#ffffff"
      : "#444",
    fontSize: "15px",
    fontWeight: active
      ? "600"
      : "500",
    cursor: "pointer",
    textAlign: "left",
  });

  // ==========================================
  // GIAO DIỆN
  // ==========================================

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f4f5f9",
        display: "flex",
      }}
    >

      {/* ======================================
          SIDEBAR
      ====================================== */}

      <aside
        style={{
          width: "260px",
          minHeight: "100vh",
          background: "#fff",
          borderRight:
            "1px solid #e5e5e5",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 10,
        }}
      >

        {/* LOGO */}

        <div
          style={{
            height: "78px",
            display: "flex",
            alignItems: "center",
            padding:
              "0 25px",
            borderBottom:
              "1px solid #eee",
            fontSize: "22px",
            fontWeight: "700",
            color: "#d62828",
          }}
        >
          📚 SHOPBOOKS
        </div>

        {/* USER */}

        <div
          style={{
            padding:
              "25px 20px",
            textAlign:
              "center",
            borderBottom:
              "1px solid #eee",
          }}
        >
          <div
            style={{
              fontSize: "38px",
              marginBottom:
                "8px",
            }}
          >
            👨‍💼
          </div>

          <strong
            style={{
              display:
                "block",
              fontSize:
                "18px",
            }}
          >
            {user?.hoTen ||
              "Nhân viên"}
          </strong>

          <span
            style={{
              display:
                "block",
              marginTop:
                "5px",
              color: "#777",
            }}
          >
            Nhân viên
          </span>
        </div>

        {/* MENU */}

        <div
          style={{
            padding:
              "20px 13px",
          }}
        >

          <button
            onClick={() => {
              setActiveMenu(
                "orders"
              );
              setSelectedOrder(
                null
              );
              loadOrders();
            }}
            style={menuButton(
              activeMenu ===
                "orders"
            )}
          >
            <span>
              📦
            </span>

            <span>
              Quản lý đơn hàng
            </span>
          </button>

          <button
            onClick={() => {
              setActiveMenu(
                "stats"
              );
              setSelectedOrder(
                null
              );
            }}
            style={menuButton(
              activeMenu ===
                "stats"
            )}
          >
            <span>
              📊
            </span>

            <span>
              Thống kê
            </span>
          </button>

          <button
            onClick={() => {
              loadOrders();
              setActiveMenu(
                "orders"
              );
            }}
            style={menuButton(
              false
            )}
          >
            <span>
              🔄
            </span>

            <span>
              Làm mới
            </span>
          </button>

          <button
            type="button"
            onClick={
              onLogout
            }
            style={{
              ...menuButton(
                false
              ),
              marginTop:
                "15px",
            }}
          >
            <span>
              🚪
            </span>

            <span>
              Đăng xuất
            </span>
          </button>

        </div>
      </aside>

      {/* ======================================
          MAIN
      ====================================== */}

      <main
        style={{
          marginLeft:
            "260px",
          width:
            "calc(100% - 260px)",
          minHeight:
            "100vh",
        }}
      >

        {/* TOPBAR */}

        <div
          style={{
            background:
              "#ffffff",
            padding:
              "25px 35px",
            borderBottom:
              "1px solid #e5e5e5",
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize:
                "32px",
              color:
                "#222",
            }}
          >
            {activeMenu ===
            "stats"
              ? "Thống kê"
              : "Quản lý đơn hàng"}
          </h1>

          <p
            style={{
              margin:
                "8px 0 0",
              color:
                "#777",
            }}
          >
            Xin chào{" "}
            {user?.hoTen ||
              "Nhân viên"}
          </p>
        </div>

        {/* CONTENT */}

        <div
          style={{
            padding:
              "35px",
          }}
        >

          {/* ==================================
              THỐNG KÊ
          ================================== */}

          {activeMenu ===
            "stats" && (
            <>
              <div
                style={{
                  display:
                    "grid",
                  gridTemplateColumns:
                    "repeat(4, 1fr)",
                  gap: "18px",
                  marginBottom:
                    "25px",
                }}
              >

                {/* TỔNG */}

                <div
                  style={{
                    background:
                      "#fff",
                    padding:
                      "23px",
                    borderRadius:
                      "15px",
                    boxShadow:
                      "0 5px 20px rgba(0,0,0,.06)",
                  }}
                >
                  <div
                    style={{
                      fontSize:
                        "32px",
                    }}
                  >
                    📦
                  </div>

                  <div
                    style={{
                      color:
                        "#777",
                      marginTop:
                        "10px",
                    }}
                  >
                    Tổng đơn hàng
                  </div>

                  <strong
                    style={{
                      display:
                        "block",
                      fontSize:
                        "27px",
                      marginTop:
                        "5px",
                    }}
                  >
                    {totalOrders}
                  </strong>
                </div>

                {/* CHỜ XỬ LÝ */}

                <div
                  style={{
                    background:
                      "#fff",
                    padding:
                      "23px",
                    borderRadius:
                      "15px",
                    boxShadow:
                      "0 5px 20px rgba(0,0,0,.06)",
                  }}
                >
                  <div
                    style={{
                      fontSize:
                        "32px",
                    }}
                  >
                    ⏳
                  </div>

                  <div
                    style={{
                      color:
                        "#777",
                      marginTop:
                        "10px",
                    }}
                  >
                    Chờ xử lý
                  </div>

                  <strong
                    style={{
                      display:
                        "block",
                      fontSize:
                        "27px",
                      marginTop:
                        "5px",
                    }}
                  >
                    {pendingOrders}
                  </strong>
                </div>

                {/* ĐANG GIAO */}

                <div
                  style={{
                    background:
                      "#fff",
                    padding:
                      "23px",
                    borderRadius:
                      "15px",
                    boxShadow:
                      "0 5px 20px rgba(0,0,0,.06)",
                  }}
                >
                  <div
                    style={{
                      fontSize:
                        "32px",
                    }}
                  >
                    🚚
                  </div>

                  <div
                    style={{
                      color:
                        "#777",
                      marginTop:
                        "10px",
                    }}
                  >
                    Đang giao
                  </div>

                  <strong
                    style={{
                      display:
                        "block",
                      fontSize:
                        "27px",
                      marginTop:
                        "5px",
                    }}
                  >
                    {shippingOrders}
                  </strong>
                </div>

                {/* ĐÃ GIAO */}

                <div
                  style={{
                    background:
                      "#fff",
                    padding:
                      "23px",
                    borderRadius:
                      "15px",
                    boxShadow:
                      "0 5px 20px rgba(0,0,0,.06)",
                  }}
                >
                  <div
                    style={{
                      fontSize:
                        "32px",
                    }}
                  >
                    ✅
                  </div>

                  <div
                    style={{
                      color:
                        "#777",
                      marginTop:
                        "10px",
                    }}
                  >
                    Đã giao
                  </div>

                  <strong
                    style={{
                      display:
                        "block",
                      fontSize:
                        "27px",
                      marginTop:
                        "5px",
                    }}
                  >
                    {deliveredOrders}
                  </strong>
                </div>

              </div>

              {/* DOANH THU */}

              <div
                style={{
                  background:
                    "#fff",
                  borderRadius:
                    "15px",
                  padding:
                    "30px",
                  boxShadow:
                    "0 5px 20px rgba(0,0,0,.06)",
                }}
              >
                <h2
                  style={{
                    marginTop: 0,
                  }}
                >
                  💰 Tổng doanh thu
                </h2>

                <div
                  style={{
                    fontSize:
                      "35px",
                    fontWeight:
                      "700",
                    color:
                      "#d62828",
                  }}
                >
                  {formatPrice(
                    totalRevenue
                  )}
                </div>

                <p
                  style={{
                    color:
                      "#777",
                  }}
                >
                  Không tính các đơn
                  hàng đã hủy.
                </p>
              </div>
            </>
          )}

          {/* ==================================
              QUẢN LÝ ĐƠN
          ================================== */}

          {activeMenu ===
            "orders" && (
            <>
              {/* THỐNG KÊ NHANH */}

              <div
                style={{
                  display:
                    "grid",
                  gridTemplateColumns:
                    "repeat(3, 1fr)",
                  gap: "18px",
                  marginBottom:
                    "25px",
                }}
              >

                <div
                  style={{
                    background:
                      "#fff",
                    padding:
                      "20px",
                    borderRadius:
                      "14px",
                    boxShadow:
                      "0 5px 20px rgba(0,0,0,.05)",
                  }}
                >
                  <span
                    style={{
                      color:
                        "#777",
                    }}
                  >
                    Tổng đơn
                  </span>

                  <strong
                    style={{
                      display:
                        "block",
                      fontSize:
                        "26px",
                      marginTop:
                        "5px",
                    }}
                  >
                    {totalOrders}
                  </strong>
                </div>

                <div
                  style={{
                    background:
                      "#fff",
                    padding:
                      "20px",
                    borderRadius:
                      "14px",
                    boxShadow:
                      "0 5px 20px rgba(0,0,0,.05)",
                  }}
                >
                  <span
                    style={{
                      color:
                        "#777",
                    }}
                  >
                    Chờ xử lý
                  </span>

                  <strong
                    style={{
                      display:
                        "block",
                      fontSize:
                        "26px",
                      marginTop:
                        "5px",
                      color:
                        "#d97706",
                    }}
                  >
                    {pendingOrders}
                  </strong>
                </div>

                <div
                  style={{
                    background:
                      "#fff",
                    padding:
                      "20px",
                    borderRadius:
                      "14px",
                    boxShadow:
                      "0 5px 20px rgba(0,0,0,.05)",
                  }}
                >
                  <span
                    style={{
                      color:
                        "#777",
                    }}
                  >
                    Đã giao
                  </span>

                  <strong
                    style={{
                      display:
                        "block",
                      fontSize:
                        "26px",
                      marginTop:
                        "5px",
                      color:
                        "#16a34a",
                    }}
                  >
                    {deliveredOrders}
                  </strong>
                </div>

              </div>

              {/* BẢNG */}

              <div
                style={{
                  background:
                    "#fff",
                  borderRadius:
                    "15px",
                  boxShadow:
                    "0 5px 20px rgba(0,0,0,.06)",
                  overflow:
                    "hidden",
                }}
              >

                {/* HEADER */}

                <div
                  style={{
                    padding:
                      "25px",
                    display:
                      "flex",
                    justifyContent:
                      "space-between",
                    alignItems:
                      "center",
                    gap: "15px",
                    flexWrap:
                      "wrap",
                  }}
                >

                  <div>
                    <h2
                      style={{
                        margin:
                          0,
                      }}
                    >
                      📦 Danh sách
                      đơn hàng
                    </h2>

                    <p
                      style={{
                        color:
                          "#777",
                        margin:
                          "6px 0 0",
                      }}
                    >
                      Xem và cập nhật
                      trạng thái đơn
                      hàng
                    </p>
                  </div>

                  {/* TÌM KIẾM */}

                  <input
                    type="text"
                    value={search}
                    onChange={(e) =>
                      setSearch(
                        e.target
                          .value
                      )
                    }
                    placeholder="🔍 Mã đơn, tên khách..."
                    style={{
                      width:
                        "260px",
                      padding:
                        "11px 14px",
                      border:
                        "1px solid #ddd",
                      borderRadius:
                        "8px",
                      outline:
                        "none",
                    }}
                  />

                  {/* LỌC */}

                  <select
                    value={
                      statusFilter
                    }
                    onChange={(e) =>
                      setStatusFilter(
                        e.target
                          .value
                      )
                    }
                    style={{
                      padding:
                        "11px 14px",
                      border:
                        "1px solid #ddd",
                      borderRadius:
                        "8px",
                      background:
                        "#fff",
                    }}
                  >
                    <option>
                      Tất cả
                    </option>

                    <option>
                      Chờ xử lý
                    </option>

                    <option>
                      Đang giao
                    </option>

                    <option>
                      Đã giao
                    </option>

                    <option>
                      Đã hủy
                    </option>
                  </select>

                </div>

                {/* TABLE */}

                {filteredOrders.length ===
                0 ? (
                  <div
                    style={{
                      padding:
                        "60px 20px",
                      textAlign:
                        "center",
                      color:
                        "#777",
                    }}
                  >
                    <div
                      style={{
                        fontSize:
                          "50px",
                      }}
                    >
                      📦
                    </div>

                    <h3>
                      Không có
                      đơn hàng
                    </h3>

                    <p>
                      Chưa tìm thấy
                      đơn hàng phù
                      hợp.
                    </p>
                  </div>
                ) : (
                  <div
                    style={{
                      overflowX:
                        "auto",
                    }}
                  >
                    <table
                      style={{
                        width:
                          "100%",
                        borderCollapse:
                          "collapse",
                      }}
                    >
                      <thead>
                        <tr
                          style={{
                            background:
                              "#f8f8f8",
                          }}
                        >
                          <th
                            style={
                              thStyle
                            }
                          >
                            Mã đơn
                          </th>

                          <th
                            style={
                              thStyle
                            }
                          >
                            Khách hàng
                          </th>

                          <th
                            style={
                              thStyle
                            }
                          >
                            Ngày đặt
                          </th>

                          <th
                            style={
                              thStyle
                            }
                          >
                            Tổng tiền
                          </th>

                          <th
                            style={
                              thStyle
                            }
                          >
                            Thanh toán
                          </th>

                          <th
                            style={
                              thStyle
                            }
                          >
                            Trạng thái
                          </th>

                          <th
                            style={
                              thStyle
                            }
                          >
                            Thao tác
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {filteredOrders.map(
                          (
                            order
                          ) => {
                            const status =
                              order.status ||
                              "Chờ xử lý";

                            return (
                              <tr
                                key={
                                  order.id
                                }
                                style={{
                                  borderTop:
                                    "1px solid #eee",
                                }}
                              >
                                <td
                                  style={
                                    tdStyle
                                  }
                                >
                                  <strong>
                                    {
                                      order.id
                                    }
                                  </strong>
                                </td>

                                <td
                                  style={
                                    tdStyle
                                  }
                                >
                                  <strong>
                                    {
                                      order.customer
                                    }
                                  </strong>

                                  <div
                                    style={{
                                      color:
                                        "#777",
                                      fontSize:
                                        "13px",
                                      marginTop:
                                        "4px",
                                    }}
                                  >
                                    {
                                      order.phone
                                    }
                                  </div>
                                </td>

                                <td
                                  style={
                                    tdStyle
                                  }
                                >
                                  {
                                    order.createdAt ||
                                    "-"
                                  }
                                </td>

                                <td
                                  style={
                                    tdStyle
                                  }
                                >
                                  <strong>
                                    {formatPrice(
                                      order.total
                                    )}
                                  </strong>
                                </td>

                                <td
                                  style={
                                    tdStyle
                                  }
                                >
                                  {order.payment ===
                                  "BANK"
                                    ? "🏦 Chuyển khoản"
                                    : "💵 COD"}
                                </td>

                                <td
                                  style={
                                    tdStyle
                                  }
                                >
                                  <span
                                    style={{
                                      ...statusStyle,
                                      ...getStatusStyle(
                                        status
                                      ),
                                    }}
                                  >
                                    {
                                      status
                                    }
                                  </span>
                                </td>

                                <td
                                  style={
                                    tdStyle
                                  }
                                >
                                  <button
                                    onClick={() =>
                                      setSelectedOrder(
                                        order
                                      )
                                    }
                                    style={{
                                      padding:
                                        "7px 11px",
                                      border:
                                        "1px solid #ddd",
                                      background:
                                        "#fff",
                                      borderRadius:
                                        "6px",
                                      cursor:
                                        "pointer",
                                      marginRight:
                                        "6px",
                                    }}
                                  >
                                    👁 Xem
                                  </button>

                                  <button
                                    onClick={() =>
                                      deleteOrder(
                                        order.id
                                      )
                                    }
                                    style={{
                                      padding:
                                        "7px 11px",
                                      border:
                                        "none",
                                      background:
                                        "#fee2e2",
                                      color:
                                        "#b91c1c",
                                      borderRadius:
                                        "6px",
                                      cursor:
                                        "pointer",
                                    }}
                                  >
                                    🗑
                                  </button>
                                </td>
                              </tr>
                            );
                          }
                        )}
                      </tbody>
                    </table>
                  </div>
                )}

              </div>
            </>
          )}

        </div>
      </main>

      {/* ======================================
          MODAL CHI TIẾT ĐƠN
      ====================================== */}

      {selectedOrder && (
        <div
          style={{
            position:
              "fixed",
            inset: 0,
            background:
              "rgba(0,0,0,.45)",
            display:
              "flex",
            justifyContent:
              "center",
            alignItems:
              "center",
            zIndex: 100,
            padding: "20px",
          }}
          onClick={() =>
            setSelectedOrder(
              null
            )
          }
        >
          <div
            style={{
              background:
                "#fff",
              width:
                "700px",
              maxWidth:
                "100%",
              maxHeight:
                "90vh",
              overflowY:
                "auto",
              borderRadius:
                "16px",
              padding:
                "30px",
              boxShadow:
                "0 15px 50px rgba(0,0,0,.2)",
            }}
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* TIÊU ĐỀ */}

            <div
              style={{
                display:
                  "flex",
                justifyContent:
                  "space-between",
                alignItems:
                  "center",
                marginBottom:
                  "20px",
              }}
            >
              <div>
                <h2
                  style={{
                    margin:
                      0,
                  }}
                >
                  📦 Chi tiết đơn hàng
                </h2>

                <p
                  style={{
                    color:
                      "#777",
                    margin:
                      "5px 0 0",
                  }}
                >
                  Mã đơn:{" "}
                  <strong>
                    {
                      selectedOrder.id
                    }
                  </strong>
                </p>
              </div>

              <button
                onClick={() =>
                  setSelectedOrder(
                    null
                  )
                }
                style={{
                  border:
                    "none",
                  background:
                    "#f1f1f1",
                  width:
                    "35px",
                  height:
                    "35px",
                  borderRadius:
                    "50%",
                  cursor:
                    "pointer",
                  fontSize:
                    "18px",
                }}
              >
                ✕
              </button>
            </div>

            {/* KHÁCH */}

            <div
              style={{
                background:
                  "#f8f9fa",
                padding:
                  "18px",
                borderRadius:
                  "10px",
                marginBottom:
                  "18px",
              }}
            >
              <h3
                style={{
                  marginTop:
                    0,
                }}
              >
                👤 Thông tin khách hàng
              </h3>

              <p>
                <strong>
                  Họ tên:
                </strong>{" "}
                {
                  selectedOrder.customer ||
                  "-"
                }
              </p>

              <p>
                <strong>
                  Email:
                </strong>{" "}
                {
                  selectedOrder.customerEmail ||
                  "-"
                }
              </p>

              <p>
                <strong>
                  Số điện thoại:
                </strong>{" "}
                {
                  selectedOrder.phone ||
                  "-"
                }
              </p>

              <p>
                <strong>
                  Địa chỉ:
                </strong>{" "}
                {
                  selectedOrder.address ||
                  "-"
                }
              </p>
            </div>

            {/* SẢN PHẨM */}

            <div
              style={{
                marginBottom:
                  "20px",
              }}
            >
              <h3>
                📚 Sản phẩm
              </h3>

              {selectedOrder.items?.map(
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
                        "12px 0",
                      borderBottom:
                        "1px solid #eee",
                    }}
                  >
                    <div>
                      <strong>
                        {
                          item.name
                        }
                      </strong>

                      <div
                        style={{
                          color:
                            "#777",
                          marginTop:
                            "4px",
                        }}
                      >
                        Số lượng:{" "}
                        {
                          item.quantity
                        }
                      </div>
                    </div>

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

            {/* THANH TOÁN */}

            <div
              style={{
                background:
                  "#f8f9fa",
                padding:
                  "18px",
                borderRadius:
                  "10px",
                marginBottom:
                  "20px",
              }}
            >
              <p>
                <strong>
                  Phương thức thanh toán:
                </strong>{" "}
                {selectedOrder.payment ===
                "BANK"
                  ? "🏦 Chuyển khoản"
                  : "💵 COD"}
              </p>

              <p
                style={{
                  fontSize:
                    "20px",
                }}
              >
                <strong>
                  Tổng tiền:
                </strong>{" "}
                <span
                  style={{
                    color:
                      "#d62828",
                    fontWeight:
                      "700",
                  }}
                >
                  {formatPrice(
                    selectedOrder.total
                  )}
                </span>
              </p>
            </div>

            {/* TRẠNG THÁI */}

            <div>
              <h3>
                🔄 Cập nhật trạng thái
              </h3>

              <div
                style={{
                  display:
                    "grid",
                  gridTemplateColumns:
                    "repeat(2, 1fr)",
                  gap: "10px",
                }}
              >

                <button
                  onClick={() =>
                    updateOrderStatus(
                      selectedOrder.id,
                      "Chờ xử lý"
                    )
                  }
                  style={
                    statusButtonStyle
                  }
                >
                  ⏳ Chờ xử lý
                </button>

                <button
                  onClick={() =>
                    updateOrderStatus(
                      selectedOrder.id,
                      "Đang giao"
                    )
                  }
                  style={
                    statusButtonStyle
                  }
                >
                  🚚 Đang giao
                </button>

                <button
                  onClick={() =>
                    updateOrderStatus(
                      selectedOrder.id,
                      "Đã giao"
                    )
                  }
                  style={
                    statusButtonStyle
                  }
                >
                  ✅ Đã giao
                </button>

                <button
                  onClick={() =>
                    updateOrderStatus(
                      selectedOrder.id,
                      "Đã hủy"
                    )
                  }
                  style={{
                    ...statusButtonStyle,
                    background:
                      "#fee2e2",
                    color:
                      "#b91c1c",
                  }}
                >
                  ❌ Đã hủy
                </button>

              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

// ==========================================
// STYLE
// ==========================================

const thStyle = {
  padding: "15px",
  textAlign: "left",
  fontSize: "14px",
  color: "#444",
  whiteSpace: "nowrap",
};

const tdStyle = {
  padding: "15px",
  fontSize: "14px",
  verticalAlign: "middle",
};

const statusStyle = {
  display: "inline-block",
  padding: "6px 10px",
  borderRadius: "20px",
  fontSize: "12px",
  fontWeight: "600",
  whiteSpace: "nowrap",
};

const statusButtonStyle = {
  padding: "11px",
  border: "none",
  borderRadius: "8px",
  background: "#f1f1f1",
  color: "#333",
  cursor: "pointer",
  fontWeight: "600",
};

export default NhanVien;
