function GioHang({
  cart,
  onBack,
  onUpdateQuantity,
  onRemove,
  onCheckout,
}) {
  const total = cart.reduce(
    (sum, item) =>
      sum + item.price * item.quantity,
    0
  );

  return (
    <div className="cart-page">
      <button
        className="back-button"
        onClick={onBack}
      >
        ← Tiếp tục mua sách
      </button>

      <h1>🛒 GIỎ HÀNG</h1>

      {cart.length === 0 ? (
        <div className="empty-cart">
          <h2>Giỏ hàng đang trống</h2>

          <p>
            Hãy chọn một cuốn sách để thêm
            vào giỏ hàng.
          </p>

          <button onClick={onBack}>
            Xem sách
          </button>
        </div>
      ) : (
        <>
          <div className="cart-list">
            {cart.map((item) => (
              <div
                className="cart-item"
                key={item.id}
              >
                <img
                  src={item.image}
                  alt={item.name}
                />

                <div className="cart-item-info">
                  <h3>{item.name}</h3>

                  <p>
                    Danh mục: {item.category}
                  </p>

                  <strong>
                    {item.price.toLocaleString(
                      "vi-VN"
                    )}{" "}
                    ₫
                  </strong>
                </div>

                <div className="quantity">
                  <button
                    onClick={() =>
                      onUpdateQuantity(
                        item.id,
                        item.quantity - 1
                      )
                    }
                  >
                    −
                  </button>

                  <span>
                    {item.quantity}
                  </span>

                  <button
                    onClick={() =>
                      onUpdateQuantity(
                        item.id,
                        item.quantity + 1
                      )
                    }
                  >
                    +
                  </button>
                </div>

                <div className="item-total">
                  {(
                    item.price *
                    item.quantity
                  ).toLocaleString(
                    "vi-VN"
                  )}{" "}
                  ₫
                </div>

                <button
                  className="remove-button"
                  onClick={() =>
                    onRemove(item.id)
                  }
                >
                  Xóa
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h2>
              Tổng tiền:{" "}
              {total.toLocaleString(
                "vi-VN"
              )}{" "}
              ₫
            </h2>

            <button
              className="checkout-button"
              onClick={onCheckout}
            >
              Tiến hành đặt hàng
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default GioHang;