import { useEffect, useState } from "react";
import { books as defaultBooks } from "../data/books";
import { api } from "../api";

function Admin({ user, onLogout }) {
  // ================================
  // MENU
  // ================================
  const [activeMenu, setActiveMenu] = useState("books");

  // ================================
  // DANH SÁCH SÁCH
  // ================================
  const [books, setBooks] = useState(() => {
    const savedBooks = localStorage.getItem("shopbooks_books");

    if (savedBooks) {
      return JSON.parse(savedBooks);
    }

    return defaultBooks;
  });

  // ================================
  // DANH SÁCH KHÁCH HÀNG
  // ================================
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState(() =>
    JSON.parse(localStorage.getItem("shopbooks_orders") || "[]")
  );

  // ================================
  // FORM SÁCH
  // ================================
  const [editingBook, setEditingBook] = useState(null);

  const [bookName, setBookName] = useState("");
  const [category, setCategory] = useState("Văn học");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");

  // ================================
  // TÌM KHÁCH HÀNG
  // ================================
  const [searchCustomer, setSearchCustomer] = useState("");

  useEffect(() => {
    localStorage.setItem(
      "shopbooks_books",
      JSON.stringify(books)
    );
  }, [books]);

  useEffect(() => {
    api.books().then((serverBooks) => {
      if (!Array.isArray(serverBooks)) return;
      setBooks(serverBooks);
      localStorage.setItem("shopbooks_books", JSON.stringify(serverBooks));
    }).catch(() => {});
  }, []);

  // ================================
  // ĐỌC KHÁCH HÀNG
  // ================================
  useEffect(() => {
    const savedUsers = JSON.parse(localStorage.getItem("shopbooks_users") || "[]");
    setCustomers(savedUsers);

    api.users()
      .then((serverUsers) => {
        if (!Array.isArray(serverUsers)) return;
        setCustomers(serverUsers);
        localStorage.setItem("shopbooks_users", JSON.stringify(serverUsers));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const refreshOrders = () =>
      setOrders(JSON.parse(localStorage.getItem("shopbooks_orders") || "[]"));
    window.addEventListener("focus", refreshOrders);
    api.orders().then(setOrders).catch(() => {});
    return () => window.removeEventListener("focus", refreshOrders);
  }, []);

  const updateOrderStatus = async (orderId, status) => {
    const previousOrders = [...orders];
    const updatedOrders = orders.map((order) =>
      order.id === orderId ? { ...order, status } : order
    );

    setOrders(updatedOrders);
    localStorage.setItem("shopbooks_orders", JSON.stringify(updatedOrders));

    try {
      await api.updateOrderStatus(orderId, status);
      const refreshedOrders = await api.orders();
      if (Array.isArray(refreshedOrders)) {
        setOrders(refreshedOrders);
        localStorage.setItem("shopbooks_orders", JSON.stringify(refreshedOrders));
      }
      window.showToast?.(
        status === "Đã duyệt" ? "Đã duyệt đơn hàng." : status === "Từ chối" ? "Đã từ chối đơn hàng." : `Đã cập nhật trạng thái thành "${status}".`
      );
    } catch (error) {
      setOrders(previousOrders);
      localStorage.setItem("shopbooks_orders", JSON.stringify(previousOrders));
      window.showToast?.("Chưa thể đồng bộ MySQL. Đơn vẫn được lưu cục bộ.", "error");
    }
  };

  const updateStock = (bookId, stock) => {
    setBooks((currentBooks) => currentBooks.map((book) =>
      book.id === bookId ? { ...book, stock: Math.max(0, Number(stock) || 0) } : book
    ));
    window.showToast?.("Đã cập nhật hàng tồn kho.");
  };

  // ================================
  // XÓA FORM
  // ================================
  const clearForm = () => {
    setEditingBook(null);
    setBookName("");
    setCategory("Văn học");
    setPrice("");
    setImage("");
    setDescription("");
  };

  // ================================
  // MỞ THÊM SÁCH
  // ================================
  const handleOpenAddBook = () => {
    clearForm();
    setActiveMenu("addBook");
  };

  // ================================
  // MỞ SỬA SÁCH
  // ================================
  const handleEditBook = (book) => {
    setEditingBook(book);

    setBookName(book.name || "");
    setCategory(book.category || "Văn học");
    setPrice(book.price || "");
    setImage(book.image || "");
    setDescription(book.description || "");

    setActiveMenu("editBook");
  };

  // ================================
  // LƯU SÁCH
  // ================================
  const handleSaveBook = async (e) => {
    e.preventDefault();

    if (!bookName.trim()) {
      window.showToast?.("Vui lòng nhập tên sách!", "error");
      return;
    }

    if (!price || Number(price) <= 0) {
      window.showToast?.("Vui lòng nhập giá sách hợp lệ!", "error");
      return;
    }

    if (!image.trim()) {
      window.showToast?.("Vui lòng nhập link hình ảnh!", "error");
      return;
    }

    // ================================
    // SỬA
    // ================================
    if (editingBook) {
      const bookData = {
        name: bookName.trim(), category, price: Number(price), image: image.trim(),
        description: description.trim(), stock: Number(editingBook.stock) || 0,
      };
      await api.updateBook(editingBook.id, bookData);
      const updatedBooks = books.map((book) => {
        if (book.id === editingBook.id) {
          return { ...book, ...bookData };
        }

        return book;
      });

      setBooks(updatedBooks);

      window.showToast?.("Cập nhật sách thành công!");

      clearForm();
      setActiveMenu("books");

      return;
    }

    // ================================
    // THÊM
    // ================================
    const newBook = {
      name: bookName.trim(),
      category: category,
      price: Number(price),
      image: image.trim(),
      description: description.trim(),
      stock: 0,
    };
    const createdBook = await api.createBook(newBook);
    newBook.id = createdBook.id;

    setBooks((currentBooks) => [
      ...currentBooks,
      newBook,
    ]);

    window.showToast?.("Thêm sách thành công!");

    clearForm();
    setActiveMenu("books");
  };

  // ================================
  // XÓA SÁCH
  // ================================
  const handleDeleteBook = (id) => {
    const book = books.find(
      (item) => item.id === id
    );

    if (!book) {
      return;
    }

    const confirmDelete = window.confirm(
      `Bạn có chắc muốn xóa "${book.name}" không?`
    );

    if (!confirmDelete) {
      return;
    }

    setBooks((currentBooks) =>
      currentBooks.filter(
        (item) => item.id !== id
      )
    );

    api.deleteBook(id).catch(() => {});

    window.showToast?.("Xóa sách thành công!");
  };

  // ================================
  // XÓA KHÁCH HÀNG
  // ================================
  const handleDeleteCustomer = (email) => {
    const confirmDelete = window.confirm(
      `Bạn có chắc muốn xóa tài khoản ${email} không?`
    );

    if (!confirmDelete) {
      return;
    }

    const newCustomers = customers.filter(
      (customer) =>
        customer.email !== email
    );

    setCustomers(newCustomers);

    localStorage.setItem(
      "shopbooks_users",
      JSON.stringify(newCustomers)
    );

    window.showToast?.("Xóa tài khoản thành công!");
  };

  // ================================
  // TÌM KIẾM KHÁCH HÀNG
  // ================================
  const filteredCustomers = customers.filter(
    (customer) => {
      const keyword =
        searchCustomer
          .toLowerCase()
          .trim();

      return (
        customer.hoTen
          ?.toLowerCase()
          .includes(keyword) ||
        customer.email
          ?.toLowerCase()
          .includes(keyword)
      );
    }
  );

  // ================================
  // FORMAT GIÁ
  // ================================
  const formatPrice = (price) => {
    return (
      Number(price).toLocaleString("vi-VN") +
      " ₫"
    );
  };
  const orderQuantity = (order) =>
    (order.items || []).reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  const totalRevenue = orders
    .filter((order) => !["Đã hủy", "Từ chối"].includes(order.status))
    .reduce((sum, order) => sum + Number(order.total || 0), 0);
  const approvedRevenue = orders
    .filter((order) => ["Đã duyệt", "Đang giao", "Đã giao"].includes(order.status))
    .reduce((sum, order) => sum + Number(order.total || 0), 0);

  // ================================
  // FORM DÙNG CHUNG
  // ================================
  const BookForm = () => {
    return (
      <div
        style={{
          maxWidth: "850px",
          margin: "0 auto",
          background: "#ffffff",
          borderRadius: "18px",
          padding: "35px 45px",
          boxShadow:
            "0 8px 30px rgba(0,0,0,0.08)",
        }}
      >
        {/* TIÊU ĐỀ */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "30px",
          }}
        >
          <div
            style={{
              fontSize: "42px",
              marginBottom: "8px",
            }}
          >
            {editingBook ? "✏️" : "➕"}
          </div>

          <h2
            style={{
              margin: 0,
              fontSize: "28px",
              color: "#222",
            }}
          >
            {editingBook
              ? "Sửa thông tin sách"
              : "Thêm sách mới"}
          </h2>

          <p
            style={{
              color: "#777",
              marginTop: "8px",
            }}
          >
            {editingBook
              ? "Cập nhật thông tin sản phẩm"
              : "Nhập thông tin sách cần thêm"}
          </p>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSaveBook}
        >
          {/* TÊN */}
          <div
            style={{
              marginBottom: "20px",
            }}
          >
            <label
              style={{
                display: "block",
                fontWeight: "600",
                marginBottom: "8px",
              }}
            >
              Tên sách
            </label>

            <input
              type="text"
              value={bookName}
              onChange={(e) =>
                setBookName(
                  e.target.value
                )
              }
              placeholder="Nhập tên sách"
              style={inputStyle}
            />
          </div>

          {/* DANH MỤC */}
          <div
            style={{
              marginBottom: "20px",
            }}
          >
            <label
              style={{
                display: "block",
                fontWeight: "600",
                marginBottom: "8px",
              }}
            >
              Danh mục
            </label>

            <select
              value={category}
              onChange={(e) =>
                setCategory(
                  e.target.value
                )
              }
              style={inputStyle}
            >
              <option value="Văn học">
                Văn học
              </option>

              <option value="Kinh tế">
                Kinh tế
              </option>

              <option value="Kỹ năng">
                Kỹ năng
              </option>

              <option value="Ngoại ngữ">
                Ngoại ngữ
              </option>
            </select>
          </div>

          {/* GIÁ */}
          <div
            style={{
              marginBottom: "20px",
            }}
          >
            <label
              style={{
                display: "block",
                fontWeight: "600",
                marginBottom: "8px",
              }}
            >
              Giá sách
            </label>

            <input
              type="number"
              value={price}
              onChange={(e) =>
                setPrice(
                  e.target.value
                )
              }
              placeholder="Ví dụ: 79000"
              style={inputStyle}
            />
          </div>

          {/* HÌNH */}
          <div
            style={{
              marginBottom: "20px",
            }}
          >
            <label
              style={{
                display: "block",
                fontWeight: "600",
                marginBottom: "8px",
              }}
            >
              Link hình ảnh
            </label>

            <input
              type="text"
              value={image}
              onChange={(e) =>
                setImage(
                  e.target.value
                )
              }
              placeholder="https://..."
              style={inputStyle}
            />
          </div>

          {/* XEM ẢNH */}
          {image && (
            <div
              style={{
                marginBottom: "20px",
                textAlign: "center",
              }}
            >
              <img
                src={image}
                alt="Xem trước"
                style={{
                  width: "110px",
                  height: "150px",
                  objectFit: "cover",
                  borderRadius: "10px",
                  border:
                    "1px solid #ddd",
                }}
                onError={(e) => {
                  e.currentTarget.style.display =
                    "none";
                }}
              />
            </div>
          )}

          {/* MÔ TẢ */}
          <div
            style={{
              marginBottom: "25px",
            }}
          >
            <label
              style={{
                display: "block",
                fontWeight: "600",
                marginBottom: "8px",
              }}
            >
              Mô tả sách
            </label>

            <textarea
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
              placeholder="Nhập mô tả sách..."
              rows="5"
              style={{
                ...inputStyle,
                resize: "vertical",
                minHeight: "130px",
              }}
            />
          </div>

          {/* NÚT */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "12px",
            }}
          >
            <button
              type="button"
              onClick={() => {
                clearForm();
                setActiveMenu("books");
              }}
              style={{
                padding: "12px 25px",
                border: "none",
                borderRadius: "9px",
                background: "#eeeeee",
                color: "#333",
                fontWeight: "600",
                cursor: "pointer",
                fontSize: "15px",
              }}
            >
              ← Quay lại
            </button>

            <button
              type="submit"
              style={{
                padding: "12px 25px",
                border: "none",
                borderRadius: "9px",
                background: "#d62828",
                color: "white",
                fontWeight: "600",
                cursor: "pointer",
                fontSize: "15px",
              }}
            >
              💾{" "}
              {editingBook
                ? "Cập nhật sách"
                : "Lưu sách"}
            </button>
          </div>
        </form>
      </div>
    );
  };

  // ================================
  // GIAO DIỆN
  // ================================
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        background: "#f4f5f9",
      }}
    >

      {/* =================================
          SIDEBAR
      ================================= */}
      <aside
        style={{
          width: "260px",
          minHeight: "100vh",
          background: "#ffffff",
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
            padding: "0 25px",
            borderBottom:
              "1px solid #eeeeee",
            fontSize: "23px",
            fontWeight: "700",
            color: "#d62828",
          }}
        >
          📚 SHOPBOOKS
        </div>

        {/* USER */}
        <div
          style={{
            padding: "25px 20px",
            textAlign: "center",
            borderBottom:
              "1px solid #eeeeee",
          }}
        >
          <div
            style={{
              fontSize: "38px",
              marginBottom: "8px",
            }}
          >
            👤
          </div>

          <strong
            style={{
              display: "block",
              fontSize: "18px",
            }}
          >
            {user?.hoTen || "Admin"}
          </strong>

          <span
            style={{
              color: "#777",
              display: "block",
              marginTop: "5px",
            }}
          >
            Quản trị viên
          </span>
        </div>

        {/* MENU */}
        <div
          style={{
            padding: "20px 13px",
          }}
        >

          {/* QUẢN LÝ SÁCH */}
          <button
            onClick={() => {
              clearForm();
              setActiveMenu("books");
            }}
            style={menuStyle(
              activeMenu === "books"
            )}
          >
            <span>📚</span>
            <span>Quản lý sách</span>
          </button>

          {/* THÊM SÁCH */}
          <button
            onClick={
              handleOpenAddBook
            }
            style={menuStyle(
              activeMenu === "addBook"
            )}
          >
            <span>➕</span>
            <span>Thêm sách</span>
          </button>

          {/* KHÁCH HÀNG */}
          <button
            onClick={() => {
              clearForm();
              setActiveMenu(
                "customers"
              );
            }}
            style={menuStyle(
              activeMenu === "customers"
            )}
          >
            <span>👥</span>
            <span>Khách hàng</span>
          </button>

          <button
            onClick={() => { clearForm(); setActiveMenu("orders"); }}
            style={menuStyle(activeMenu === "orders")}
          >
            <span>📦</span>
            <span>Quản lý đơn hàng</span>
          </button>

          <button
            onClick={() => { clearForm(); setActiveMenu("revenue"); }}
            style={menuStyle(activeMenu === "revenue")}
          >
            <span>📈</span>
            <span>Doanh thu</span>
          </button>

          <button
            onClick={() => { clearForm(); setActiveMenu("inventory"); }}
            style={menuStyle(activeMenu === "inventory")}
          >
            <span>🏷️</span>
            <span>Hàng tồn kho</span>
          </button>

          {/* ĐĂNG XUẤT */}
          <button
            type="button"
            onClick={onLogout}
            style={{
              ...menuStyle(false),
              marginTop: "10px",
            }}
          >
            <span>🚪</span>
            <span>Đăng xuất</span>
          </button>

        </div>
      </aside>

      {/* =================================
          MAIN
      ================================= */}
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
            background: "#ffffff",
            padding: "25px 35px",
            borderBottom:
              "1px solid #e5e5e5",
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: "32px",
              color: "#222",
            }}
          >
            {activeMenu === "books" &&
              "Quản lý sách"}

            {activeMenu === "addBook" &&
              "Thêm sách"}

            {activeMenu === "editBook" &&
              "Sửa sách"}

            {activeMenu === "customers" &&
              "Khách hàng"}
            {activeMenu === "orders" &&
              "Quản lý đơn hàng"}
            {activeMenu === "revenue" &&
              "Doanh thu"}
            {activeMenu === "inventory" &&
              "Hàng tồn kho"}
          </h1>

          <p
            style={{
              margin: "8px 0 0",
              color: "#777",
            }}
          >
            Xin chào{" "}
            {user?.hoTen ||
              "Quản trị viên"}
          </p>
        </div>

        {/* CONTENT */}
        <div
          style={{
            padding: "35px",
          }}
        >

          {/* =================================
              QUẢN LÝ SÁCH
          ================================= */}
          {activeMenu === "books" && (
            <>
              {/* THỐNG KÊ */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(2, 1fr)",
                  gap: "20px",
                  marginBottom: "25px",
                }}
              >

                <div
                  style={statCardStyle}
                >
                  <div
                    style={{
                      fontSize: "35px",
                    }}
                  >
                    📚
                  </div>

                  <div>
                    <div
                      style={{
                        color: "#777",
                        marginBottom: "5px",
                      }}
                    >
                      Tổng số sách
                    </div>

                    <strong
                      style={{
                        fontSize: "25px",
                      }}
                    >
                      {books.length}
                    </strong>
                  </div>
                </div>

                <div
                  style={statCardStyle}
                >
                  <div
                    style={{
                      fontSize: "35px",
                    }}
                  >
                    👥
                  </div>

                  <div>
                    <div
                      style={{
                        color: "#777",
                        marginBottom: "5px",
                      }}
                    >
                      Khách hàng
                    </div>

                    <strong
                      style={{
                        fontSize: "25px",
                      }}
                    >
                      {customers.length}
                    </strong>
                  </div>
                </div>

              </div>

              {/* BẢNG */}
              <div
                style={{
                  background: "#fff",
                  borderRadius: "15px",
                  boxShadow:
                    "0 5px 20px rgba(0,0,0,0.06)",
                  overflow: "hidden",
                }}
              >

                <div
                  style={{
                    padding: "25px",
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
                      Danh sách sách
                    </h2>

                    <p
                      style={{
                        margin:
                          "6px 0 0",
                        color: "#777",
                      }}
                    >
                      Thêm, sửa hoặc xóa
                      sản phẩm
                    </p>
                  </div>

                  <button
                    onClick={
                      handleOpenAddBook
                    }
                    style={{
                      border: "none",
                      background:
                        "#d62828",
                      color: "#fff",
                      padding:
                        "11px 18px",
                      borderRadius: "8px",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                  >
                    ➕ Thêm sách
                  </button>
                </div>

                <div
                  style={{
                    overflowX: "auto",
                  }}
                >
                  <table
                    style={{
                      width: "100%",
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
                        <th style={thStyle}>
                          ID
                        </th>

                        <th style={thStyle}>
                          Hình ảnh
                        </th>

                        <th style={thStyle}>
                          Tên sách
                        </th>

                        <th style={thStyle}>
                          Danh mục
                        </th>

                        <th style={thStyle}>
                          Giá
                        </th>

                        <th style={thStyle}>
                          Thao tác
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {books.map(
                        (book) => (
                          <tr
                            key={book.id}
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
                              {book.id}
                            </td>

                            <td
                              style={
                                tdStyle
                              }
                            >
                              <img
                                src={
                                  book.image
                                }
                                alt={
                                  book.name
                                }
                                style={{
                                  width:
                                    "55px",
                                  height:
                                    "75px",
                                  objectFit:
                                    "cover",
                                  borderRadius:
                                    "7px",
                                }}
                              />
                            </td>

                            <td
                              style={
                                tdStyle
                              }
                            >
                              <strong>
                                {book.name}
                              </strong>
                            </td>

                            <td
                              style={
                                tdStyle
                              }
                            >
                              {book.category}
                            </td>

                            <td
                              style={
                                tdStyle
                              }
                            >
                              <strong>
                                {formatPrice(
                                  book.price
                                )}
                              </strong>
                            </td>

                            <td
                              style={
                                tdStyle
                              }
                            >
                              <button
                                onClick={() =>
                                  handleEditBook(
                                    book
                                  )
                                }
                                style={{
                                  padding:
                                    "7px 12px",
                                  marginRight:
                                    "7px",
                                  border:
                                    "1px solid #ddd",
                                  background:
                                    "#fff",
                                  borderRadius:
                                    "6px",
                                  cursor:
                                    "pointer",
                                }}
                              >
                                ✏️ Sửa
                              </button>

                              <button
                                onClick={() =>
                                  handleDeleteBook(
                                    book.id
                                  )
                                }
                                style={{
                                  padding:
                                    "7px 12px",
                                  border:
                                    "none",
                                  background:
                                    "#fee2e2",
                                  color:
                                    "#c62828",
                                  borderRadius:
                                    "6px",
                                  cursor:
                                    "pointer",
                                }}
                              >
                                🗑 Xóa
                              </button>
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* =================================
              THÊM SÁCH
          ================================= */}
          {activeMenu === "addBook" && (
            <BookForm />
          )}

          {/* =================================
              SỬA SÁCH
          ================================= */}
          {activeMenu === "editBook" && (
            <BookForm />
          )}

          {activeMenu === "orders" && (
            <div style={panelStyle}>
              <div style={panelHeaderStyle}>
                <div><h2 style={{ margin: 0 }}>📦 Đơn hàng khách đã đặt</h2><p style={panelDescriptionStyle}>Theo dõi, duyệt hoặc từ chối đơn hàng đang chờ xử lý.</p></div>
                <span style={countBadgeStyle}>{orders.length} đơn hàng</span>
              </div>
              <div style={{ overflowX: "auto" }}>
                <table style={tableStyle}><thead><tr style={{ background: "#f8f8f8" }}><th style={thStyle}>Mã đơn</th><th style={thStyle}>Khách hàng</th><th style={thStyle}>Thời gian đặt</th><th style={thStyle}>Số lượng sách</th><th style={thStyle}>Tổng tiền</th><th style={thStyle}>Trạng thái</th><th style={thStyle}>Thao tác</th></tr></thead>
                  <tbody>{orders.length === 0 ? <tr><td colSpan="7" style={{ ...tdStyle, textAlign: "center", color: "#777", padding: "40px" }}>Chưa có đơn hàng nào.</td></tr> : [...orders].reverse().map((order) => <tr key={order.id} style={{ borderTop: "1px solid #eee" }}>
                    <td style={tdStyle}><strong>#{order.id}</strong></td><td style={tdStyle}><strong>{order.customer || "Khách hàng"}</strong><br /><small style={{ color: "#777" }}>{order.phone || order.customerEmail || ""}</small></td><td style={tdStyle}>{order.createdAt || "Chưa có thời gian"}</td><td style={tdStyle}>{orderQuantity(order)} cuốn</td><td style={tdStyle}><strong>{formatPrice(order.total)}</strong></td><td style={tdStyle}><span style={statusStyle(order.status)}>{order.status || "Chờ xử lý"}</span></td>
                    <td style={tdStyle}>{(order.status || "Chờ xử lý") === "Chờ xử lý" ? <div style={{ display: "flex", gap: "7px" }}><button onClick={() => updateOrderStatus(order.id, "Đã duyệt")} style={approveButtonStyle}>✓ Duyệt</button><button onClick={() => updateOrderStatus(order.id, "Từ chối")} style={rejectButtonStyle}>✕ Từ chối</button></div> : <span style={{ color: "#777" }}>Đã xử lý</span>}</td>
                  </tr>)}</tbody>
                </table>
              </div>
            </div>
          )}

          {activeMenu === "revenue" && (
            <><div style={revenueGridStyle}><RevenueCard icon="💰" label="Tổng giá trị đơn hàng" value={formatPrice(totalRevenue)} description={orders.length + " đơn hàng đã tiếp nhận"} /><RevenueCard icon="✅" label="Doanh thu đã duyệt" value={formatPrice(approvedRevenue)} description="Từ các đơn đã duyệt hoặc đang giao" /><RevenueCard icon="⏳" label="Chờ xử lý" value={orders.filter((order) => (order.status || "Chờ xử lý") === "Chờ xử lý").length + " đơn"} description="Cần được kiểm tra và phản hồi" /></div>
            <div style={panelStyle}><div style={panelHeaderStyle}><div><h2 style={{ margin: 0 }}>Tổng quan doanh thu theo đơn</h2><p style={panelDescriptionStyle}>Không tính các đơn đã hủy hoặc từ chối.</p></div></div><div style={{ overflowX: "auto" }}><table style={tableStyle}><thead><tr style={{ background: "#f8f8f8" }}><th style={thStyle}>Mã đơn</th><th style={thStyle}>Ngày đặt</th><th style={thStyle}>Khách hàng</th><th style={thStyle}>Số tiền</th><th style={thStyle}>Trạng thái</th></tr></thead><tbody>{[...orders].reverse().filter((order) => !["Đã hủy", "Từ chối"].includes(order.status)).map((order) => <tr key={order.id} style={{ borderTop: "1px solid #eee" }}><td style={tdStyle}>#{order.id}</td><td style={tdStyle}>{order.createdAt}</td><td style={tdStyle}>{order.customer}</td><td style={tdStyle}><strong>{formatPrice(order.total)}</strong></td><td style={tdStyle}><span style={statusStyle(order.status)}>{order.status || "Chờ xử lý"}</span></td></tr>)}{orders.length === 0 && <tr><td colSpan="5" style={{ ...tdStyle, textAlign: "center" }}>Chưa có dữ liệu doanh thu.</td></tr>}</tbody></table></div></div></>
          )}

          {activeMenu === "inventory" && (
            <div style={panelStyle}><div style={panelHeaderStyle}><div><h2 style={{ margin: 0 }}>🏷️ Quản lý hàng tồn kho</h2><p style={panelDescriptionStyle}>Cập nhật số lượng tồn cho từng đầu sách.</p></div><span style={countBadgeStyle}>{books.reduce((sum, book) => sum + Number(book.stock || 0), 0)} cuốn tồn</span></div><div style={{ overflowX: "auto" }}><table style={tableStyle}><thead><tr style={{ background: "#f8f8f8" }}><th style={thStyle}>Sách</th><th style={thStyle}>Danh mục</th><th style={thStyle}>Giá</th><th style={thStyle}>Số lượng tồn</th><th style={thStyle}>Tình trạng</th></tr></thead><tbody>{books.map((book) => { const stock = Number(book.stock || 0); return <tr key={book.id} style={{ borderTop: "1px solid #eee" }}><td style={tdStyle}><strong>{book.name}</strong></td><td style={tdStyle}>{book.category}</td><td style={tdStyle}>{formatPrice(book.price)}</td><td style={tdStyle}><input aria-label={"Số lượng tồn " + book.name} type="number" min="0" defaultValue={stock} onBlur={(event) => updateStock(book.id, event.target.value)} style={stockInputStyle} /></td><td style={tdStyle}><span style={inventoryStatusStyle(stock)}>{stock === 0 ? "Hết hàng" : stock < 5 ? "Sắp hết" : "Còn hàng"}</span></td></tr>; })}</tbody></table></div></div>
          )}

          {/* =================================
              KHÁCH HÀNG
          ================================= */}
          {activeMenu === "customers" && (
            <div
              style={{
                background: "#fff",
                borderRadius: "15px",
                boxShadow:
                  "0 5px 20px rgba(0,0,0,0.06)",
                overflow: "hidden",
              }}
            >

              <div
                style={{
                  padding: "25px",
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems: "center",
                  gap: "20px",
                }}
              >
                <div>
                  <h2
                    style={{
                      margin: 0,
                    }}
                  >
                    👥 Danh sách khách hàng
                  </h2>

                  <p
                    style={{
                      margin:
                        "6px 0 0",
                      color: "#777",
                    }}
                  >
                    Quản lý tài khoản
                    khách hàng
                  </p>
                </div>

                <input
                  type="text"
                  value={
                    searchCustomer
                  }
                  onChange={(e) =>
                    setSearchCustomer(
                      e.target.value
                    )
                  }
                  placeholder="🔍 Tìm tên hoặc email..."
                  style={{
                    width: "280px",
                    padding:
                      "11px 14px",
                    border:
                      "1px solid #ddd",
                    borderRadius:
                      "8px",
                    outline: "none",
                  }}
                />
              </div>

              <div
                style={{
                  overflowX: "auto",
                }}
              >
                <table
                  style={{
                    width: "100%",
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
                      <th style={thStyle}>
                        STT
                      </th>

                      <th style={thStyle}>
                        Họ tên
                      </th>

                      <th style={thStyle}>
                        Email
                      </th>

                      <th style={thStyle}>
                        Vai trò
                      </th>

                      <th style={thStyle}>
                        Thao tác
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredCustomers.length ===
                    0 ? (
                      <tr>
                        <td
                          colSpan="5"
                          style={{
                            textAlign:
                              "center",
                            padding:
                              "40px",
                            color:
                              "#777",
                          }}
                        >
                          Không có khách
                          hàng
                        </td>
                      </tr>
                    ) : (
                      filteredCustomers.map(
                        (
                          customer,
                          index
                        ) => (
                          <tr
                            key={
                              customer.email
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
                              {index + 1}
                            </td>

                            <td
                              style={
                                tdStyle
                              }
                            >
                              <strong>
                                {
                                  customer.hoTen
                                }
                              </strong>
                            </td>

                            <td
                              style={
                                tdStyle
                              }
                            >
                              {
                                customer.email
                              }
                            </td>

                            <td
                              style={
                                tdStyle
                              }
                            >
                              {
                                customer.vaiTro ||
                                "KhachHang"
                              }
                            </td>

                            <td
                              style={
                                tdStyle
                              }
                            >
                              <button
                                onClick={() =>
                                  handleDeleteCustomer(
                                    customer.email
                                  )
                                }
                                style={{
                                  padding:
                                    "8px 13px",
                                  border:
                                    "none",
                                  background:
                                    "#fee2e2",
                                  color:
                                    "#c62828",
                                  borderRadius:
                                    "6px",
                                  cursor:
                                    "pointer",
                                }}
                              >
                                🗑 Xóa
                              </button>
                            </td>
                          </tr>
                        )
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

function RevenueCard({ icon, label, value, description }) {
  return (
    <div style={statCardStyle}>
      <div style={{ fontSize: "35px" }}>{icon}</div>
      <div><div style={{ color: "#777", marginBottom: "5px" }}>{label}</div><strong style={{ fontSize: "23px" }}>{value}</strong><small style={{ display: "block", color: "#999", marginTop: "7px" }}>{description}</small></div>
    </div>
  );
}

// ====================================
// STYLE
// ====================================

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "13px 15px",
  border: "1px solid #d9d9d9",
  borderRadius: "9px",
  fontSize: "15px",
  fontFamily: "inherit",
  outline: "none",
  background: "#fff",
};

const menuStyle = (active) => ({
  width: "100%",
  display: "flex",
  alignItems: "center",
  gap: "12px",
  padding: "13px 15px",
  marginBottom: "7px",
  border: "none",
  borderRadius: "9px",
  background: active
    ? "#d62828"
    : "transparent",
  color: active
    ? "#fff"
    : "#444",
  fontSize: "15px",
  fontWeight: active
    ? "600"
    : "500",
  cursor: "pointer",
  textAlign: "left",
});

const statCardStyle = {
  background: "#fff",
  borderRadius: "15px",
  padding: "25px",
  display: "flex",
  alignItems: "center",
  gap: "20px",
  boxShadow:
    "0 5px 20px rgba(0,0,0,0.06)",
};

const panelStyle = {
  background: "#fff",
  borderRadius: "15px",
  boxShadow: "0 5px 20px rgba(0,0,0,0.06)",
  overflow: "hidden",
};

const panelHeaderStyle = {
  padding: "25px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "20px",
};

const panelDescriptionStyle = {
  margin: "6px 0 0",
  color: "#777",
};

const countBadgeStyle = {
  background: "#fff1f1",
  color: "#d62828",
  padding: "8px 12px",
  borderRadius: "20px",
  fontSize: "13px",
  fontWeight: "600",
  whiteSpace: "nowrap",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
};

const revenueGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gap: "20px",
  marginBottom: "25px",
};

const approveButtonStyle = {
  padding: "7px 10px",
  border: "none",
  borderRadius: "6px",
  background: "#dcfce7",
  color: "#166534",
  fontWeight: "600",
  cursor: "pointer",
};

const rejectButtonStyle = {
  padding: "7px 10px",
  border: "none",
  borderRadius: "6px",
  background: "#fee2e2",
  color: "#b91c1c",
  fontWeight: "600",
  cursor: "pointer",
};

const statusStyle = (status) => {
  const currentStatus = status || "Chờ xử lý";
  const styles = {
    "Chờ xử lý": { background: "#fef3c7", color: "#92400e" },
    "Đã duyệt": { background: "#dcfce7", color: "#166534" },
    "Đang giao": { background: "#dbeafe", color: "#1d4ed8" },
    "Đã giao": { background: "#dcfce7", color: "#166534" },
    "Từ chối": { background: "#fee2e2", color: "#b91c1c" },
    "Đã hủy": { background: "#fee2e2", color: "#b91c1c" },
  };
  return {
    ...(styles[currentStatus] || styles["Chờ xử lý"]),
    padding: "6px 9px",
    borderRadius: "14px",
    fontSize: "12px",
    fontWeight: "600",
    whiteSpace: "nowrap",
  };
};

const stockInputStyle = {
  width: "72px",
  padding: "7px",
  border: "1px solid #ddd",
  borderRadius: "6px",
  font: "inherit",
};

const inventoryStatusStyle = (stock) => ({
  ...statusStyle(stock === 0 ? "Từ chối" : stock < 5 ? "Chờ xử lý" : "Đã duyệt"),
});

const thStyle = {
  padding: "15px",
  textAlign: "left",
  fontSize: "14px",
  color: "#444",
};

const tdStyle = {
  padding: "15px",
  fontSize: "14px",
  verticalAlign: "middle",
};

export default Admin;
