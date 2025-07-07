import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/success.css';

export default function SuccessPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/dashboard');
    }, 2000); // 2-second delay

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="success-container">
      <div className="success-overlay" />
      <div className="success-content">
        <h1 className="success-title">🎉 Successfully Subscribed!</h1>
        <p className="success-message-text">Redirecting to your dashboard...</p>
        <div className="spinner" />
      </div>
    </div>
  );
}
