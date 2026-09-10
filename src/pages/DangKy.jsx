import { useState } from "react";
import { api } from "../api";

function DangKy({ onBack, onLogin }) {
  const [hoTen, setHoTen] = useState("");
  const [email, setEmail] = useState("");
  const [matKhau, setMatKhau] = useState("");
  const [xacNhanMatKhau, setXacNhanMatKhau] =
    useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      !hoTen.trim() ||
      !email.trim() ||
      !matKhau ||
      !xacNhanMatKhau
    ) {
      setError(
        "Vui lòng nhập đầy đủ thông tin."
      );
      return;
    }

    if (!email.includes("@")) {
      setError("Email không hợp lệ.");
      return;
    }

    if (matKhau.length < 6) {
      setError(
        "Mật khẩu phải có ít nhất 6 ký tự."
      );
      return;
    }

    if (matKhau !== xacNhanMatKhau) {
      setError(
        "Mật khẩu xác nhận không khớp."
      );
      return;
    }

    let newUser;
    try {
      newUser = await api.register({ fullName: hoTen, email, password: matKhau });
    } catch (requestError) {
      setError(requestError.message);
      return;
    }
    localStorage.setItem("shopbooks_user", JSON.stringify(newUser));

    setSuccess(
      "Đăng ký tài khoản SHOPBOOKS thành công!"
    );

    setTimeout(() => {
      onLogin();
    }, 1000);
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
        <h1>ĐĂNG KÝ SHOPBOOKS</h1>

        <p className="auth-description">
          Tạo tài khoản SHOPBOOKS
        </p>

        {error && (
          <div className="form-error">
            {error}
          </div>
        )}

        {success && (
          <div className="form-success">
            {success}
          </div>
        )}

        <form onSubmit={handleRegister}>
          <label>Họ và tên</label>

          <input
            type="text"
            placeholder="Nhập họ và tên"
            value={hoTen}
            onChange={(e) =>
              setHoTen(e.target.value)
            }
          />

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

          <label>
            Xác nhận mật khẩu
          </label>

          <input
            type="password"
            placeholder="Nhập lại mật khẩu"
            value={xacNhanMatKhau}
            onChange={(e) =>
              setXacNhanMatKhau(
                e.target.value
              )
            }
          />

          <button
            type="submit"
            className="auth-button"
          >
            ĐĂNG KÝ
          </button>
        </form>

        <div className="auth-link">
          Đã có tài khoản?

          <button onClick={onLogin}>
            Đăng nhập
          </button>
        </div>

        <div className="alpha-link">
          <a href="/">
            Quay về trang chủ SHOPBOOKS
          </a>
        </div>
      </div>
    </div>
  );
}

export default DangKy;