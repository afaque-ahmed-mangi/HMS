# 🏨 Smart HMS - Full Stack Hostel Management System

A modern, responsive, and full-featured web-based **Hostel Management System (HMS)** built with the **MERN Stack** (React, Vite, Node.js, Express, MongoDB) featuring an intuitive **3D glassmorphic UI**.

---

## 🌟 Key Features

### 1. 👥 Resident Lifecycle Management
- **Multi-Step Admission Modal** (5 Steps):
  - *Personal Info* (CNIC, Blood group, Medical notes)
  - *Academic / University* (Degree, Roll number, Semester)
  - *Guardian & Emergency Contact* (Relationship, Phone, Address)
  - *Room & Bed Allocation* (Hostel branch, Block, Bed number)
  - *Document Uploads* (CNIC, Student ID, Photo)
- Profile management with **Real Photo Upload & Live 3D Preview**.

### 2. 🛏️ Rooms & Bed Allocation
- Hierarchy: **Hostel → Block → Floor → Room → Bed**.
- Color-coded visual status (*Available, Occupied, Under Maintenance, Reserved*).
- Room attributes: Single AC, Double Sharing, Dormitory, Attached Bath.

### 3. 💳 Fee & Finance Management
- Automated invoice generation with due dates and late fine tracking.
- Collect payment modal supporting **JazzCash, Easypaisa, Bank Transfer, and Cash**.
- Real-time financial analytics (Total billed, revenue collected, pending dues in PKR).

### 4. 📅 Attendance & Gate Pass System
- Night roll-call marking (*Present, On Leave, Absent*).
- Student Gate Pass & Leave request workflow with departure/return verification and guardian SMS alerts.

### 5. 🛂 Visitor Log & Gatekeeper Register
- Visitor entry/exit tracking with CNIC, student visited, and purpose.
- One-click exit logging and visiting hours compliance.

### 6. 🍽️ Mess & Dining Management
- Weekly full-board meal menu publishing (Breakfast, Lunch, Dinner).
- Kitchen head-counts and resident meal skipping / bill deduction requests.

### 7. 🔧 Maintenance & Complaints
- Service tickets across categories (*Electrical, Plumbing, Carpentry, Wi-Fi*).
- Status workflow: `Open → Assigned → In Progress → Resolved → Closed`.

### 8. 📢 Notice Board & Circulars
- Broadcast announcements hostel-wide or block-wise with priority pinning.

### 9. 🎨 3D Design Look & Custom Admin Branding
- Dynamic 3D depth, isometric card hover effects, pushable 3D buttons, and ambient lighting.
- Admin Logo & Branding Customizer: upload custom hostel logo file or select 3D animated emblems.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS v4, Lucide React Icons, Recharts
- **Backend**: Node.js (ESM), Express.js REST API
- **Database**: MongoDB with Mongoose (with automated in-memory fallback & data seeding)
- **Authentication**: JWT (JSON Web Tokens) with Bcrypt password hashing & 2-step password reset OTP

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation & Run

1. **Clone the repository:**
   ```bash
   git clone https://github.com/afaque-ahmed-mangi/Hostel-Management-System.git
   cd Hostel-Management-System
   ```

2. **Run Backend:**
   ```bash
   cd back-end
   npm install
   node server.js
   ```
   *Runs on `http://localhost:5000` with auto-seeded demo accounts.*

3. **Run Frontend:**
   ```bash
   cd ../front-end
   npm install
   npm run dev
   ```
   *Runs on `http://localhost:5173`.*

---

## 🔑 Demo Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **Super Admin** | `admin@hms.com` | `admin123` |
| **Warden** | `warden@hms.com` | `warden123` |
| **Accountant** | `accountant@hms.com` | `account123` |
| **Resident (Student)** | `resident@hms.com` | `resident123` |
