# 🏥 Medicare — Doctor Appointment Booking System

Medicare is a full-stack **MERN** application that lets patients discover doctors, book appointments, and pay online, while doctors and admins manage schedules, availability, and appointments through dedicated dashboards.

**Live Demo (Frontend):** [medicare-rho-sage.vercel.app](https://medicare-pi-six-35.vercel.app/)
**Live Demo (Admin / Doctor Panel):** [medicare-91ry.vercel.app](https://medicare-91ry.vercel.app/)

---

## 📖 Overview

Medicare connects patients with doctors across multiple specialties, offering a simple, hassle-free way to browse profiles, check availability, and book appointments — with secure online payments powered by **eSewa**.

The project is split into three independent apps within a single repository:

| Folder | Description |
|---|---|
| `frontend/` | Patient-facing React app — browse doctors, book/cancel appointments, manage profile, make payments |
| `admin/` | Admin & Doctor dashboard — manage doctors, view/manage appointments, track earnings |
| `backend/` | Node.js/Express REST API — handles auth, appointments, doctors, payments, and admin operations |

---

## ✨ Features

### Patient Side
- Browse doctors by specialty with detailed profiles
- Book, cancel, and track appointment status
- Secure appointment payments via **eSewa** (HMAC-SHA256 signed transactions, sandbox-tested)
- User authentication (signup/login) with JWT
- Profile management with image upload
- Appointment history ("My Appointments")

### Doctor Side
- Doctor login and dashboard
- View and manage upcoming appointments
- Mark appointments as completed or cancelled
- Toggle availability

### Admin Side
- Admin dashboard with appointment and doctor overview
- Add, update, and manage doctor profiles
- View, confirm, or cancel appointments across all doctors
- Track platform-wide bookings and revenue

---

## 🛠️ Tech Stack

**Frontend & Admin**
- React (Vite)
- React Router DOM
- Tailwind CSS
- Context API for state management
- Axios

**Backend**
- Node.js + Express.js
- MongoDB with Mongoose
- JWT-based authentication
- Multer / Cloudinary for image uploads
- eSewa payment gateway integration (HMAC-SHA256 signature verification)

**Deployment**
- Frontend & Admin: [Vercel](https://vercel.com)
- Backend: Node.js hosting (e.g. Render/Vercel serverless)
- Database: MongoDB Atlas

---

## 📁 Project Structure

```
medicare/
├── admin/          # Admin & Doctor dashboard (React)
├── backend/        # Express REST API
├── frontend/       # Patient-facing app (React)
└── .gitignore
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB (local or Atlas connection string)
- eSewa merchant credentials (for payment testing)

### 1. Clone the repository
```bash
git clone https://github.com/sumirakhatiwoda23/medicare.git
cd medicare
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in `backend/` with the following variables:
```env
PORT=4000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
ADMIN_EMAIL=your_admin_email
ADMIN_PASSWORD=your_admin_password
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_SECRET_KEY=your_cloudinary_secret
ESEWA_MERCHANT_CODE=your_esewa_merchant_code
ESEWA_SECRET_KEY=your_esewa_secret_key
```

Run the backend:
```bash
npm run server
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

Create a `.env` file in `frontend/`:
```env
VITE_BACKEND_URL=http://localhost:4000
```

Run the frontend:
```bash
npm run dev
```

### 4. Admin Panel Setup
```bash
cd ../admin
npm install
```

Create a `.env` file in `admin/`:
```env
VITE_BACKEND_URL=http://localhost:4000
```

Run the admin panel:
```bash
npm run dev
```

---

## 💳 Payment Integration

Medicare integrates **eSewa** for appointment payments:
- HMAC-SHA256 signature generation for secure transaction requests
- Sandbox environment support for testing
- Server-side payment verification before confirming appointment status

---

## 🔗 Live Links

| App | URL |
|---|---|
| Patient Frontend | https://medicare-pi-six-35.vercel.app/ |
| Admin / Doctor Panel | https://medicare-91ry.vercel.app/ |

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome. Feel free to check the [issues page](https://github.com/sumirakhatiwoda23/medicare/issues) or open a pull request.

---

## 📄 License

This project is open source. Add a license of your choice (e.g., MIT) if you plan to distribute it publicly.

---

## 👤 Author

**Sumira Khatiwoda**
Full-Stack MERN Developer
