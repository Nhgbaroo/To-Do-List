# 📝 ToDo List API

REST API cho ứng dụng quản lý công việc, xây dựng bằng Node.js, Express và MongoDB.

## 🛠️ Công Nghệ Sử Dụng

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Authentication:** JWT (Access Token + Refresh Token)
- **Password Hashing:** bcryptjs

## 📁 Cấu Trúc Thư Mục

```
src/
├── config/             # Cấu hình database, JWT
│   ├── db.js
│   └── jwt.js
├── controllers/        # Xử lý request/response
│   ├── auth.controller.js
│   └── categories.controller.js
├── middlewares/         # Xác thực token
│   └── auth.middleware.js
├── models/             # Mongoose schemas
│   ├── user.model.js
│   ├── categories.model.js
│   ├── categoryValue.model.js
│   └── task.model.js
├── routes/             # Định nghĩa API endpoints
│   ├── auth.route.js
│   └── categories.route.js
├── services/           # Business logic
│   ├── auth.service.js
│   └── categories.service.js
├── validations/        # Kiểm tra dữ liệu đầu vào
│   ├── auth.validation.js
│   └── categories.validation.js
├── app.js              # Cấu hình Express app
└── index.js            # Entry point - khởi động server
```

## 🚀 Cài Đặt & Chạy

### 1. Clone project

```bash
git clone https://github.com/<username>/ToDo-List.git
cd ToDo-List
```

### 2. Cài đặt dependencies

```bash
npm install
```

### 3. Tạo file `.env`

```env
MONGODB_URI=mongodb://localhost:27017/test2
PORT=3000
NODE_ENV=development
ACCESS_TOKEN_SECRET=your-access-token-secret-key
REFRESH_TOKEN_SECRET=your-refresh-token-secret-key
```

### 4. Chạy server

```bash
# Development (tự restart khi code thay đổi)
npm run dev

# Production
npm start
```

Server chạy tại: `http://localhost:3000`

## 📮 API Endpoints

### Authentication

| Method | Endpoint | Mô tả | Auth |
|--------|----------|--------|------|
| POST | `/api/auth/register` | Đăng ký tài khoản | ❌ |
| POST | `/api/auth/login` | Đăng nhập | ❌ |
| POST | `/api/auth/logout` | Đăng xuất | ✅ |
| POST | `/api/auth/refresh-token` | Làm mới access token | 🍪 Cookie |

### Categories

| Method | Endpoint | Mô tả | Auth |
|--------|----------|--------|------|
| POST | `/api/categories` | Tạo category mới | ✅ |
| GET | `/api/categories` | Lấy tất cả categories của user | ✅ |
| GET | `/api/categories/:id` | Lấy category theo ID | ✅ |
| PUT | `/api/categories/:id` | Cập nhật category | ✅ |
| DELETE | `/api/categories/:id` | Xoá category | ✅ |

## 📋 Chi Tiết API

### 🔐 Register

```
POST /api/auth/register
```

Body:
```json
{
  "firstName": "Nguyen",
  "lastName": "Van A",
  "username": "nguyenvana",
  "email": "nguyenvana@gmail.com",
  "password": "123456",
  "contactNumber": "0901234567",
  "position": "Developer"
}
```

### 🔑 Login

```
POST /api/auth/login
```

Body:
```json
{
  "email": "nguyenvana@gmail.com",
  "password": "123456"
}
```

Response:
```json
{
  "message": "Đăng nhập thành công",
  "user": { ... },
  "accessToken": "eyJhbG..."
}
```

> Refresh token được lưu trong httpOnly cookie.

### 📂 Create Category

```
POST /api/categories
Authorization: Bearer <accessToken>
```

Body:
```json
{
  "name": "Công việc",
  "order": 1
}
```

> Slug tự động tạo từ name (bỏ dấu, thay khoảng trắng bằng `-`).

## 🔒 Authentication Flow

```
1. Login → nhận accessToken (body) + refreshToken (cookie)
2. Gọi API → gửi header: Authorization: Bearer <accessToken>
3. Token hết hạn (15 phút) → gọi /refresh-token → nhận accessToken mới
4. Refresh token hết hạn (7 ngày) → phải đăng nhập lại
```

## 📦 Database Models

- **Users** — Thông tin tài khoản người dùng
- **Categories** — Danh mục phân loại (thuộc về user)
- **CategoryValues** — Giá trị của danh mục (ref đến Category)
- **Tasks** — Công việc (ref đến User và CategoryValues)
