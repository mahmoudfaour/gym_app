import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

// PNG icon imports
import BasicIcon from '../assets/icons/basic.png';
import PremiumIcon from '../assets/icons/premium.png';
import ProIcon from '../assets/icons/pro.png';

type Plan = {
  id: number;
  title: string;
  price: number;
  duration: number;
};

const PLAN_ICONS = {
  basic: BasicIcon,
  premium: PremiumIcon,
  pro: ProIcon,
};

export default function HomePage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await api.get('/plans');
        console.log('📦 Plans fetched:', response.data);
        setPlans(response.data);
      } catch (error) {
        console.error('❌ Error fetching plans:', error);
      }
    };

    fetchPlans();
  }, []);

 const handleChoosePlan = async (planId: number) => {
  const token = localStorage.getItem('token');

  if (!token) {
    localStorage.setItem('pendingPlanId', planId.toString());
    navigate('/login');
    return;
  }

  setIsLoading(true);

  try {
    await api.post(
      '/subscriptions',
      { planId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    navigate('/success');
  } catch (error: any) {
    console.error('❌ Subscription failed:', error.response || error);

    // ✅ If token is invalid/expired or userId missing
  if (
  error.response?.status === 401 ||
  error.response?.data?.error?.toLowerCase().includes('unauthorized') ||
  error.response?.data?.error?.toLowerCase().includes('user does not exist')
) {
  alert('Please log in to continue.');
  localStorage.removeItem('token');
navigate('/login?redirectTo=/');

}
else if (error.response?.status === 400) {
      alert('You are already subscribed to a plan.');
    } else {
      alert('Subscription failed. Please try again.');
    }
  } finally {
    setIsLoading(false);
  }
};


  const getPlanIcon = (planTitle: string) => {
    const normalized = planTitle.trim().toLowerCase();

    let key: keyof typeof PLAN_ICONS;

    if (normalized.includes('premium')) key = 'premium';
    else if (normalized.includes('pro')) key = 'pro';
    else key = 'basic';

    const iconSrc = PLAN_ICONS[key];

    return (
      <img
        src={iconSrc}
        alt={`${planTitle} Plan`}
        className="plan-icon-img"
        loading="lazy"
      />
    );
  };

  return (
    <div className="homepage-container">
      <h1 className="page-title">Explore Our Gym Plans</h1>
      <p className="page-subtitle">Train hard. Stay strong. Transform your life.</p>

      <div className="plans-wrapper">
        {plans.map((plan) => (
          <div key={plan.id} className="plan-card">
            <div className="plan-icon">{getPlanIcon(plan.title)}</div>

            <div className="plan-content">
              <h2 className="plan-title">{plan.title}</h2>
              <p className="plan-price">
                ${plan.price} / {plan.duration} days
              </p>

              <button
                className="plan-button"
                onClick={() => handleChoosePlan(plan.id)}
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Choose Plan'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
