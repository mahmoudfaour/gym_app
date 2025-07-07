import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/authentication/LoginPage';
import SignupPage from './pages/authentication/SignupPage';
import SuccessPage from './pages/SuccessPage';
import VerifyCodePage from './pages/authentication/VerifyCodePage';
import ProtectedRoute from './components/ProtectedRoute';

import DashboardLayout from './layouts/DashboardLayout';
import DashboardPage from './pages/DashboardPage';
import WorkoutPage from './pages/WorkoutPage';
import ActivitiesPage from './pages/ActivitiesPage';
import NutritionPage from './pages/NutritionPage';
import WorkoutDetailsPage from './pages/WorkoutDetailsPage'; // 🆕
import CreateWorkoutPage from './pages/CreateWorkoutPage';

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/success" element={<SuccessPage />} />
      <Route path="/verify" element={<VerifyCodePage />} />

      {/* 🆕 Workout details (standalone page, outside dashboard layout) */}
      <Route path="/workout/:id" element={<WorkoutDetailsPage />} />
      <Route path="/create-workout" element={<CreateWorkoutPage />} />


      {/* Protected routes with Dashboard layout */}
      <Route
        element={
          <ProtectedRoute requireSubscription={true}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/workout" element={<WorkoutPage />} />
        <Route path="/activities" element={<ActivitiesPage />} />
        <Route path="/nutrition" element={<NutritionPage />} />
      </Route>
    </Routes>
  );
}

export default App;
