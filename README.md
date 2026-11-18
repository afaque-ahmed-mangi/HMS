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

---

## 🤖 AI Assistant & Extensible Model Architecture

Smart HMS features a full-featured AI Assistant that queries live hotel/hostel inventory, policies, and fee structures in real-time.

### 📐 Architecture Flow
```
Browser Chat Widget 
   └──> POST /api/chat (Rate limited, sanitized)
          └──> AI Service Layer (src/ai/aiService.js)
                 └──> AI Provider (src/ai/geminiProvider.js, claudeProvider.js, or localProvider.js)
                        └──> Reply back to frontend & logged to MongoDB (chat_logs)
```
- **Zero Frontend Leaks**: Frontend never contacts external AI providers directly and never contains API keys.
- **Fact-Grounded**: Answers strictly based on real MongoDB hotel vacancies and policies. Never fabricates prices or dates.
- **Safety**: Cannot create or modify bookings directly (guides users to front-desk procedures). Redacts PII (credit cards, emails, phone numbers) before logging.

### 🔄 How to Switch AI Models

The backend uses a strict **Provider Abstraction Pattern** (`src/ai/baseProvider.js`). Swapping between external APIs and your own locally trained model requires **zero frontend changes** and **zero API route modifications**:

#### 1. Using Google Gemini (Default)
In `back-end/.env`:
```env
AI_PROVIDER=external
AI_API_KEY=your_gemini_api_key
AI_MODEL=gemini-3.5-flash-lite
```

#### 2. Using Anthropic Claude
In `back-end/.env`:
```env
AI_PROVIDER=claude
AI_API_KEY=your_anthropic_api_key
CLAUDE_MODEL=claude-3-haiku-20240307
```

#### 3. Switching to Your Own Trained Model
1. Change `AI_PROVIDER` in `back-end/.env`:
   ```env
   AI_PROVIDER=local
   LOCAL_MODEL_ENDPOINT=http://localhost:11434/api/generate
   LOCAL_MODEL_NAME=custom-hms-model
   ```
2. Open `back-end/src/ai/localProvider.js` and plug in your local inference call (e.g., Ollama, vLLM, or custom weights).

---

## 📊 Training Data Collection & Export

Conversations are automatically sanitized (credit cards, phone numbers, and emails masked) and recorded in the `chat_logs` collection.

To export logged conversations for fine-tuning your custom model:
```bash
cd back-end
npm run export-data
```
Outputs:
- `back-end/exports/training_data.jsonl`: Multi-turn conversational format ready for fine-tuning.
- `back-end/exports/training_data.csv`: Tabular CSV for quick inspection.

---

## 🗄️ Database Setup & Production Deployment

- **Local Development**: Runs out of the box with zero setup! If `MONGO_URI` is omitted, an automatic in-memory MongoDB server runs and auto-seeds all demo data.
- **Production Deployment**: Simply set your MongoDB connection string in `back-end/.env`:
  ```env
  MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/hostel_db?retryWrites=true&w=majority
  ```
  The backend will automatically connect to your production database when deployed.
