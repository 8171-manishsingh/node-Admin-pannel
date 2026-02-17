# 🧑‍💻 Node Admin Panel

A full-featured **Admin Dashboard Panel** built using **Node.js, Express.js and MongoDB**.
This project provides a secure admin authentication system and a dashboard to manage application data from a central interface.

---

## 🚀 Features

* 🔐 Admin Login Authentication
* 🧾 Session Management
* 📊 Dashboard Overview
* 👤 User Management (Add / Edit / Delete)
* 📁 Category Management
* 📝 Form Validation
* 📦 CRUD Operations
* 📤 Image Upload Support (Multer)
* 🧠 Flash Messages & Alerts
* 🔒 Protected Routes (Middleware)

---

## 🛠️ Tech Stack

| Technology      | Usage                  |
| --------------- | ---------------------- |
| Node.js         | Backend runtime        |
| Express.js      | Server framework       |
| MongoDB         | Database               |
| Mongoose        | ODM for MongoDB        |
| EJS             | Template Engine        |
| Bootstrap       | Frontend UI            |
| Multer          | File Uploads           |
| Express-session | Authentication Session |
| Bcrypt          | Password Hashing       |

---

## 📂 Project Structure

```
admin-panel-project/
│
├── config/
│   └── db.js
│
├── models/
│   └── userModel.js
│
├── routes/
│   └── adminRoutes.js
│
├── controllers/
│   └── adminController.js
│
├── middleware/
│   └── authMiddleware.js
│
├── public/
│   ├── css/
│   ├── js/
│   └── uploads/
│
├── views/
│   ├── admin/
│   ├── layout/
│   └── login.ejs
│
├── app.js
├── package.json
└── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/8171-manishsingh/node-Admin-pannel.git
cd node-Admin-pannel
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Create Environment File

Create a **.env** file in the root directory and add:

```
PORT=5000
MONGO_URL=mongodb://127.0.0.1:27017/adminpanel
SESSION_SECRET=yourSecretKey
```

---

### 4️⃣ Start MongoDB

Make sure MongoDB is running locally.

Windows (if installed as service):

```
net start MongoDB
```

---

### 5️⃣ Run the Project

```bash
npm start
```

or

```bash
nodemon app.js
```

---

## 🌐 Access the Application

Open your browser:

```
http://localhost:5000/admin
```

---

## 🔑 Default Admin Login

Create admin manually in MongoDB OR register through signup page (if enabled).

Example:

```
Email: admin@gmail.com
Password: 123456
```

---

## 📸 Screenshots

(Add your dashboard screenshots here after deployment)

---

## 🔒 Security

* Passwords are encrypted using **bcrypt**
* Sessions handled using **express-session**
* Routes protected using custom authentication middleware

---

## 📌 Future Improvements

* Role-based authentication
* JWT Authentication
* Admin analytics charts
* Email verification
* Forgot password system

---

## 👨‍💻 Author

**Manish Singh**

GitHub: https://github.com/8171-manishsingh
## output image 
(<img width="1872" height="895" alt="Screenshot 2026-02-16 231524" src="https://github.com/user-attachments/assets/82bcedb9-5621-47b5-bf95-b47b2a0ece19" />
)

---

## 📜 License

This project is licensed under the MIT License.
