# 📝 ToDo List Backend API

REST API hoàn chỉnh cho ứng dụng quản lý công việc (ToDo List), được xây dựng bằng Node.js, Express và MongoDB.

## 🛠️ Công Nghệ Sử Dụng

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Authentication:** JWT (Access Token + Refresh Token)
- **Password Hashing:** bcryptjs
- **File Upload:** Cloudinary & Multer (Hỗ trợ upload ảnh Task và Avatar)

## 📁 Cấu Trúc Thư Mục

```
src/
├── config/             # Cấu hình Database, Cloudinary, JWT
├── controllers/        # Xử lý Request/Response cho từng module
├── middlewares/        # Xác thực Token, Cấu hình Multer upload
├── models/             # Mongoose Schemas (User, Task, Category, CategoryValue)
├── routes/             # Định nghĩa API endpoints
├── services/           # Business logic và tương tác Database
├── validations/        # Kiểm tra và làm sạch dữ liệu đầu vào
├── app.js              # Khởi tạo và cấu hình Express app
└── index.js            # Entry point - Khởi động server
```

## 🚀 Cài Đặt & Chạy

### 1. Clone project

```bash
git clone https://github.com/Nhgbaroo/To-Do-List.git
cd ToDo-List
```

### 2. Cài đặt dependencies

```bash
npm install
```

### 3. Cấu hình biến môi trường `.env`

Tạo file `.env` ở thư mục gốc và cung cấp các thông tin sau:

.env
PORT=
NODE_ENV=development
MONGODB_URI=

# JWT Settings
ACCESS_TOKEN_SECRET=your-access-token-secret-key
REFRESH_TOKEN_SECRET=your-refresh-token-secret-key

# Cloudinary Settings (Cho chức năng upload ảnh)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 4. Khởi chạy server

```bash
# Môi trường Development (Tự động reload khi sửa code)
npm run dev

# Môi trường Production
npm start
```

Server sẽ chạy ở địa chỉ: `http://localhost:3000`

## 📮 Tổng Hợp Hệ Thống API Endpoints

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Mô tả | Auth |
|--------|----------|--------|------|
| POST | `/register` | Đăng ký tài khoản người dùng | ❌ |
| POST | `/login` | Đăng nhập hệ thống | ❌ |
| POST | `/logout` | Đăng xuất | ✅ |
| POST | `/refresh-token` | Cấp lại access token mới qua cookie | 🍪 |

### 👤 Users (`/api/users`)
| Method | Endpoint | Mô tả | Auth |
|--------|----------|--------|------|
| GET | `/profile` | Xem thông tin cá nhân | ✅ |
| PUT | `/profile` | Cập nhật thông tin cơ bản | ✅ |
| PUT | `/avatar` | Cập nhật ảnh đại diện (Tự động xóa ảnh cũ trên Cloud) | ✅ |
| PUT | `/change-password` | Thay đổi mật khẩu | ✅ |

### 📂 Categories (`/api/categories`)
| Method | Endpoint | Mô tả | Auth |
|--------|----------|--------|------|
| POST | `/` | Tạo danh mục mới (VD: Status, Priority) | ✅ |
| GET | `/` | Lấy danh sách các danh mục | ✅ |
| PUT | `/:id` | Cập nhật danh mục | ✅ |
| DELETE| `/:id` | Xóa danh mục | ✅ |

### 🏷️ Category Values (`/api/category-values`)
| Method | Endpoint | Mô tả | Auth |
|--------|----------|--------|------|
| POST | `/` | Thêm giá trị cho danh mục (VD: High, Low) | ✅ |
| GET | `/category/:categoryId` | Lấy các giá trị thuộc một danh mục cụ thể | ✅ |
| PUT | `/:categoryValueId`| Cập nhật giá trị danh mục | ✅ |
| DELETE| `/:categoryValueId`| Xóa giá trị danh mục | ✅ |

### ✅ Tasks (`/api/tasks`)
| Method | Endpoint | Mô tả | Auth |
|--------|----------|--------|------|
| POST | `/` | Tạo task mới (Hỗ trợ đính kèm ảnh) | ✅ |
| GET | `/` | Lấy toàn bộ task theo UserID | ✅ |
| GET | `/status/:status`| Lọc Task nhanh bằng Trạng thái | ✅ |
| GET | `/vital` | Lấy các Task quan trọng (isVital = true) | ✅ |
| PUT | `/:id` | Cập nhật task (Thông tin, trạng thái, ảnh mới đính kèm) | ✅ |

## 🔒 Cơ Chế Authentication (JWT)

1. **Login:** Đăng nhập thành công, nhận `accessToken` (json response) và `refreshToken` (được lưu tự động ở thẻ Set-Cookie an toàn).
2. **Gọi API:** Frontend cần gắn Authorization Header: `Bearer <accessToken>`.
3. **Refresh Token:** Khi `accessToken` hết hạn (VD sau 15 phút), frontend gọi HTTP POST `/api/auth/refresh-token`. Backend sẽ đọc Cookie, cấp Token mới mà không cần đăng nhập lại.
4. **Bảo Mật:** Mật khẩu được mã hóa một chiều qua `bcryptjs`.

## 📦 Tổ Chức Database Models

Hệ thống được thiết kế Restful Reference qua MongoDB ObjectId:

- **User**: Chứa thông tin định danh, avatar, credentials.
- **Category**: Danh mục cha (Ví dụ: `Priority`, `Status`). Nối với User ID.
- **CategoryValue**: Các tùy chọn cụ thể của loại Danh mục (Ví dụ Category Priority sẽ có giá trị như: `Low`, `Moderate`, `High`). Được liên kết với cả Category ID và User ID.
- **Task**: Đại diện cho 1 công việc. Chứa `title`, `description`, `dueDate`, `isVital`, thông tin hình ảnh lưu tại _Cloudinary_ và một mảng `categoryIds` móc nối tới các lựa chọn thuộc `CategoryValue`.
