// src/pages/DashboardPage.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { api } from '../services/api';
import { FaHeartbeat, FaFire, FaRunning, FaMoon, FaCalendarAlt, FaUtensils, FaChartLine } from 'react-icons/fa';
import type { IconType } from 'react-icons';


interface User {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
}

interface MetricCardProps {
  icon: IconType;
  label: string;
  value: string;
  trend?: 'up' | 'down' | 'neutral';
  active?: boolean;
}

interface ActivityStat {
  value: string;
  label: string;
}

interface NutritionItem {
  name: string;
  duration: string;
}

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

 useEffect(() => {
  const fetchUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const decoded: any = jwtDecode(token);
      const userId = decoded.userId;

      const res = await api.get(`/users/${userId}`);
      setUser(res.data);
    } catch {
      alert('Failed to load user data');
      navigate('/login');
    }
  };

  fetchUser();
}, [navigate]);


  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const formData = new FormData();
formData.append('image', e.target.files[0]); // ✅ matches backend's 'image'

      try {
        const token = localStorage.getItem('token');
const res = await api.post('/users/profile-image', formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        setUser((prev) => prev ? { ...prev, profileImage: res.data.imageUrl } : prev);
      } catch {
        alert('Failed to upload image.');
      }
    }
  };

  const metricCards: MetricCardProps[] = [
    { icon: FaHeartbeat, label: 'Heart Rate', value: '110 BPM', trend: 'up', active: true },
    { icon: FaFire, label: 'Calories Burn', value: '1,650 kcal', trend: 'down' },
    { icon: FaRunning, label: 'Distance', value: '2.5 km', trend: 'up' },
    { icon: FaMoon, label: 'Sleep', value: '8h 12m', trend: 'neutral' },
  ];

  const activityStats: ActivityStat[] = [
    { value: '25 min', label: 'Stretching' },
    { value: '40 min', label: 'Crossfit' },
    { value: '55 min', label: 'Yoga' },
  ];

  const nutritionItems: NutritionItem[] = [
    { name: 'Fresh Vegetables', duration: '7 Days' },
    { name: 'Citrus Fruits', duration: '12 Days' },
    { name: 'Protein Shakes', duration: 'Daily' },
  ];

  const Icon: React.FC<{ icon: IconType; className?: string; size?: number }> =
    ({ icon: IconComponent, ...props }) => <IconComponent {...props} />;

  const MetricCard: React.FC<MetricCardProps> = ({ icon, label, value, trend = 'neutral', active = false }) => (
    <div className={`card ${active ? 'active' : ''}`}>
      <div className="card-icon">
        <Icon icon={icon} className="card-icon-svg" size={24} />
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
          <Icon icon={FaCalendarAlt} size={16} />
          <span>{new Date().toLocaleDateString()}</span>
        </div>
      </div>

      <div className="card-grid">
        {metricCards.map((card, index) => (
          <MetricCard key={index} {...card} />
        ))}
      </div>

      <div className="dashboard-grid">
        <div className="activity-section">
          <h3 className="section-title"><Icon icon={FaChartLine} size={20} /> Activity Overview</h3>
          <div className="activity-chart">
            <div className="chart-placeholder" />
            <div className="activity-stats">
              {activityStats.map((stat, index) => (
                <div key={index} className="stat-item">
                  <span className="stat-value">{stat.value}</span>
                  <span className="stat-label">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="profile-section">
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
              <div className="stat"><span className="stat-label">Weight</span><span className="stat-value">65 kg</span></div>
              <div className="stat"><span className="stat-label">Height</span><span className="stat-value">178 cm</span></div>
              <div className="stat"><span className="stat-label">Age</span><span className="stat-value">25</span></div>
            </div>
          </div>
        </div>

        <div className="nutrition-section">
          <h3 className="section-title"><Icon icon={FaUtensils} size={20} /> Nutrition Plan</h3>
          <ul className="nutrition-list">
            {nutritionItems.map((item, index) => (
              <li key={index}>
                <span className="nutrition-item">{item.name}</span>
                <span className="nutrition-duration">{item.duration}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
