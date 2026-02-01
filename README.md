# Gym App: Full-Stack Fitness Tracker

A full-stack web application for gym members to subscribe to plans, track workouts, log activities, monitor nutrition, and manage personal health metrics through a dynamic dashboard.

## 📦 Tech Stack

### Frontend

* React + TypeScript
* Axios
* React Router
* JWT for session management

### Backend

* Node.js + Express
* TypeScript
* PostgreSQL with Prisma ORM
* JWT Authentication with Role-based Access Control

### Features

#### ✅ Authentication

* Secure login and registration
* Role-based routing for Students, Instructors, and Admins

#### 🧾 Subscription System

* Browse and subscribe to Gym Plans
* Plans: Basic (1 month), Premium (3 months), Pro (180 days)

#### 📊 Dashboard

* Personalized user dashboard
* BMI calculation
* Profile editing with image upload
* Daily metrics: calories burned, intake, and protein

#### 💪 Workouts

* Workout levels (Beginner, Intermediate, Pro) based on plan
* View and complete custom workout routines
* Calories burned auto-recorded with date

#### 🏃 Activities

* Log activities (e.g., football, hiking) with duration
* Calories calculated based on time and activity

#### 🍎 Nutrition Tracking

* Search aliments using CalorieNinjas API
* Track calorie and protein intake
* Summarize daily nutrition metrics

#### ⚙️ Admin & Instructor Tools

* Instructors: Manage student progress and assign workouts
* Admins: View all users and control global settings

## 🛠️ Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/your-username/gym-app.git
cd gym-app
```

### 2. Install dependencies

#### Backend

```bash
cd backend
npm install
```

#### Frontend

```bash
cd ../frontend
npm install
```

### 3. Setup PostgreSQL and Prisma

* Configure your `.env` in the backend folder:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/gymapp"
JWT_SECRET="yoursecret"
```

* Run Prisma migrations:

```bash
npx prisma migrate dev --name init
```

### 4. Start development servers

#### Backend

```bash
npm run dev
```

#### Frontend

```bash
npm run dev
```

## 📁 Folder Structure

```
gym-app/
├── backend/
│   ├── prisma/             # Prisma schema and migrations
│   ├── routes/             # Express route handlers
│   ├── middlewares/       # Auth middleware
│   ├── controllers/        # Business logic
│   └── server.ts          # Express app entry point
├── frontend/
│   ├── src/pages/          # React pages
│   ├── src/components/     # Reusable UI components
│   ├── src/styles/         # CSS modules
│   └── src/services/api.ts # Axios instance with auth headers
```

## ✅ Future Enhancements

* Progress graphs and weekly reports
* Push notifications for workouts
* Public leaderboard & challenges

## 📄 License

MIT License

---

> Made with 💪 by Mahmoud Faour
