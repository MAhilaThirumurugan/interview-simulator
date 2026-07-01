# 🎯 AI Interview Simulator

<p align="center">
  <img src="https://img.shields.io/badge/React-19-blue?logo=react" />
  <img src="https://img.shields.io/badge/Node.js-Backend-green?logo=node.js" />
  <img src="https://img.shields.io/badge/Express.js-API-lightgrey?logo=express" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas-success?logo=mongodb" />
  <img src="https://img.shields.io/badge/JWT-Authentication-orange" />
  <img src="https://img.shields.io/badge/Deployment-Vercel%20%7C%20Render-black" />
</p>

---

## 🌐 Live Demo

🔗 **Frontend:**  
https://interview-simulator-lyart.vercel.app

---

# 📌 Project Overview

AI Interview Simulator is a full-stack MERN application that helps users practice technical interviews in an interactive environment.

Users can:

- Create an account
- Log in securely
- Start interview sessions
- Answer technical questions
- View interview history
- Track interview scores

The application demonstrates authentication, REST APIs, cloud deployment, MongoDB integration, and responsive frontend development.

---

# ✨ Features

### 👤 Authentication

- User Registration
- Secure Login
- JWT Authentication
- Protected Routes
- Persistent Login

### 🎯 Interview Module

- Start New Interview
- Technical Questions
- Multiple Difficulty Levels
- Topic Selection
- Answer Submission
- Interview Completion

### 📊 Dashboard

- Welcome Dashboard
- Previous Interviews
- Interview Score
- Interview Status
- Logout

### ☁️ Cloud Deployment

- Frontend deployed on **Vercel**
- Backend deployed on **Render**
- Database hosted on **MongoDB Atlas**

---

# 🛠️ Tech Stack

## Frontend

- React.js
- React Router
- Axios
- JavaScript
- CSS

## Backend

- Node.js
- Express.js
- JWT
- bcrypt.js
- Express Validator

## Database

- MongoDB Atlas
- Mongoose

## Deployment

- Vercel
- Render

---

# 📂 Project Structure

```
interview-simulator
│
├── client
│   ├── src
│   │
│   ├── components
│   ├── context
│   ├── pages
│   ├── services
│   ├── App.jsx
│   └── main.jsx
│
├── server
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── validators
│   ├── app.js
│   └── server.js
│
└── README.md
```

---

# 📸 Screenshots

## Login Page

*(Add Screenshot Here)*

---

## Register Page

*(Add Screenshot Here)*

---

## Dashboard

*(Add Screenshot Here)*

---

## Interview Session

*(Add Screenshot Here)*

---

## Interview History

*(Add Screenshot Here)*

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/MAhilaThirumurugan/interview-simulator.git
```

---

## Frontend Setup

```bash
cd client
npm install
npm run dev
```

---

## Backend Setup

```bash
cd server
npm install
npm start
```

---

# 🔧 Environment Variables

## Server (.env)

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

---

## Client (.env)

```env
VITE_API_URL=http://localhost:5000/api
```

---

# 🔐 Authentication Flow

1. User registers
2. Password is encrypted using bcrypt
3. User logs in
4. JWT token is generated
5. Token is stored in Local Storage
6. Protected APIs verify JWT
7. User accesses dashboard

---

# 📡 REST API Endpoints

## Authentication

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/auth/register` | Register User |
| POST | `/api/auth/login` | Login User |
| GET | `/api/auth/me` | Get Logged-in User |

---

## Interview

| Method | Endpoint |
|---------|----------|
| POST | `/api/interviews/start` |
| POST | `/api/interviews/answer` |
| PATCH | `/api/interviews/:id/end` |
| GET | `/api/interviews/history` |
| GET | `/api/interviews/:id` |

---

# 📚 Concepts Used

- React Context API
- React Hooks
- Protected Routes
- REST API
- JWT Authentication
- Password Hashing
- MongoDB Atlas
- Mongoose ODM
- Middleware
- MVC Architecture
- Environment Variables
- Axios Interceptors
- Cloud Deployment

---

# 🚀 Future Enhancements

- AI-generated interview questions
- Voice Interview Support
- Timer for Interviews
- PDF Report Generation
- Performance Analytics
- Dark Mode
- Email Password Reset
- Admin Dashboard

---

# 👩‍💻 Author

**Mahila T**

Aspiring Full Stack Developer passionate about building scalable web applications using the MERN Stack.

### GitHub

https://github.com/MAhilaThirumurugan

---

# ⭐ Support

If you like this project, consider giving it a ⭐ on GitHub!

---

## 🙏 Acknowledgements

This project was built for learning and practicing full-stack web development concepts, including authentication, REST APIs, cloud deployment, and MongoDB integration.
