# 📝 ToDo List Backend API

REST API hoàn chỉnh cho ứng dụng quản lý công việc (ToDo List), được xây dựng bằng Node.js, Express và MongoDB.

## 🛠️ Công Nghệ Sử Dụng

| Thành phần | Công nghệ |
|---|---|
| **Runtime** | Node.js (với `--watch` mode) |
| **Framework** | Express.js v5 |
| **Database** | MongoDB (Mongoose ODM v9) |
| **Cache / Blacklist** | Redis (ioredis) |
| **Authentication** | JWT — Access Token + Refresh Token |
| **Password Hashing** | bcryptjs |
| **File Upload** | Multer + Cloudinary (ảnh Task & Avatar) |

## 📁 Cấu Trúc Thư Mục

```
ToDo-List/
├── src/
│   ├── config/
│   │   ├── db.js                   # Kết nối MongoDB
│   │   ├── redis.js                # Kết nối Redis (Token Blacklist)
│   │   ├── cloudinary.config.js    # Cấu hình Cloudinary & Multer storage
│   │   └── jwt.js                  # Hàm tiện ích tạo/xác thực JWT
│   ├── controllers/                # Xử lý Request/Response cho từng module
│   ├── middlewares/                # Xác thực Token, Cấu hình Multer upload
│   ├── models/                     # Mongoose Schemas (User, Task, Category, CategoryValue)
│   ├── routes/                     # Định nghĩa API endpoints
│   ├── services/                   # Business logic và tương tác Database
│   ├── validations/                # Kiểm tra và làm sạch dữ liệu đầu vào
│   ├── app.js                      # Khởi tạo và cấu hình Express app
│   └── index.js                    # Entry point — Khởi động server
├── .env                            # Biến môi trường (không commit)
├── .gitignore
└── package.json
```

## 🚀 Cài Đặt & Chạy

### 1. Clone project

```bash
git clone https://github.com/Nhgbaroo/To-Do-List.git
cd To-Do-List
```

### 2. Cài đặt dependencies

```bash
npm install
```

### 3. Cấu hình biến môi trường `.env`

Tạo file `.env` ở thư mục gốc:

```env
PORT=3000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/todo-list

# JWT
ACCESS_TOKEN_SECRET=your-access-token-secret-key
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_SECRET=your-refresh-token-secret-key
REFRESH_TOKEN_EXPIRES_IN=7d

# Redis (Token Blacklist)
REDIS_URL=redis://localhost:6379

# Cloudinary (Upload ảnh Task & Avatar)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 4. Khởi chạy server

```bash
# Development (tự reload khi sửa code)
npm run dev

# Production
npm start
```

> Server chạy tại: `http://localhost:3000`
>
> ⚠️ **Yêu cầu:** Redis phải đang chạy trước khi khởi động server (dùng cho Token Blacklist).

---

## 📮 API Endpoints

Base URL: `/api`

### 🔐 Authentication — `/api/auth`

| Method | Endpoint | Mô tả | Yêu cầu Auth |
|--------|----------|--------|:---:|
| `POST` | `/register` | Đăng ký tài khoản mới | ❌ |
| `POST` | `/login` | Đăng nhập, nhận `accessToken` + `refreshToken` cookie | ❌ |
| `POST` | `/logout` | Đăng xuất, blacklist `accessToken` trong Redis | ✅ |
| `POST` | `/refresh-token` | Cấp `accessToken` mới qua `refreshToken` cookie | 🍪 |

### 👤 Users — `/api/users`

| Method | Endpoint | Mô tả | Yêu cầu Auth |
|--------|----------|--------|:---:|
| `GET` | `/profile` | Lấy thông tin cá nhân | ✅ |
| `PUT` | `/profile` | Cập nhật thông tin cơ bản (họ tên, v.v.) | ✅ |
| `PUT` | `/avatar` | Cập nhật avatar (tự động xóa ảnh cũ trên Cloudinary) | ✅ |
| `PUT` | `/change-password` | Thay đổi mật khẩu | ✅ |

### 📂 Categories — `/api/categories`

| Method | Endpoint | Mô tả | Yêu cầu Auth |
|--------|----------|--------|:---:|
| `POST` | `/` | Tạo danh mục mới (VD: `Status`, `Priority`) | ✅ |
| `GET` | `/` | Lấy danh sách tất cả danh mục của user | ✅ |
| `PUT` | `/:id` | Cập nhật danh mục | ✅ |
| `DELETE` | `/:id` | Xóa danh mục | ✅ |

### 🏷️ Category Values — `/api/category-values`

| Method | Endpoint | Mô tả | Yêu cầu Auth |
|--------|----------|--------|:---:|
| `POST` | `/:categoryId` | Thêm giá trị cho danh mục (VD: `High`, `Low`) | ✅ |
| `GET` | `/` | Lấy toàn bộ giá trị danh mục của user | ✅ |
| `GET` | `/detail/:categoryValueId` | Lấy chi tiết một giá trị danh mục theo ID | ✅ |
| `GET` | `/:categoryId` | Lấy tất cả giá trị thuộc một danh mục cụ thể | ✅ |
| `PUT` | `/:categoryValueId` | Cập nhật giá trị danh mục | ✅ |
| `DELETE` | `/:categoryValueId` | Xóa giá trị danh mục | ✅ |

### ✅ Tasks — `/api/tasks`

| Method | Endpoint | Mô tả | Yêu cầu Auth |
|--------|----------|--------|:---:|
| `POST` | `/` | Tạo task mới (hỗ trợ đính kèm ảnh) | ✅ |
| `GET` | `/` | Lấy toàn bộ task của user hiện tại | ✅ |
| `GET` | `/:id` | Lấy chi tiết một task theo ID | ✅ |
| `GET` | `/vital` | Lấy các task quan trọng (`isVital = true`) | ✅ |
| `GET` | `/status/:status` | Lọc task theo trạng thái | ✅ |
| `PUT` | `/:id` | Cập nhật task (nội dung, danh mục, ảnh mới) | ✅ |
| `DELETE` | `/:id` | Xóa task (tự động xóa ảnh trên Cloudinary nếu có) | ✅ |

---

## 🔒 Cơ Chế Authentication

```
Client                          Server
  │                               │
  ├──── POST /login ──────────────►│
  │                               │── Tạo accessToken (15m) + refreshToken (7d)
  │◄─── accessToken (body) ───────┤
  │◄─── refreshToken (Set-Cookie)─┤
  │                               │
  ├──── GET /api/* ───────────────►│ Header: Authorization: Bearer <accessToken>
  │◄─── Response data ────────────┤
  │                               │
  ├──── POST /refresh-token ──────►│ Tự động gửi cookie
  │◄─── accessToken mới (body) ───┤
  │                               │
  ├──── POST /logout ─────────────►│
  │                               │── Lưu accessToken vào Redis Blacklist (TTL tự hết hạn)
  │◄─── 200 OK ───────────────────┤
```

- **Token Blacklist:** Khi logout, `accessToken` được lưu vào Redis với TTL bằng thời gian còn lại của token. Mọi request tiếp theo dùng token đó sẽ bị từ chối ngay cả khi token chưa hết hạn.
- **Bảo mật mật khẩu:** Hash một chiều bằng `bcryptjs`, không bao giờ trả về trong response.

---

## 🗄️ Database Models

```
User
 ├── _id, username, email, password (hashed)
 └── avatar { public_id, url }

Category
 ├── _id, name, order
 └── userId → User

CategoryValue
 ├── _id, value, order
 ├── categoryId → Category
 └── userId → User

Task
 ├── _id, title, description, dueDate
 ├── isVital (Boolean)
 ├── image { public_id, url }
 ├── categoryIds [ → CategoryValue ]
 └── userId → User
```

- **Category** → Danh mục cha (VD: `Priority`, `Status`).
- **CategoryValue** → Các tùy chọn của mỗi danh mục (VD: `Priority` → `Low`, `Moderate`, `High`).
- **Task** → Công việc, liên kết nhiều `CategoryValue` qua mảng `categoryIds`.

---

## 📦 Scripts

```bash
npm run dev     # Chạy development server (Node.js --watch, auto-reload)
npm start       # Chạy production server
```
