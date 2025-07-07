import { useState, useEffect, useRef } from 'react';
import { api } from '../../services/api';
import { useNavigate } from 'react-router-dom';

export default function VerifyCodePage() {
  const [codeDigits, setCodeDigits] = useState(Array(6).fill(''));
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const inputsRef = useRef<HTMLInputElement[]>([]);

  useEffect(() => {
    const storedEmail = localStorage.getItem('verifyEmail');
    if (!storedEmail) {
      alert('Missing email. Please log in again.');
      navigate('/login');
    } else {
      setEmail(storedEmail);
    }
  }, [navigate]);

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return; // Only allow digits

    const newDigits = [...codeDigits];
    newDigits[index] = value;
    setCodeDigits(newDigits);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !codeDigits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = codeDigits.join('');
    if (code.length !== 6) return alert('Enter all 6 digits');

    try {
      const res = await api.post('/auth/login-step2', { email, code });
      const { token, isSubscribed } = res.data;

      localStorage.setItem('token', token);
      localStorage.removeItem('verifyEmail');
      navigate(isSubscribed ? '/dashboard' : '/home');
    } catch {
      alert('Invalid code or error. Try again.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Enter Verification Code</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="code-input-wrapper">
            {codeDigits.map((digit, idx) => (
              <input
  key={idx}
  ref={(el) => {
    if (el) inputsRef.current[idx] = el;
  }}
  type="text"
  maxLength={1}
  className="code-input"
  value={digit}
  onChange={(e) => handleChange(e.target.value, idx)}
  onKeyDown={(e) => handleKeyDown(e, idx)}
/>

            ))}
          </div>
          <button type="submit" className="auth-button">Verify</button>
        </form>
      </div>
    </div>
  );
}
