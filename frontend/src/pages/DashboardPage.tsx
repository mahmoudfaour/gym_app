// src/pages/DashboardPage.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { api } from '../services/api';
import {
  FaFire,
  FaChartLine,
  FaUtensils,
  FaCalendarAlt,
  FaEdit,
} from 'react-icons/fa';
import type { IconType } from 'react-icons';
import '../styles/dashboard.css';

interface User {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
  height?: number;
  weight?: number;
  age?: number;
}

interface MetricCardProps {
  icon: IconType;
  label: string;
  value: string;
  trend?: 'up' | 'down' | 'neutral';
}

interface DashboardMetrics {
  caloriesBurned: number;
  dailyCalories: number;
  dailyProtein: number;
}

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    caloriesBurned: 0,
    dailyCalories: 0,
    dailyProtein: 0,
  });

  const [form, setForm] = useState({
    height: '',
    weight: '',
    age: '',
    bmi: '',
  });

  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const fetchUserAndMetrics = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const decoded: any = jwtDecode(token);
        const userId = decoded.userId;

        const [userRes, metricsRes] = await Promise.all([
          api.get(`/users/${userId}`),
          api.get(`/dashboard/${userId}/metrics`),
        ]);

        setUser(userRes.data);
        setMetrics(metricsRes.data);

        setForm({
          height: userRes.data.height?.toString() || '',
          weight: userRes.data.weight?.toString() || '',
          age: userRes.data.age?.toString() || '',
          bmi: '',
        });
      } catch (error) {
        console.error(error);
        navigate('/login');
      }
    };

    fetchUserAndMetrics();
  }, [navigate]);

  useEffect(() => {
    const heightInMeters = parseFloat(form.height) / 100;
    const weight = parseFloat(form.weight);
    if (heightInMeters > 0 && weight > 0) {
      const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);
      setForm((prev) => ({ ...prev, bmi }));
    }
  }, [form.height, form.weight]);

  const calculateBMI = (weight: number, height: number): string => {
    if (!weight || !height) return 'N/A';
    const heightInM = height / 100;
    const bmi = weight / (heightInM * heightInM);
    return bmi.toFixed(1);
  };

const getNeedleRotation = (bmiStr: string): number => {
  const bmi = parseFloat(bmiStr);
  if (isNaN(bmi)) return 0;

  // Adjusted range to visually fit the chart better
  const minBMI = 13;
  const maxBMI = 37;

  const clampedBMI = Math.max(minBMI, Math.min(bmi, maxBMI));

  // Map to -90 to +90 degrees
  const degree = ((clampedBMI - minBMI) / (maxBMI - minBMI)) * 180 - 90;

  return degree;
};



  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const formData = new FormData();
      formData.append('image', e.target.files[0]);

      try {
        const token = localStorage.getItem('token');
        const res = await api.post('/users/profile-image', formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        setUser((prev) =>
          prev ? { ...prev, profileImage: res.data.imageUrl } : prev
        );
      } catch {
        alert('Failed to upload image.');
      }
    }
  };

  const handleUserUpdate = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await api.patch(
        `/users/${user?.id}`,
        {
          height: parseInt(form.height),
          weight: parseInt(form.weight),
          age: parseInt(form.age),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUser(res.data);
      alert('Profile updated');
      setShowPopup(false);
    } catch {
      alert('Failed to update profile');
    }
  };

  const metricCards: MetricCardProps[] = [
    {
      icon: FaFire,
      label: 'Calories Burned',
      value: `${metrics.caloriesBurned} kcal`,
      trend: 'up',
    },
    {
      icon: FaUtensils,
      label: 'Protein Intake',
      value: `${metrics.dailyProtein.toFixed(1)} g`,
      trend: 'neutral',
    },
    {
      icon: FaChartLine,
      label: 'Calorie Intake',
      value: `${metrics.dailyCalories} kcal`,
      trend: 'neutral',
    },
  ];

  const MetricCard: React.FC<MetricCardProps> = ({
    icon: Icon,
    label,
    value,
    trend = 'neutral',
  }) => (
    <div className="card">
      <div className="card-icon">
        <Icon className="card-icon-svg" size={24} />
      </div>
      <div className="card-content">
        <p className="card-label">{label}</p>
        <p className="card-value">{value}</p>
        {trend !== 'neutral' && (
          <span className={`trend-indicator ${trend}`}>
            {trend === 'up' ? '↑' : '↓'}
          </span>
        )}
      </div>
    </div>
  );

  return (
    <div className="main-content">
      <div className="header-section">
        <h2 className="welcome">
          Welcome {user?.name || 'User'}, <span>Good Morning</span>
        </h2>
        <div className="date-display">
          <FaCalendarAlt size={16} />
          <span>{new Date().toLocaleDateString()}</span>
        </div>
      </div>

      <div className="card-grid">
        {metricCards.map((card, index) => (
          <MetricCard key={index} {...card} />
        ))}
      </div>

      <div className="profile-bmi-wrapper">
        {/* Profile Card */}
        <div className="profile-card">
          <div className="profile-image-container">
            <label htmlFor="profile-upload" className="upload-label">
              <img
                src={
                  user?.profileImage
                    ? `http://localhost:5000${user.profileImage}`
                    : 'https://cdn-icons-png.flaticon.com/512/1160/1160358.png'
                }
                alt="Profile"
                className="avatar"
              />
              <span className="upload-icon">✏️</span>
            </label>
            <input
              type="file"
              id="profile-upload"
              style={{ display: 'none' }}
              accept="image/*"
              onChange={handleImageUpload}
            />
          </div>
          <h4>{user?.name || 'User'}</h4>
          <p className="username">@{user?.email?.split('@')[0]}</p>
          <div className="profile-stats">
            <p><strong>Weight:</strong> {user?.weight ?? '—'} kg</p>
            <p><strong>Height:</strong> {user?.height ?? '—'} cm</p>
            <p><strong>Age:</strong> {user?.age ?? '—'} yrs</p>
          </div>
          <button className="confirm-btn" onClick={() => setShowPopup(true)}>
            <FaEdit style={{ marginRight: '6px' }} /> Edit Profile
          </button>
        </div>

        {/* BMI Chart */}
        {user?.height && user?.weight && (
          <div className="bmi-chart-container">
            <div className="bmi-chart-wrapper">
              <img
                src="/images/bmi-chart.png"
                alt="BMI Chart"
                className="bmi-chart"
              />
              <div
                className="bmi-cursor"
                style={{
                  transform: `rotate(${getNeedleRotation(
                    calculateBMI(user.weight, user.height)
                  )}deg)`,
                }}
              />
            </div>
            <h3 className="bmi-label">
              <span style={{ color: '#fbbf24' }}>BMI:</span>{' '}
              {calculateBMI(user.weight, user.height)}
            </h3>
          </div>
        )}
      </div>

      {/* Popup */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h3>Edit Profile</h3>
            {['weight', 'height', 'age'].map((key) => (
              <div key={key} className="stat-item-flex">
                <label className="stat-label">
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </label>
                <div className="input-wrapper">
                  <input
                    type="number"
                    placeholder={key}
                    value={form[key as keyof typeof form] as string}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        [key]: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            ))}
            <p style={{ textAlign: 'center', marginTop: '10px' }}>
              <strong>BMI:</strong> {form.bmi}
            </p>
            <button className="confirm-btn" onClick={handleUserUpdate}>
              💾 Save
            </button>
            <button
              className="confirm-btn"
              style={{ backgroundColor: '#dc3545' }}
              onClick={() => setShowPopup(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
