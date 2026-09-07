function ChiTietSach({
  book,
  onBack,
  onAddToCart,
}) {
  return (
    <div className="product-detail">
      <button
        className="back-button"
        onClick={onBack}
      >
        ← Quay lại
      </button>

      <div className="product-detail-content">
        <div>
          <img
            className="product-detail-image"
            src={book.image}
            alt={book.name}
          />
        </div>

        <div className="product-detail-info">
          <p className="book-category">
            {book.category}
          </p>

          <h1>{book.name}</h1>

          <h2 className="detail-price">
            {book.price.toLocaleString(
              "vi-VN"
            )}{" "}
            ₫
          </h2>

          <hr />

          <h3>
            Thông tin sản phẩm
          </h3>

          <p>
            Đây là sản phẩm sách thuộc
            danh mục{" "}
            <strong>
              {book.category}
            </strong>
            .
          </p>

          <p>
            Sách cung cấp những nội dung
            hữu ích và phù hợp với nhu cầu
            đọc của khách hàng.
          </p>

          <button
            className="buy-button"
            onClick={() =>
              onAddToCart(book)
            }
          >
            🛒 Thêm vào giỏ hàng
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChiTietSach;