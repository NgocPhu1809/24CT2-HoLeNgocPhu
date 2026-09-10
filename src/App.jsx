import { useEffect, useMemo, useState } from "react";
import "./App.css";
import { api } from "./api";
import { books as defaultBooks } from "./data/books";
import ChiTietSach from "./pages/ChiTietSach";
import GioHang from "./pages/GioHang";
import DatHang from "./pages/DatHang";
import DangNhap from "./pages/DangNhap";
import DangKy from "./pages/DangKy";
import Admin from "./pages/Admin";
import NhanVien from "./pages/NhanVien";
import DonHang from "./pages/DonHang";

const bookCategories = ["Văn học", "Kinh tế", "Kỹ năng", "Ngoại ngữ"];
const categories = ["Tất cả", ...bookCategories, "Khác"];
const notify = (message, type = "success") => window.showToast?.(message, type);
const heroSlides = [
  {
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=780&q=88",
    alt: "Sách truyền cảm hứng",
    note: "Tri thức",
    emphasis: "là hành trang",
  },
  {
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=780&q=88",
    alt: "Những cuốn sách được chọn lọc",
    note: "Mở sách",
    emphasis: "mở thế giới",
  },
  {
    image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=780&q=88",
    alt: "Một góc đọc sách yên tĩnh",
    note: "Mỗi trang",
    emphasis: "một khám phá",
  },
  {
    image: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=780&q=88",
    alt: "Sách và cảm hứng đọc",
    note: "Đọc để",
    emphasis: "sống sâu hơn",
  },
];

function App() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [selectedBook, setSelectedBook] = useState(null);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showOrders, setShowOrders] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [heroIndex, setHeroIndex] = useState(0);
  const [loggedInUser, setLoggedInUser] = useState(() => {
    const saved = localStorage.getItem("shopbooks_logged_user");
    return saved ? JSON.parse(saved) : null;
  });
const [books, setBooks] = useState(() => {
  const saved = localStorage.getItem("shopbooks_books");
  return saved ? JSON.parse(saved) : defaultBooks;
});
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("shopbooks_cart");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const timer = window.setInterval(() => {
      setHeroIndex((current) => (current + 1) % heroSlides.length);
    }, 3500);

    return () => window.clearInterval(timer);
  }, []);

  const showHeroSlide = (direction) => {
    setHeroIndex((current) =>
      (current + direction + heroSlides.length) % heroSlides.length
    );
  };

  useEffect(() => localStorage.setItem("shopbooks_cart", JSON.stringify(cart)), [cart]);
  useEffect(() => {
    let isCurrent = true;

    api.books()
      .then((serverBooks) => {
        if (!isCurrent || !Array.isArray(serverBooks)) return;
        setBooks(serverBooks);
        localStorage.setItem("shopbooks_books", JSON.stringify(serverBooks));
      })
      .catch(() => {
        // Keep the local catalog when the API is unavailable.
      });

    return () => {
      isCurrent = false;
    };
  }, []);
 useEffect(() => {
  const loadBooks = () => {
    const saved = localStorage.getItem("shopbooks_books");
    if (saved) setBooks(JSON.parse(saved));
  };

  window.addEventListener("focus", loadBooks);
  return () => window.removeEventListener("focus", loadBooks);
}, []);

  const filteredBooks = useMemo(() => {
    const keyword = search.toLowerCase().trim();
    return books.filter((book) =>
      (selectedCategory === "Tất cả"
        || (selectedCategory === "Khác" && !bookCategories.includes(book.category))
        || book.category === selectedCategory)
      && book.name.toLowerCase().includes(keyword)
    );
  }, [books, search, selectedCategory]);

  const resetViews = () => {
    setShowCart(false); setShowCheckout(false); setShowOrders(false); setSelectedBook(null);
  };
  const chooseCategory = (category, sectionId = null) => {
    setSelectedCategory(category); setSearch(""); resetViews();
    window.setTimeout(() => {
      if (sectionId) {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
        return;
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 0);
  };
  const goToSection = (sectionId) => {
    setSearch(""); setSelectedCategory("Tất cả"); resetViews();
    window.setTimeout(() => document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" }), 0);
  };
  const addToCart = (book) => {
    if (!loggedInUser) {
      notify("Vui lòng đăng nhập tài khoản khách hàng để mua sách!", "error");
      setSelectedBook(null); setShowLogin(true); return;
    }
    if (["Admin", "NhanVien"].includes(loggedInUser.vaiTro)) {
      notify("Tài khoản quản trị/nhân viên không thể mua hàng!", "error"); return;
    }
    setCart((current) => {
      const existing = current.find((item) => item.id === book.id);
      return existing
        ? current.map((item) => item.id === book.id ? { ...item, quantity: Number(item.quantity) + 1 } : item)
        : [...current, { ...book, quantity: 1 }];
    });
    notify(`Đã thêm "${book.name}" vào giỏ hàng!`);
  };
  const openCart = () => {
    if (!loggedInUser) { notify("Vui lòng đăng nhập để xem giỏ hàng!", "error"); setShowLogin(true); return; }
    if (["Admin", "NhanVien"].includes(loggedInUser.vaiTro)) { notify("Tài khoản này không có giỏ hàng!", "error"); return; }
    const saved = localStorage.getItem("shopbooks_cart");
    if (saved) setCart(JSON.parse(saved));
    resetViews(); setShowCart(true);
  };
  const openOrders = () => {
    if (!loggedInUser) { notify("Vui lòng đăng nhập để xem đơn hàng!", "error"); setShowLogin(true); return; }
    if (["Admin", "NhanVien"].includes(loggedInUser.vaiTro)) { notify("Tài khoản này không sử dụng chức năng đơn hàng!", "error"); return; }
    resetViews(); setShowOrders(true);
  };
  const logout = () => {
    localStorage.removeItem("shopbooks_logged_user"); localStorage.removeItem("shopbooks_cart");
    setLoggedInUser(null); setCart([]); resetViews(); notify("Đã đăng xuất tài khoản!");
  };
  const storeHeaderProps = {
    search, setSearch, loggedInUser, cart, chooseCategory, goToSection,
    openCart, openOrders, logout, openLogin: () => setShowLogin(true),
  };
  const withStoreHeader = (content) => (
    <div className="alpha-store">
      <StoreHeader {...storeHeaderProps} />
      <div className="shop-purchase-page">{content}</div>
    </div>
  );

  if (showRegister) return <DangKy onBack={() => setShowRegister(false)} onLogin={() => { setShowRegister(false); setShowLogin(true); }} />;
  if (showLogin) return <DangNhap onBack={() => setShowLogin(false)} onRegister={() => { setShowLogin(false); setShowRegister(true); }} onLoginSuccess={(user) => { setLoggedInUser(user); localStorage.setItem("shopbooks_logged_user", JSON.stringify(user)); setShowLogin(false); notify(`Đăng nhập thành công! Xin chào ${user.hoTen}`); }} />;
  if (loggedInUser?.vaiTro === "Admin") return <Admin user={loggedInUser} onLogout={logout} />;
  if (loggedInUser?.vaiTro === "NhanVien") return <NhanVien user={loggedInUser} onLogout={logout} />;
  if (showOrders) return withStoreHeader(<DonHang user={loggedInUser} onBack={() => setShowOrders(false)} />);
  const total = cart.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0);
  if (showCheckout) return withStoreHeader(<DatHang cart={cart} total={total} user={loggedInUser} onBack={() => setShowCheckout(false)} onOrderSuccess={(order) => { notify(`Đặt hàng thành công! Mã đơn hàng: ${order.id}`); setCart([]); localStorage.removeItem("shopbooks_cart"); resetViews(); }} />);
  if (showCart) return withStoreHeader(<GioHang cart={cart} onBack={() => setShowCart(false)} onUpdateQuantity={(id, quantity) => { if (quantity >= 1) setCart((current) => current.map((item) => item.id === id ? { ...item, quantity: Number(quantity) } : item)); }} onRemove={(id) => setCart((current) => current.filter((item) => item.id !== id))} onCheckout={() => { if (!cart.length) { notify("Giỏ hàng đang trống!", "error"); return; } setShowCart(false); setShowCheckout(true); }} />);
  if (selectedBook) return withStoreHeader(<ChiTietSach book={selectedBook} onBack={() => setSelectedBook(null)} onAddToCart={addToCart} />);

  return (
    <div className="alpha-store">
      <StoreHeader {...storeHeaderProps} />
      <main>
        <section className="alpha-hero">
          <div className="hero-copy"><p className="eyebrow">BỘ SƯU TẬP MÙA THU 2026</p><h1>Đọc để mở rộng<br /><i><span>thế</span><span>giới</span><span>của</span><span>bạn.</span></i></h1><p>Những cuốn sách được tuyển chọn cho hành trình học hỏi, cảm hứng và phát triển mỗi ngày.</p><button onClick={() => document.getElementById("new-books")?.scrollIntoView({ behavior: "smooth" })}>Khám phá ngay <span>→</span></button></div>
          <div className="hero-art">
            <div className="hero-ring"></div>
            <img key={heroSlides[heroIndex].image} src={heroSlides[heroIndex].image} alt={heroSlides[heroIndex].alt} />
            <div className="hero-note">{heroSlides[heroIndex].note}<br /><strong>{heroSlides[heroIndex].emphasis}</strong></div>
            <div className="hero-controls" aria-label="Điều khiển ảnh giới thiệu">
              <button type="button" onClick={() => showHeroSlide(-1)} aria-label="Ảnh trước">←</button>
              <div className="hero-dots">
                {heroSlides.map((slide, index) => <button key={slide.image} type="button" className={index === heroIndex ? "active" : ""} onClick={() => setHeroIndex(index)} aria-label={`Chuyển đến ảnh ${index + 1}`} />)}
              </div>
              <button type="button" onClick={() => showHeroSlide(1)} aria-label="Ảnh tiếp theo">→</button>
            </div>
          </div>
        </section>
        <section className="alpha-intro" id="about"><p className="eyebrow">SHOPBOOKS</p><h2>Mỗi cuốn sách là một cánh cửa<br />dẫn đến một ý tưởng mới.</h2><p>Chúng tôi lựa chọn những tựa sách giàu giá trị, đồng hành cùng bạn trên hành trình khám phá tri thức và kiến tạo phiên bản tốt hơn của chính mình.</p><button onClick={() => chooseCategory("Tất cả")}>Tìm hiểu về chúng tôi <span>→</span></button></section>
        <section className="alpha-feature" id="new-books"><SectionHeading eyebrow="ĐƯỢC YÊU THÍCH NHẤT" title="Sách nổi bật" action={() => chooseCategory("Tất cả")} /><BookGrid books={books.slice(0, 4)} onSelect={setSelectedBook} /></section>
        <section className="alpha-shelf" id="book-shelf"><SectionHeading eyebrow="KHÁM PHÁ THEO CHỦ ĐỀ" title="Tủ sách" /><div className="shelf-categories">{bookCategories.map((category, index) => <button key={category} className={`shelf-card shelf-${index + 1}`} onClick={() => chooseCategory(category, "book-catalog")}><span>0{index + 1}</span><strong>{category}</strong><i>Khám phá →</i></button>)}<button className="shelf-card shelf-5" onClick={() => chooseCategory("Khác", "book-catalog")}><span>05</span><strong>Khác</strong><i>Khám phá →</i></button></div></section>
        <section className="alpha-catalog" id="book-catalog"><div className="section-heading"><div><p className="eyebrow">DANH MỤC SÁCH</p><h2>{search ? `Kết quả cho “${search}”` : selectedCategory === "Tất cả" ? "Tất cả tựa sách" : `Sách ${selectedCategory}`}</h2></div><div className="catalog-filters">{categories.map((category) => <button key={category} className={selectedCategory === category ? "selected" : ""} onClick={() => chooseCategory(category, "book-catalog")}>{category}</button>)}</div></div>{filteredBooks.length ? <BookGrid books={filteredBooks} onSelect={setSelectedBook} /> : <div className="alpha-empty"><span>⌁</span><h3>Chưa tìm thấy cuốn sách phù hợp</h3><button onClick={() => chooseCategory("Tất cả", "book-catalog")}>Xem tất cả sách</button></div>}</section>
        <section className="alpha-benefits"><article><span>◈</span><div><strong>Chọn lọc kỹ lưỡng</strong><p>Những cuốn sách mang giá trị bền vững.</p></div></article><article><span>◌</span><div><strong>Giao hàng toàn quốc</strong><p>Đóng gói cẩn thận, giao tận tay bạn.</p></div></article><article><span>♡</span><div><strong>Đổi trả linh hoạt</strong><p>Hỗ trợ nhanh chóng, tận tâm.</p></div></article></section>
      </main>
      <footer className="alpha-footer"><div className="footer-brand"><div className="alpha-brand"><span className="brand-mark">S</span><span><strong>shop</strong><b>books</b><small>read more, live more</small></span></div><p>“Chúng tôi không chỉ bán sách. Chúng tôi kết nối bạn với những ý tưởng có thể thay đổi cuộc đời.”</p></div><div><h3>Khám phá</h3><button onClick={() => chooseCategory("Tất cả")}>Tất cả sách</button><button onClick={() => chooseCategory("Kỹ năng")}>Sách kỹ năng</button><button onClick={() => chooseCategory("Kinh tế")}>Sách kinh tế</button></div><div><h3>Liên hệ</h3><p>0123 456 789</p><p>shopbooks@gmail.com</p><p>Việt Nam</p></div></footer>
      <div className="alpha-copyright">© 2026 SHOPBOOKS. All rights reserved.</div>
    </div>
  );
}

function StoreHeader({
  search, setSearch, loggedInUser, cart, chooseCategory, goToSection,
  openCart, openOrders, logout, openLogin,
}) {
  return (
    <>
      <div className="alpha-topbar"><span>Miễn phí vận chuyển cho đơn hàng từ 300.000 ₫</span><span>Hotline: 0123 456 789</span></div>
      <header className="alpha-header">
        <button className="alpha-brand" onClick={() => chooseCategory("Tất cả")} aria-label="Về trang chủ"><span className="brand-mark">S</span><span><strong>shop</strong><b>books</b><small>read more, live more</small></span></button>
        <nav className="alpha-nav" aria-label="Điều hướng chính">
          <button className="active" onClick={() => chooseCategory("Tất cả")}>Trang chủ</button>
          <button onClick={() => goToSection("book-shelf")}>Tủ sách</button>
          <button onClick={() => goToSection("new-books")}>Sách nổi bật</button>
          <button onClick={() => goToSection("about")}>Về chúng tôi</button>
        </nav>
        <div className="alpha-actions">
          <label className="alpha-search"><span>⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Tìm kiếm sách..." aria-label="Tìm kiếm sách" /></label>
          {loggedInUser ? <button className="alpha-icon-text" onClick={openOrders} aria-label="Đơn hàng của tôi"><UserIcon /><span>{loggedInUser.hoTen}</span></button> : <button className="alpha-icon" onClick={openLogin} aria-label="Đăng nhập"><UserIcon /></button>}
          {loggedInUser && <button className="alpha-logout" onClick={logout}>Đăng xuất</button>}
          <button className="alpha-cart" onClick={openCart} aria-label="Giỏ hàng"><BagIcon /><em>{cart.reduce((sum, item) => sum + Number(item.quantity), 0)}</em></button>
        </div>
      </header>
    </>
  );
}

function SectionHeading({ eyebrow, title, action }) {
  return <div className="section-heading"><div><p className="eyebrow">{eyebrow}</p><h2>{title}</h2></div>{action && <button onClick={action}>Xem tất cả <span>→</span></button>}</div>;
}
function UserIcon() {
  return <svg className="alpha-line-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="7" r="3.5" /><path d="M4.5 21c.5-4 3.2-6 7.5-6s7 2 7.5 6" /></svg>;
}
function BagIcon() {
  return <svg className="alpha-line-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5.5 8.5h13l1 12h-15l1-12Z" /><path d="M9 9V6.5a3 3 0 0 1 6 0V9" /></svg>;
}
function BookGrid({ books, onSelect }) {
  return <div className="alpha-book-grid">{books.map((book, index) => {
    const coverUrl = `https://covers.openlibrary.org/b/title/${encodeURIComponent(book.name)}-L.jpg?default=false`;
    const fallbackSource = book.image || "https://images.unsplash.com/photo-1544947950-fa07a98d237f";
    const fallbackUrl = `${fallbackSource}${fallbackSource.includes("?") ? "&" : "?"}auto=format&fit=crop&w=500&q=82`;

    return <article className="alpha-book-card" key={book.id}><button className="book-cover" onClick={() => onSelect(book)}><img src={coverUrl} alt={`Bìa sách ${book.name}`} onLoad={(event) => {
      if (event.currentTarget.naturalWidth <= 1 && !event.currentTarget.dataset.fallbackApplied) {
        event.currentTarget.dataset.fallbackApplied = "true";
        event.currentTarget.src = fallbackUrl;
      }
    }} onError={(event) => {
      if (event.currentTarget.dataset.fallbackApplied) return;
      event.currentTarget.dataset.fallbackApplied = "true";
      event.currentTarget.src = fallbackUrl;
    }} /><span className="book-number">0{index + 1}</span><span className="quick-view">Xem chi tiết</span></button><div className="book-meta"><p>{book.category}</p><h3>{book.name}</h3><div><strong>{Number(book.price).toLocaleString("vi-VN")} ₫</strong><span>★★★★★</span></div></div></article>;
  })}</div>;
}
export default App;
