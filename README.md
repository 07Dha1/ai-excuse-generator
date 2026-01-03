# 🧠✨ AI Excuse Generator  
### Full-Stack AI-Powered Web Application

> Generate professional, believable excuses with official proof documents, apology letters, predictions, and user interaction — all in one premium web app.

🌐 **Live Demo**: https://ai-excuse-generator-sigma.vercel.app  
🛠 **Backend API**: https://ai-excuse-generator-j2se.onrender.com  

---

## 🚀 Project Overview

**AI Excuse Generator** is a modern full-stack web application designed to generate **context-aware excuses** for real-life scenarios such as work, school, social, or family situations.

The system enhances credibility by providing:
- 📄 Official-style proof documents (PDF)
- 🙏 Professional apology messages
- 🔮 AI-based predictions
- ⭐ User ratings & favorites

This project demonstrates **real-world frontend–backend integration, authentication, deployment, and UI/UX design**.

---

## ✨ Key Features

### 🔐 Authentication
- Secure **User Registration & Login**
- JWT-based authentication
- Protected dashboard access

### 🤖 AI Excuse Generation
- Scenario selection:
  - Work
  - School
  - Social
  - Family
- Urgency levels:
  - Normal
  - Urgent

### 📄 Proof & Documents
- Professionally formatted absence proof
- One-click **PDF download**
- Proof can be sent via **email**

### 🙏 Apology & Prediction
- Polite, professional apology messages
- AI-based prediction of next likely excuse

### ⭐ User Interaction
- Rate excuses (1–5 ⭐)
- Save favorite excuses
- Best-rated excuse highlighting

### 🎨 UI & UX
- Premium dark-themed design
- Hover & active effects
- Smooth transitions
- Consistent layout & footer
- Clean, user-friendly experience

---

## 🛠️ Tech Stack

### 🌐 Frontend
- React (Create React App)
- React Router DOM
- Axios
- jsPDF
- Modern inline CSS

### ⚙️ Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication

### ☁️ Deployment
- **Frontend**: Vercel
- **Backend**: Render

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
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```


----------------
Local Setup

git clone https://github.com/07Dha1/ai-excuse-generator.git
cd ai-excuse-generator



Frontend Setup

cd frontend
npm install
npm start



Backend Setup

cd backend
npm install
npm run dev


API Endpoints


🔐 Authentication

POST /api/auth/register

POST /api/auth/login

🤖 Excuses

POST /api/excuses/generate

GET /api/excuses/history

GET /api/excuses/favorites

GET /api/excuses/prediction

GET /api/excuses/best

POST /api/excuses/rate

POST /api/excuses/favorite

POST /api/excuses/send-proof-email

---------------------------------------------------

🧠 What I Learned

Full-stack application architecture

Secure authentication using JWT

Real-world deployment using Vercel & Render

Handling environment variables in production

Debugging frontend–backend communication issues

UI/UX polishing for better user experience

Client-side PDF generation

----------------------------------------------------------

👤 Author

Sai Dhawan
CSE (AI/ML) Student
Full-Stack Web Developer

⭐ Support

If you like this project, please star ⭐ the repository and share your feedback!
