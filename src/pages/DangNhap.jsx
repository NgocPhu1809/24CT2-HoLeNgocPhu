import { useState } from "react";

function DangNhap({
  onBack,
  onRegister,
  onLoginSuccess,
}) {
  const [email, setEmail] = useState("");
  const [matKhau, setMatKhau] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    setError("");

    if (!email.trim() || !matKhau) {
      setError(
        "Vui lòng nhập email và mật khẩu."
      );
      return;
    }

    // Tài khoản Admin demo
    const adminAccount = {
      id: "admin",
      hoTen: "Quản trị viên",
      email: "admin@shopbooks.com",
      matKhau: "admin123",
      vaiTro: "Admin",
      soDienThoai: "",
    };

    // Tài khoản Nhân viên demo
    const employeeAccount = {
      id: "employee",
      hoTen: "Nhân viên SHOPBOOKS",
      email: "nhanvien@shopbooks.com",
      matKhau: "nhanvien123",
      vaiTro: "NhanVien",
      soDienThoai: "",
    };

    // Kiểm tra tài khoản Admin
    if (
      email.trim().toLowerCase() ===
        adminAccount.email &&
      matKhau === adminAccount.matKhau
    ) {
      onLoginSuccess(adminAccount);
      return;
    }

    // Kiểm tra tài khoản Nhân viên
    if (
      email.trim().toLowerCase() ===
        employeeAccount.email &&
      matKhau === employeeAccount.matKhau
    ) {
      onLoginSuccess(employeeAccount);
      return;
    }

    // Lấy danh sách khách hàng đã đăng ký
    const users =
      JSON.parse(
        localStorage.getItem(
          "shopbooks_users"
        )
      ) || [];

    // Tìm tài khoản khách hàng
    const user = users.find(
      (item) =>
        item.email.toLowerCase() ===
          email.trim().toLowerCase() &&
        item.matKhau === matKhau
    );

    if (!user) {
      setError(
        "Email hoặc mật khẩu không chính xác."
      );
      return;
    }

    // Nếu tài khoản không có vai trò
    // thì mặc định là khách hàng
    const loginUser = {
      ...user,
      vaiTro:
        user.vaiTro || "KhachHang",
    };

    onLoginSuccess(loginUser);
  };

  return (
    <div className="auth-page">
      <button
        className="back-button"
        onClick={onBack}
      >
        ← Quay lại
      </button>

      <div className="auth-box">
        <h1>ĐĂNG NHẬP</h1>

        <p className="auth-description">
          Đăng nhập vào tài khoản SHOPBOOKS
        </p>

        {error && (
          <div className="form-error">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <label>Email</label>

          <input
            type="email"
            placeholder="Nhập email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

          <label>Mật khẩu</label>

          <input
            type="password"
            placeholder="Nhập mật khẩu"
            value={matKhau}
            onChange={(e) =>
              setMatKhau(e.target.value)
            }
          />

          <button
            type="submit"
            className="auth-button"
          >
            ĐĂNG NHẬP
          </button>
        </form>

        <div className="auth-link">
          Chưa có tài khoản?

          <button onClick={onRegister}>
            Đăng ký ngay
          </button>
        </div>

        <div className="shopbooks-link">
          <a href="/">
            Quay về trang chủ SHOPBOOKS
          </a>
        </div>
      </div>
    </div>
  );
}

export default DangNhap;