CREATE DATABASE IF NOT EXISTS shopbooks CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE shopbooks;

CREATE TABLE IF NOT EXISTS users (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(150) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('KhachHang','NhanVien','Admin') NOT NULL DEFAULT 'KhachHang',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS books (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  price DECIMAL(12,0) NOT NULL,
  image TEXT NOT NULL,
  description TEXT,
  stock INT UNSIGNED NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  customer_email VARCHAR(190),
  customer_name VARCHAR(150) NOT NULL,
  phone VARCHAR(30),
  address TEXT,
  total DECIMAL(12,0) NOT NULL,
  payment_method VARCHAR(80),
  status VARCHAR(50) NOT NULL DEFAULT 'Chờ xử lý',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_items (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_id BIGINT UNSIGNED NOT NULL,
  book_id BIGINT UNSIGNED,
  book_name VARCHAR(255) NOT NULL,
  price DECIMAL(12,0) NOT NULL,
  quantity INT UNSIGNED NOT NULL,
  CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

INSERT IGNORE INTO users (full_name, email, password_hash, role)
VALUES ('Nguyen Minh Anh', 'minh.anh@example.com', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 'KhachHang');

INSERT IGNORE INTO users (full_name, email, password_hash, role) VALUES
('Tran Quoc Bao', 'quoc.bao01@example.com', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 'KhachHang'),
('Le Ngoc Han', 'ngoc.han02@example.com', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 'KhachHang'),
('Pham Gia Huy', 'gia.huy03@example.com', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 'KhachHang'),
('Vo Thanh Thao', 'thanh.thao04@example.com', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 'KhachHang'),
('Bui Minh Khang', 'minh.khang05@example.com', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 'KhachHang'),
('Dang Thu Ha', 'thu.ha06@example.com', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 'KhachHang'),
('Hoang Duc Anh', 'duc.anh07@example.com', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 'KhachHang'),
('Nguyen Khanh Linh', 'khanh.linh08@example.com', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 'KhachHang'),
('Do Hoai Nam', 'hoai.nam09@example.com', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 'KhachHang'),
('Phan Ngoc Mai', 'ngoc.mai10@example.com', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 'KhachHang'),
('Huynh Tuan Kiet', 'tuan.kiet11@example.com', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 'KhachHang'),
('Mai Phuong Vy', 'phuong.vy12@example.com', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 'KhachHang'),
('Truong Nhat Minh', 'nhat.minh13@example.com', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 'KhachHang'),
('Ly Bao Tram', 'bao.tram14@example.com', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 'KhachHang'),
('Ngo Thanh Son', 'thanh.son15@example.com', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 'KhachHang');

INSERT INTO books (name, category, price, image, description, stock) VALUES
('Lược Sử Thời Gian', 'Khoa học', 145000, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f', 'Khám phá lịch sử và những bí ẩn của vũ trụ.', 25),
('Đi Tìm Lẽ Sống', 'Tâm lý', 88000, 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e', 'Câu chuyện về nghị lực và ý nghĩa cuộc sống.', 18),
('Atomic Habits', 'Kỹ năng', 135000, 'https://images.unsplash.com/photo-1512820790803-83ca734da794', 'Phương pháp xây dựng thói quen tốt mỗi ngày.', 30),
('Cha Giàu Cha Nghèo', 'Kinh tế', 110000, 'https://images.unsplash.com/photo-1589998059171-988d887df646', 'Những bài học tài chính thực tế cho mọi người.', 22),
('Dế Mèn Phiêu Lưu Ký', 'Thiếu nhi', 65000, 'https://images.unsplash.com/photo-1516979187457-637abb4f9353', 'Tác phẩm thiếu nhi kinh điển của văn học Việt Nam.', 40),
('Hoàng Tử Bé', 'Văn học', 72000, 'https://images.unsplash.com/photo-1456324504439-367cee3b3c32', 'Một chuyến du hành giàu tính nhân văn qua các hành tinh.', 27),
('Sapiens: Lược Sử Loài Người', 'Lịch sử', 175000, 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d', 'Lịch sử phát triển của loài người qua các thời đại.', 16),
('Nhà Lãnh Đạo Không Chức Danh', 'Kỹ năng', 99000, 'https://images.unsplash.com/photo-1532012197267-da84d127e765', 'Cách tạo ảnh hưởng tích cực trong công việc và cuộc sống.', 20),
('Tâm Lý Học Đám Đông', 'Tâm lý', 125000, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c', 'Tìm hiểu hành vi và suy nghĩ của con người trong tập thể.', 14),
('7 Thói Quen Hiệu Quả', 'Phát triển bản thân', 118000, 'https://images.unsplash.com/photo-1511108690759-009324a90311', 'Nguyên tắc rèn luyện bản thân và quản lý thời gian.', 24),
('Mắt Biếc', 'Văn học', 90000, 'https://images.unsplash.com/photo-1519682337058-a94d519337bc', 'Câu chuyện tình yêu trong trẻo và day dứt.', 19),
('Sherlock Holmes Toàn Tập', 'Trinh thám', 160000, 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da', 'Những vụ án ly kỳ của vị thám tử nổi tiếng.', 12),
('Học Cách Học', 'Giáo dục', 105000, 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6', 'Các phương pháp học tập hiệu quả và lâu dài.', 35),
('Bố Già', 'Văn học', 130000, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f', 'Tiểu thuyết nổi tiếng về gia đình và quyền lực.', 17),
('Từ Tốt Đến Vĩ Đại', 'Kinh doanh', 155000, 'https://images.unsplash.com/photo-1556761175-b413da4baf72', 'Những nguyên tắc giúp doanh nghiệp phát triển bền vững.', 21);

START TRANSACTION;

INSERT INTO orders (customer_email, customer_name, phone, address, total, payment_method, status) VALUES ('quoc.bao01@example.com', 'Tran Quoc Bao', '0901000001', '12 Nguyen Trai, Ha Noi', 145000, 'COD', 'Chờ xử lý');
SET @order_id = LAST_INSERT_ID();
INSERT INTO order_items (order_id, book_id, book_name, price, quantity) VALUES (@order_id, 1, 'Lược Sử Thời Gian', 145000, 1);

INSERT INTO orders (customer_email, customer_name, phone, address, total, payment_method, status) VALUES ('ngoc.han02@example.com', 'Le Ngoc Han', '0901000002', '25 Le Loi, Da Nang', 176000, 'Chuyển khoản', 'Đã duyệt');
SET @order_id = LAST_INSERT_ID();
INSERT INTO order_items (order_id, book_id, book_name, price, quantity) VALUES (@order_id, 2, 'Đi Tìm Lẽ Sống', 88000, 2);

INSERT INTO orders (customer_email, customer_name, phone, address, total, payment_method, status) VALUES ('gia.huy03@example.com', 'Pham Gia Huy', '0901000003', '08 Nguyen Hue, Ho Chi Minh', 270000, 'COD', 'Đang giao');
SET @order_id = LAST_INSERT_ID();
INSERT INTO order_items (order_id, book_id, book_name, price, quantity) VALUES (@order_id, 3, 'Atomic Habits', 135000, 2);

INSERT INTO orders (customer_email, customer_name, phone, address, total, payment_method, status) VALUES ('thanh.thao04@example.com', 'Vo Thanh Thao', '0901000004', '41 Tran Phu, Hue', 220000, 'Ví điện tử', 'Đã giao');
SET @order_id = LAST_INSERT_ID();
INSERT INTO order_items (order_id, book_id, book_name, price, quantity) VALUES (@order_id, 4, 'Cha Giàu Cha Nghèo', 110000, 2);

INSERT INTO orders (customer_email, customer_name, phone, address, total, payment_method, status) VALUES ('minh.khang05@example.com', 'Bui Minh Khang', '0901000005', '17 Phan Chu Trinh, Can Tho', 195000, 'COD', 'Chờ xử lý');
SET @order_id = LAST_INSERT_ID();
INSERT INTO order_items (order_id, book_id, book_name, price, quantity) VALUES (@order_id, 5, 'Dế Mèn Phiêu Lưu Ký', 65000, 3);

INSERT INTO orders (customer_email, customer_name, phone, address, total, payment_method, status) VALUES ('thu.ha06@example.com', 'Dang Thu Ha', '0901000006', '32 Hang Bong, Ha Noi', 216000, 'Chuyển khoản', 'Đã duyệt');
SET @order_id = LAST_INSERT_ID();
INSERT INTO order_items (order_id, book_id, book_name, price, quantity) VALUES (@order_id, 6, 'Hoàng Tử Bé', 72000, 3);

INSERT INTO orders (customer_email, customer_name, phone, address, total, payment_method, status) VALUES ('duc.anh07@example.com', 'Hoang Duc Anh', '0901000007', '06 Vo Van Tan, Da Nang', 175000, 'COD', 'Đã giao');
SET @order_id = LAST_INSERT_ID();
INSERT INTO order_items (order_id, book_id, book_name, price, quantity) VALUES (@order_id, 7, 'Sapiens: Lược Sử Loài Người', 175000, 1);

INSERT INTO orders (customer_email, customer_name, phone, address, total, payment_method, status) VALUES ('khanh.linh08@example.com', 'Nguyen Khanh Linh', '0901000008', '19 Ly Thuong Kiet, Hai Phong', 198000, 'Ví điện tử', 'Đang giao');
SET @order_id = LAST_INSERT_ID();
INSERT INTO order_items (order_id, book_id, book_name, price, quantity) VALUES (@order_id, 8, 'Nhà Lãnh Đạo Không Chức Danh', 99000, 2);

INSERT INTO orders (customer_email, customer_name, phone, address, total, payment_method, status) VALUES ('hoai.nam09@example.com', 'Do Hoai Nam', '0901000009', '55 Dien Bien Phu, Ho Chi Minh', 250000, 'COD', 'Chờ xử lý');
SET @order_id = LAST_INSERT_ID();
INSERT INTO order_items (order_id, book_id, book_name, price, quantity) VALUES (@order_id, 9, 'Tâm Lý Học Đám Đông', 125000, 2);

INSERT INTO orders (customer_email, customer_name, phone, address, total, payment_method, status) VALUES ('ngoc.mai10@example.com', 'Phan Ngoc Mai', '0901000010', '73 Truong Dinh, Ha Noi', 236000, 'Chuyển khoản', 'Đã duyệt');
SET @order_id = LAST_INSERT_ID();
INSERT INTO order_items (order_id, book_id, book_name, price, quantity) VALUES (@order_id, 10, '7 Thói Quen Hiệu Quả', 118000, 2);

INSERT INTO orders (customer_email, customer_name, phone, address, total, payment_method, status) VALUES ('tuan.kiet11@example.com', 'Huynh Tuan Kiet', '0901000011', '28 Quang Trung, Nha Trang', 180000, 'COD', 'Đã giao');
SET @order_id = LAST_INSERT_ID();
INSERT INTO order_items (order_id, book_id, book_name, price, quantity) VALUES (@order_id, 11, 'Mắt Biếc', 90000, 2);

INSERT INTO orders (customer_email, customer_name, phone, address, total, payment_method, status) VALUES ('phuong.vy12@example.com', 'Mai Phuong Vy', '0901000012', '91 Cach Mang Thang Tam, Da Lat', 320000, 'Ví điện tử', 'Đang giao');
SET @order_id = LAST_INSERT_ID();
INSERT INTO order_items (order_id, book_id, book_name, price, quantity) VALUES (@order_id, 12, 'Sherlock Holmes Toàn Tập', 160000, 2);

INSERT INTO orders (customer_email, customer_name, phone, address, total, payment_method, status) VALUES ('nhat.minh13@example.com', 'Truong Nhat Minh', '0901000013', '14 Hai Ba Trung, Vinh', 210000, 'COD', 'Chờ xử lý');
SET @order_id = LAST_INSERT_ID();
INSERT INTO order_items (order_id, book_id, book_name, price, quantity) VALUES (@order_id, 13, 'Học Cách Học', 105000, 2);

INSERT INTO orders (customer_email, customer_name, phone, address, total, payment_method, status) VALUES ('bao.tram14@example.com', 'Ly Bao Tram', '0901000014', '38 Nguyen Van Cu, Quy Nhon', 260000, 'Chuyển khoản', 'Đã duyệt');
SET @order_id = LAST_INSERT_ID();
INSERT INTO order_items (order_id, book_id, book_name, price, quantity) VALUES (@order_id, 14, 'Bố Già', 130000, 2);

INSERT INTO orders (customer_email, customer_name, phone, address, total, payment_method, status) VALUES ('thanh.son15@example.com', 'Ngo Thanh Son', '0901000015', '66 Le Duan, Buon Ma Thuot', 310000, 'COD', 'Đã giao');
SET @order_id = LAST_INSERT_ID();
INSERT INTO order_items (order_id, book_id, book_name, price, quantity) VALUES (@order_id, 15, 'Từ Tốt Đến Vĩ Đại', 155000, 2);

COMMIT;
