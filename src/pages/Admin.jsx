import { useEffect, useState } from "react";
import { books as defaultBooks } from "../data/books";

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

  // ================================
  // LƯU SÁCH
  // ================================
  useEffect(() => {
    localStorage.setItem(
      "shopbooks_books",
      JSON.stringify(books)
    );
  }, [books]);

  // ================================
  // ĐỌC KHÁCH HÀNG
  // ================================
  useEffect(() => {
    const savedUsers = JSON.parse(
      localStorage.getItem("shopbooks_users") || "[]"
    );

    setCustomers(savedUsers);
  }, []);

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
  const handleSaveBook = (e) => {
    e.preventDefault();

    if (!bookName.trim()) {
      alert("Vui lòng nhập tên sách!");
      return;
    }

    if (!price || Number(price) <= 0) {
      alert("Vui lòng nhập giá sách hợp lệ!");
      return;
    }

    if (!image.trim()) {
      alert("Vui lòng nhập link hình ảnh!");
      return;
    }

    // ================================
    // SỬA
    // ================================
    if (editingBook) {
      const updatedBooks = books.map((book) => {
        if (book.id === editingBook.id) {
          return {
            ...book,
            name: bookName.trim(),
            category: category,
            price: Number(price),
            image: image.trim(),
            description: description.trim(),
          };
        }

        return book;
      });

      setBooks(updatedBooks);

      alert("Cập nhật sách thành công!");

      clearForm();
      setActiveMenu("books");

      return;
    }

    // ================================
    // THÊM
    // ================================
    const newBook = {
      id: Date.now(),
      name: bookName.trim(),
      category: category,
      price: Number(price),
      image: image.trim(),
      description: description.trim(),
    };

    setBooks((currentBooks) => [
      ...currentBooks,
      newBook,
    ]);

    alert("Thêm sách thành công!");

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

    alert("Xóa sách thành công!");
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

    alert("Xóa tài khoản thành công!");
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