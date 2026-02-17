# ERP Backend API

A complete ERP backend built with Node.js, Express, and MongoDB (Mongoose). Features include JWT authentication with OTP verification, Role-Based Access Control (RBAC), and Employee CRUD operations.

## Features

- 🔐 JWT Authentication with OTP Verification
- 📧 Email-based OTP for Login and Password Reset
- 👥 Role-Based Access Control (Admin, Manager, Employee)
- 👤 Employee Management (CRUD)
- 🔒 Password Reset functionality

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Gmail account (for sending OTPs)

## Installation

1. Clone the repository and navigate to the project:
```
bash
cd erp-backend
```

2. Install dependencies:
```
bash
npm install
```

3. Configure environment variables:
```
bash
# Edit .env file with your settings
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/erp
JWT_SECRET=your_super_secret_key
OTP_EXPIRE=5
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

4. Start the server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## Default Admin User

Create a default admin user in MongoDB or use the registration endpoint (after creating an admin user).

Example admin user:
```
json
{
  "name": "Admin",
  "email": "admin@gmail.com",
  "password": "admin123",
  "role": "admin"
}
```

## API Endpoints

### Authentication Routes

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/auth/login` | Login and receive OTP | Public |
| POST | `/auth/verify-otp` | Verify OTP and get JWT token | Public |
| POST | `/auth/forgot-password` | Request password reset OTP | Public |
| POST | `/auth/reset-password` | Reset password with OTP | Public |
| POST | `/auth/register` | Register new user | Private/Admin |

### Employee Routes

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/employees` | Create new employee | Private/Admin, Manager |
| GET | `/employees` | Get all employees | Private/Admin, Manager |
| GET | `/employees/all` | Get all users | Private/Admin |
| GET | `/employees/:id` | Get employee by ID | Private/Admin, Manager |
| PUT | `/employees/:id` | Update employee | Private/Admin, Manager |
| DELETE | `/employees/:id` | Deactivate employee | Private/Admin |

## Postman Examples

### 1. Login (Step 1)

**POST** `http://localhost:5000/auth/login`

```
json
{
  "email": "admin@gmail.com",
  "password": "admin123"
}
```

**Response:**
```
json
{
  "msg": "OTP sent to your email"
}
```

### 2. Verify OTP (Step 2)

**POST** `http://localhost:5000/auth/verify-otp`

```
json
{
  "email": "admin@gmail.com",
  "otp": "123456"
}
```

**Response:**
```
json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "name": "Admin",
    "email": "admin@gmail.com",
    "role": "admin"
  }
}
```

**Note:** Copy the `token` value from the response.

### 3. Forgot Password

**POST** `http://localhost:5000/auth/forgot-password`

```
json
{
  "email": "admin@gmail.com"
}
```

**Response:**
```
json
{
  "msg": "Reset OTP sent to your email"
}
```

### 4. Reset Password

**POST** `http://localhost:5000/auth/reset-password`

```
json
{
  "email": "admin@gmail.com",
  "otp": "123456",
  "newPassword": "newpassword123"
}
```

**Response:**
```
json
{
  "msg": "Password reset successful"
}
```

### 5. Create Employee

**POST** `http://localhost:5000/employees`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json
```

**Body:**
```
json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "password": "Temp@123"
}
```

**Response:**
```
json
{
  "_id": "...",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "role": "employee",
  "isActive": true,
  "createdAt": "..."
}
```

### 6. Get All Employees

**GET** `http://localhost:5000/employees`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Response:**
```
json
[
  {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "role": "employee",
    "isActive": true,
    "createdAt": "..."
  }
]
```

### 7. Update Employee

**PUT** `http://localhost:5000/employees/EMPLOYEE_ID`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json
```

**Body:**
```
json
{
  "name": "John Updated",
  "phone": "9876543210"
}
```

**Response:**
```
json
{
  "_id": "...",
  "name": "John Updated",
  "email": "john@example.com",
  "phone": "9876543210",
  "role": "employee",
  "isActive": true,
  "createdAt": "..."
}
```

### 8. Delete (Deactivate) Employee

**DELETE** `http://localhost:5000/employees/EMPLOYEE_ID`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Response:**
```
json
{
  "msg": "Employee deactivated"
}
```

## Role Permissions

| Role | Permissions |
|------|-------------|
| **Admin** | Full access to all endpoints |
| **Manager** | Create, Read, Update employees |
| **Employee** | Read-only access to own profile |

## Project Structure

```
erp-backend/
├── src/
│   ├── app.js              # Main application file
│   ├── config/
│   │   └── db.js           # Database connection
│   ├── models/
│   │   ├── user.model.js   # User schema
│   │   └── otp.model.js   # OTP schema
│   ├── controllers/
│   │   ├── auth.controller.js      # Auth logic
│   │   └── employee.controller.js  # Employee CRUD
│   ├── middlewares/
│   │   ├── auth.middleware.js       # JWT verification
│   │   └── role.middleware.js       # RBAC
│   ├── routes/
│   │   ├── auth.routes.js          # Auth routes
│   │   └── employee.routes.js      # Employee routes
│   └── utils/
│       ├── generateToken.js         # JWT token generator
│       └── sendOtp.js               # Email sender
├── .env                     # Environment variables
├── package.json             # Dependencies
└── README.md                # This file
```

## Error Responses

All endpoints return standard HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

Example error response:
```
json
{
  "msg": "User not found"
}
```

## License

ISC
