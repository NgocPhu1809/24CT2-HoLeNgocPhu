import { useEffect, useState } from "react";
import "./App.css";

import { books as defaultBooks } from "./data/books";

import ChiTietSach from "./pages/ChiTietSach";
import GioHang from "./pages/GioHang";
import DatHang from "./pages/DatHang";
import DangNhap from "./pages/DangNhap";
import DangKy from "./pages/DangKy";
import Admin from "./pages/Admin";
import NhanVien from "./pages/NhanVien";
import DonHang from "./pages/DonHang";

function App() {
  // ==========================================
  // TÌM KIẾM + DANH MỤC
  // ==========================================

  const [search, setSearch] = useState("");

  const [selectedCategory, setSelectedCategory] =
    useState("Tất cả");

  // ==========================================
  // TRANG HIỆN TẠI
  // ==========================================

  const [selectedBook, setSelectedBook] =
    useState(null);

  const [showCart, setShowCart] =
    useState(false);

  const [showCheckout, setShowCheckout] =
    useState(false);

  const [showOrders, setShowOrders] =
    useState(false);

  const [showLogin, setShowLogin] =
    useState(false);

  const [showRegister, setShowRegister] =
    useState(false);

  // ==========================================
  // NGƯỜI DÙNG ĐĂNG NHẬP
  // ==========================================

  const [loggedInUser, setLoggedInUser] =
    useState(() => {
      const savedUser =
        localStorage.getItem(
          "shopbooks_logged_user"
        );

      return savedUser
        ? JSON.parse(savedUser)
        : null;
    });

  // ==========================================
  // DANH SÁCH SÁCH
  // QUAN TRỌNG: ĐỌC TỪ localStorage
  // ==========================================

  const [books, setBooks] = useState(() => {
    const savedBooks =
      localStorage.getItem(
        "shopbooks_books"
      );

    if (savedBooks) {
      return JSON.parse(savedBooks);
    }

    return defaultBooks;
  });

  // ==========================================
  // GIỎ HÀNG
  // ==========================================

  const [cart, setCart] = useState(() => {
    const savedCart =
      localStorage.getItem(
        "shopbooks_cart"
      );

    return savedCart
      ? JSON.parse(savedCart)
      : [];
  });

  // ==========================================
  // LƯU GIỎ HÀNG
  // ==========================================

  useEffect(() => {
    localStorage.setItem(
      "shopbooks_cart",
      JSON.stringify(cart)
    );
  }, [cart]);

  // ==========================================
  // ĐỒNG BỘ SÁCH TỪ localStorage
  // ==========================================

  useEffect(() => {
    const loadBooks = () => {
      const savedBooks =
        localStorage.getItem(
          "shopbooks_books"
        );

      if (savedBooks) {
        setBooks(JSON.parse(savedBooks));
      }
    };

    // Khi quay lại tab/trang
    window.addEventListener(
      "focus",
      loadBooks
    );

    return () => {
      window.removeEventListener(
        "focus",
        loadBooks
      );
    };
  }, []);

  // ==========================================
  // DANH MỤC
  // ==========================================

  const categories = [
    "Tất cả",
    "Văn học",
    "Kinh tế",
    "Kỹ năng",
    "Ngoại ngữ",
  ];

  // ==========================================
  // LỌC SÁCH
  // ==========================================

  const filteredBooks = books.filter(
    (book) => {
      const matchCategory =
        selectedCategory === "Tất cả" ||
        book.category ===
          selectedCategory;

      const keyword =
        search.toLowerCase().trim();

      const matchSearch =
        book.name
          .toLowerCase()
          .includes(keyword);

      return (
        matchCategory &&
        matchSearch
      );
    }
  );

  // ==========================================
  // THÊM VÀO GIỎ
  // ==========================================

  const addToCart = (book) => {
    if (!loggedInUser) {
      alert(
        "Vui lòng đăng nhập tài khoản khách hàng để mua sách!"
      );

      setSelectedBook(null);
      setShowLogin(true);

      return;
    }

    if (
      loggedInUser.vaiTro ===
        "Admin" ||
      loggedInUser.vaiTro ===
        "NhanVien"
    ) {
      alert(
        "Tài khoản quản trị/nhân viên không thể mua hàng!"
      );

      return;
    }

    setCart((currentCart) => {
      const existingItem =
        currentCart.find(
          (item) =>
            item.id === book.id
        );

      if (existingItem) {
        return currentCart.map(
          (item) =>
            item.id === book.id
              ? {
                  ...item,
                  quantity:
                    Number(
                      item.quantity
                    ) + 1,
                }
              : item
        );
      }

      return [
        ...currentCart,
        {
          ...book,
          quantity: 1,
        },
      ];
    });

    alert(
      `Đã thêm "${book.name}" vào giỏ hàng!`
    );
  };

  // ==========================================
  // CẬP NHẬT SỐ LƯỢNG
  // ==========================================

  const updateQuantity = (
    id,
    newQuantity
  ) => {
    if (newQuantity < 1) {
      return;
    }

    setCart((currentCart) =>
      currentCart.map(
        (item) =>
          item.id === id
            ? {
                ...item,
                quantity:
                  Number(
                    newQuantity
                  ),
              }
            : item
      )
    );
  };

  // ==========================================
  // XÓA KHỎI GIỎ
  // ==========================================

  const removeFromCart = (id) => {
    setCart((currentCart) =>
      currentCart.filter(
        (item) =>
          item.id !== id
      )
    );
  };

  // ==========================================
  // MỞ GIỎ HÀNG
  // ==========================================

  const handleOpenCart = () => {
    if (!loggedInUser) {
      alert(
        "Vui lòng đăng nhập để xem giỏ hàng!"
      );

      setShowLogin(true);

      return;
    }

    if (
      loggedInUser.vaiTro ===
        "Admin" ||
      loggedInUser.vaiTro ===
        "NhanVien"
    ) {
      alert(
        "Tài khoản quản trị/nhân viên không có giỏ hàng!"
      );

      return;
    }

    // Đọc lại giỏ hàng
    const savedCart =
      localStorage.getItem(
        "shopbooks_cart"
      );

    if (savedCart) {
      setCart(
        JSON.parse(savedCart)
      );
    }

    setShowCart(true);
    setShowOrders(false);
    setShowCheckout(false);
    setSelectedBook(null);
  };

  // ==========================================
  // THANH TOÁN
  // ==========================================

  const handleCheckout = () => {
    if (!loggedInUser) {
      alert(
        "Vui lòng đăng nhập để đặt hàng!"
      );

      setShowLogin(true);

      return;
    }

    if (cart.length === 0) {
      alert(
        "Giỏ hàng đang trống!"
      );

      return;
    }

    setShowCart(false);
    setShowOrders(false);
    setShowCheckout(true);
  };

  // ==========================================
  // ĐƠN HÀNG
  // ==========================================

  const handleOpenOrders = () => {
    if (!loggedInUser) {
      alert(
        "Vui lòng đăng nhập để xem đơn hàng!"
      );

      setShowLogin(true);

      return;
    }

    if (
      loggedInUser.vaiTro ===
        "Admin" ||
      loggedInUser.vaiTro ===
        "NhanVien"
    ) {
      alert(
        "Tài khoản quản trị/nhân viên không sử dụng chức năng này!"
      );

      return;
    }

    setShowOrders(true);
    setShowCart(false);
    setShowCheckout(false);
    setSelectedBook(null);
  };

  // ==========================================
  // ĐĂNG XUẤT
  // ==========================================

  const handleLogout = () => {
    localStorage.removeItem(
      "shopbooks_logged_user"
    );

    setLoggedInUser(null);

    setShowLogin(false);
    setShowRegister(false);
    setShowCart(false);
    setShowCheckout(false);
    setShowOrders(false);
    setSelectedBook(null);

    setCart([]);

    localStorage.removeItem(
      "shopbooks_cart"
    );

    alert(
      "Đã đăng xuất tài khoản!"
    );

    // Tải lại dữ liệu sách mới nhất
    // Admin đã thêm/sửa/xóa
    window.location.reload();
  };

  // ==========================================
  // ĐĂNG KÝ
  // ==========================================

  if (showRegister) {
    return (
      <DangKy
        onBack={() =>
          setShowRegister(false)
        }
        onLogin={() => {
          setShowRegister(false);
          setShowLogin(true);
        }}
      />
    );
  }

  // ==========================================
  // ĐĂNG NHẬP
  // ==========================================

  if (showLogin) {
    return (
      <DangNhap
        onBack={() =>
          setShowLogin(false)
        }
        onRegister={() => {
          setShowLogin(false);
          setShowRegister(true);
        }}
        onLoginSuccess={(user) => {
          setLoggedInUser(user);

          localStorage.setItem(
            "shopbooks_logged_user",
            JSON.stringify(user)
          );

          setShowLogin(false);

          alert(
            `Đăng nhập thành công! Xin chào ${user.hoTen}`
          );
        }}
      />
    );
  }

  // ==========================================
  // ADMIN
  // ==========================================

  if (
    loggedInUser &&
    loggedInUser.vaiTro ===
      "Admin"
  ) {
    return (
      <Admin
        user={loggedInUser}
        onLogout={handleLogout}
      />
    );
  }

  // ==========================================
  // NHÂN VIÊN
  // ==========================================

  if (
    loggedInUser &&
    loggedInUser.vaiTro ===
      "NhanVien"
  ) {
    return (
      <NhanVien
        user={loggedInUser}
        onLogout={handleLogout}
      />
    );
  }

  // ==========================================
  // ĐƠN HÀNG
  // ==========================================

  if (showOrders) {
    return (
      <DonHang
        user={loggedInUser}
        onBack={() =>
          setShowOrders(false)
        }
      />
    );
  }

  // ==========================================
  // TỔNG TIỀN
  // ==========================================

  const total = cart.reduce(
    (sum, item) =>
      sum +
      Number(item.price) *
        Number(item.quantity),
    0
  );

  // ==========================================
  // ĐẶT HÀNG
  // ==========================================

  if (showCheckout) {
    return (
      <DatHang
        cart={cart}
        total={total}
        user={loggedInUser}
        onBack={() =>
          setShowCheckout(false)
        }
        onOrderSuccess={(order) => {
          alert(
            `Đặt hàng thành công!\nMã đơn hàng: ${order.id}`
          );

          setCart([]);

          localStorage.removeItem(
            "shopbooks_cart"
          );

          setShowCheckout(false);
          setShowCart(false);
          setShowOrders(false);
        }}
      />
    );
  }

  // ==========================================
  // GIỎ HÀNG
  // ==========================================

  if (showCart) {
    return (
      <GioHang
        cart={cart}
        onBack={() =>
          setShowCart(false)
        }
        onUpdateQuantity={
          updateQuantity
        }
        onRemove={
          removeFromCart
        }
        onCheckout={
          handleCheckout
        }
      />
    );
  }

  // ==========================================
  // CHI TIẾT SÁCH
  // ==========================================

  if (selectedBook) {
    return (
      <ChiTietSach
        book={selectedBook}
        onBack={() =>
          setSelectedBook(null)
        }
        onAddToCart={
          addToCart
        }
      />
    );
  }

  // ==========================================
  // TRANG CHỦ
  // ==========================================

  return (
    <div>

      {/* ======================================
          HEADER
      ====================================== */}

      <header className="header">

        <div className="logo">
          SHOPBOOKS
        </div>

        {/* TÌM KIẾM */}

        <div className="search-box">

          <input
            type="text"
            placeholder="Tìm kiếm sách..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
          />

          <button
            onClick={() => {
              window.scrollTo({
                top: 500,
                behavior:
                  "smooth",
              });
            }}
          >
            🔍 Tìm kiếm
          </button>

        </div>

        {/* HEADER ACTIONS */}

        <div className="header-actions">

          {loggedInUser ? (
            <>
              <span>
                👤 Xin chào{" "}
                {
                  loggedInUser.hoTen
                }
              </span>

              <span
                onClick={
                  handleOpenOrders
                }
                style={{
                  cursor:
                    "pointer",
                }}
              >
                📦 Đơn hàng của tôi
              </span>

              <span
                onClick={
                  handleLogout
                }
                style={{
                  cursor:
                    "pointer",
                }}
              >
                🚪 Đăng xuất
              </span>
            </>
          ) : (
            <span
              onClick={() =>
                setShowLogin(true)
              }
              style={{
                cursor:
                  "pointer",
              }}
            >
              👤 Đăng nhập
            </span>
          )}

          {/* GIỎ HÀNG */}

          <span
            onClick={
              handleOpenCart
            }
            style={{
              cursor:
                "pointer",
            }}
          >
            🛒 Giỏ hàng (
            {cart.reduce(
              (sum, item) =>
                sum +
                Number(
                  item.quantity
                ),
              0
            )}
            )
          </span>

        </div>
      </header>

      {/* ======================================
          MENU DANH MỤC
      ====================================== */}

      <nav className="navbar">

        <ul>

          {categories.map(
            (category) => (
              <li
                key={category}
                onClick={() => {
                  setSelectedCategory(
                    category
                  );

                  setSearch("");

                  setSelectedBook(
                    null
                  );

                  window.scrollTo({
                    top: 0,
                    behavior:
                      "smooth",
                  });
                }}
              >
                {category}
              </li>
            )
          )}

        </ul>

      </nav>

      {/* ======================================
          BANNER
      ====================================== */}

      <section className="banner">

        <div>
          <h1>
            📚 SHOPBOOKS
          </h1>

          <p>
            Thế giới sách dành
            cho bạn
          </p>
        </div>

      </section>

      {/* ======================================
          MAIN
      ====================================== */}

      <main className="container">

        {/* DANH MỤC */}

        <h2 className="section-title">
          Danh mục sách
        </h2>

        <div className="categories">

          {categories
            .filter(
              (category) =>
                category !==
                "Tất cả"
            )
            .map(
              (category) => (
                <div
                  className="category-card"
                  key={
                    category
                  }
                  onClick={() => {
                    setSelectedCategory(
                      category
                    );

                    setSearch("");

                    window.scrollTo({
                      top: 0,
                      behavior:
                        "smooth",
                    });
                  }}
                >
                  <h3>
                    📚{" "}
                    {category}
                  </h3>
                </div>
              )
            )}

        </div>

        {/* TIÊU ĐỀ SÁCH */}

        <h2 className="section-title">

          {search
            ? `Kết quả tìm kiếm: "${search}"`
            : selectedCategory ===
              "Tất cả"
            ? "Tất cả sách"
            : `Sách ${selectedCategory}`}

        </h2>

        {/* KHÔNG CÓ KẾT QUẢ */}

        {filteredBooks.length ===
        0 ? (
          <div className="no-result">

            <h2>
              📚 Không tìm thấy sách
            </h2>

            <p>
              Không có sách phù hợp
              với từ khóa hoặc danh
              mục bạn chọn.
            </p>

            <button
              onClick={() => {
                setSearch("");
                setSelectedCategory(
                  "Tất cả"
                );
              }}
              style={{
                marginTop:
                  "15px",
                padding:
                  "10px 20px",
                border:
                  "none",
                borderRadius:
                  "8px",
                background:
                  "#d62828",
                color:
                  "#fff",
                cursor:
                  "pointer",
              }}
            >
              Xem tất cả sách
            </button>

          </div>
        ) : (

          /* ==================================
             DANH SÁCH SÁCH
          ================================== */

          <div className="book-grid">

            {filteredBooks.map(
              (book) => (

                <div
                  className="book-card"
                  key={
                    book.id
                  }
                >

                  <img
                    src={
                      book.image
                    }
                    alt={
                      book.name
                    }
                    onClick={() =>
                      setSelectedBook(
                        book
                      )
                    }
                    style={{
                      cursor:
                        "pointer",
                    }}
                  />

                  <div className="book-info">

                    <h3>
                      {
                        book.name
                      }
                    </h3>

                    <p className="book-category">
                      {
                        book.category
                      }
                    </p>

                    <div className="book-price">
                      {Number(
                        book.price
                      ).toLocaleString(
                        "vi-VN"
                      )}{" "}
                      ₫
                    </div>

                    <button
                      className="book-button"
                      onClick={() =>
                        setSelectedBook(
                          book
                        )
                      }
                    >
                      Xem chi tiết
                    </button>

                  </div>

                </div>

              )
            )}

          </div>
        )}

      </main>

      {/* ======================================
          FOOTER
      ====================================== */}

      <footer className="footer">

        <div className="footer-content">

          <div>
            <h3>
              SHOPBOOKS
            </h3>

            <p>
              Website bán sách
              trực tuyến.
            </p>

            <p>
              Mang những cuốn sách
              hay đến với bạn đọc.
            </p>
          </div>

          <div>
            <h3>
              Danh mục
            </h3>

            <p>
              Văn học
            </p>

            <p>
              Kinh tế
            </p>

            <p>
              Kỹ năng
            </p>

            <p>
              Ngoại ngữ
            </p>
          </div>

          <div>
            <h3>
              Liên hệ
            </h3>

            <p>
              📞 Hotline:
              0123 456 789
            </p>

            <p>
              ✉ Email:
              shopbooks@gmail.com
            </p>

            <p>
              📍 Việt Nam
            </p>
          </div>

        </div>

      </footer>

    </div>
  );
}

export default App;