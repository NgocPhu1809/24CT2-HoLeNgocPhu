import { useEffect, useState } from "react";

function NotificationCenter() {
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const showNotification = (event) => {
      const detail = typeof event.detail === "string"
        ? { message: event.detail, type: "success" }
        : event.detail;

      setNotification({
        message: detail?.message ?? "",
        type: detail?.type ?? "success",
      });
    };

    window.showToast = (message, type = "success") => {
      window.dispatchEvent(
        new CustomEvent("shopbooks:notification", {
          detail: { message, type },
        }),
      );
    };

    window.addEventListener("shopbooks:notification", showNotification);
    return () => {
      window.removeEventListener("shopbooks:notification", showNotification);
      delete window.showToast;
    };
  }, []);

  useEffect(() => {
    if (!notification) return undefined;
    const timer = window.setTimeout(() => setNotification(null), 4500);
    return () => window.clearTimeout(timer);
  }, [notification]);

  if (!notification) return null;

  const isError = notification.type === "error";
  const title = isError ? "Cần lưu ý" : "Thông báo thành công";

  return (
    <div className="shop-popup-backdrop" role="presentation">
      <section
        className={"shop-popup " + notification.type}
        role="status"
        aria-live="polite"
        aria-labelledby="shop-popup-title"
      >
        <button
          className="shop-popup-close"
          onClick={() => setNotification(null)}
          aria-label="Đóng thông báo"
        >
          ×
        </button>
        <div className="shop-popup-icon">
          {notification.type === "error" ? "!" : "✓"}
        </div>
        <div className="shop-popup-content">
          <h2 id="shop-popup-title">{title}</h2>
          <p>{notification.message}</p>
        </div>
        <span className="shop-popup-progress" />
      </section>
    </div>
  );
}

export default NotificationCenter;
