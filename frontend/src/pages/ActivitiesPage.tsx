import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/activities.css';

interface Activity {
  id: number;
  title: string;
  image: string;
  caloriesPerMinute: number;
}

const ActivitiesPage: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [duration, setDuration] = useState('');

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/activities');
        setActivities(res.data);
      } catch (err) {
        console.error('Failed to fetch activities:', err);
      }
    };

    fetchActivities();
  }, []);

  const handleConfirm = async () => {
    if (!selectedActivity || !duration) return;

    try {
      await axios.post('http://localhost:5000/api/activities/record', {
        userId: 1, // Replace with actual authenticated user ID
        activityId: selectedActivity.id,
        duration: Number(duration),
      });
      alert('Activity recorded successfully!');
      setSelectedActivity(null);
      setDuration('');
    } catch (err) {
      console.error('Failed to record activity:', err);
    }
  };

  return (
    <div className="activities-wrapper">
      <h2 className="activities-title">🔥 Track Your Activities</h2>

      <div className="activities-container">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="activity-card"
            style={{ backgroundImage: `url(${activity.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            onClick={() => setSelectedActivity(activity)}
          >
            <div className="activity-card-overlay">
              {activity.title}
            </div>
          </div>
        ))}
      </div>

      {selectedActivity && (
        <div className="activity-input-box">
          <h3>{selectedActivity.title}</h3>
          <label>Duration (minutes)</label>
          <input
            type="number"
            value={duration}
            placeholder="e.g. 30"
            onChange={(e) => setDuration(e.target.value)}
          />
          <div className="activity-buttons">
            <button className="confirm-btn" onClick={handleConfirm}>✅ Confirm</button>
            <button className="cancel-btn" onClick={() => setSelectedActivity(null)}>❌ Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivitiesPage;
