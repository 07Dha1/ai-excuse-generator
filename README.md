# 🧠 AI Excuse Generator – Full Stack Web Application

A modern **full-stack AI-powered web application** that generates professional, context-aware excuses along with official proof documents, apology messages, predictions, and user interaction features such as ratings and favorites.

This project demonstrates **real-world frontend–backend integration**, authentication, deployment, and production debugging.

---

## 🌐 Live Application

- **Frontend (Vercel)**  
  https://ai-excuse-generator-sigma.vercel.app  

- **Backend API (Render)**  
  https://ai-excuse-generator-j2se.onrender.com  

---

## ✨ Key Features

### 🔐 Authentication
- User Registration & Login
- JWT-based authentication
- Protected dashboard routes

### 🤖 AI Excuse Generation
- Scenario-based excuses:
  - Work
  - School
  - Social
  - Family
- Urgency levels:
  - Normal
  - Urgent

### 📄 Proof & Documentation
- Professionally formatted absence proof
- Downloadable **PDF certificate**
- Proof can be emailed directly

### 🙏 Apology & Prediction
- Professional apology messages
- AI-based prediction of next possible excuse

### ⭐ User Interaction
- Rate excuses (1–5 stars)
- Save excuses to favorites
- Best-rated excuse highlighting

### 🎨 UI & UX
- Premium dark-themed UI
- Hover effects & active states
- Smooth transitions
- Consistent footer design

---

## 🛠️ Tech Stack

### Frontend
- React (Create React App)
- React Router DOM
- Axios
- jsPDF
- Modern inline CSS

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication

### Deployment
- Frontend: **Vercel**
- Backend: **Render**

---

## 🏗️ System Architecture

User Browser
↓
React Frontend (Vercel)
↓ REST API (Axios)
Node.js Backend (Render)
↓
MongoDB Database


---

## 🔑 Environment Variables

### Frontend (Vercel)
```env
REACT_APP_API_URL=https://ai-excuse-generator-j2se.onrender.com

Backend (Render)
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret


Local Setup (Optional)

git clone https://github.com/07Dha1/ai-excuse-generator.git
cd ai-excuse-generator

cd frontend
npm install
npm start

cd backend
npm install
npm run dev

API Endpoints

Authentication

POST /api/auth/register

POST /api/auth/login

Excuses

POST /api/excuses/generate

GET /api/excuses/history

GET /api/excuses/favorites

GET /api/excuses/prediction

GET /api/excuses/best

POST /api/excuses/rate

POST /api/excuses/favorite

POST /api/excuses/send-proof-email

🧠 Learning Outcomes

Frontend–backend deployment using Vercel & Render

Environment variable handling in production

Debugging API routing issues

JWT authentication & protected routes

UI/UX polishing for production apps

Client-side PDF generation

🎓 Academic & Resume Use

This project is suitable for:

Final-year / Major Project

Full-Stack Developer Portfolio

Internship & Job Interviews

👤 Author

MANDODDI SAI SATHYA DHAWAN
CSE (AI/ML) Student
Full-Stack Web Developer

⭐ Note

If you find this project useful, please consider starring ⭐ the repository.


---

