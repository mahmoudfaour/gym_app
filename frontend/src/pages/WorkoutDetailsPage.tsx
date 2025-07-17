import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/workout.css';

interface Routine {
  id: number;
  name: string;
  sets: number;
  reps: number;
  rest: number;
  calorieRatio: number;
}

interface Workout {
  id: number;
  title: string;
  type: string;
  difficulty: string;
  duration: number;
  calories: number;
  image: string;
}

const WorkoutDetailsPage = () => {
  const { id } = useParams();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const fetchWorkoutData = async () => {
      try {
        const workoutRes = await axios.get(`http://localhost:5000/api/workouts/${id}`);
        const routinesRes = await axios.get(`http://localhost:5000/api/workouts/${id}/routines`);
        setWorkout(workoutRes.data);
        setRoutines(routinesRes.data);
        setLoading(false);
      } catch (err) {
        console.error('Error loading workout details:', err);
        setLoading(false);
      }
    };

    fetchWorkoutData();
  }, [id]);

  const handleCompleteWorkout = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      alert('You must be logged in to complete a workout.');
      return;
    }

    try {
      await axios.post(
        'http://localhost:5000/api/workouts/complete',
        {
          workoutId: workout?.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCompleted(true);
      alert('✅ Workout completed and recorded!');
    } catch (error) {
      console.error('Error completing workout:', error);
      alert('❌ Failed to record workout.');
    }
  };

  if (loading) return <p className="loading">Loading workout...</p>;
  if (!workout) return <p className="loading">Workout not found.</p>;

  return (
    <div className="workout-details-container">
      {/* 🖼️ Banner Section */}
      <div
        className="workout-details-banner"
        style={{ backgroundImage: `url(${workout.image})` }}
      >
        <div className="workout-details-overlay">
          <h1>{workout.title}</h1>
          <div className="workout-meta">
            <span>🔥 {workout.calories} kcal</span>
            <span>🕒 {workout.duration} min</span>
            <span>🎯 {workout.difficulty.toUpperCase()}</span>
          </div>
        </div>
      </div>

      {/* 📋 Routine Details */}
      <div className="workout-details-content">
        <h2 style={{ marginBottom: '20px' }}>Workout Routine</h2>
        <ul className="routine-list">
          {routines.map((r) => (
            <li key={r.id} style={{ marginBottom: '10px' }}>
              <strong>{r.name}</strong>: {r.sets} sets × {r.reps} reps (Rest {r.rest}s)
              <br />
              <span style={{ color: '#fbbf24' }}>
                🔥 Estimated: {(workout.calories * r.calorieRatio).toFixed(1)} kcal
              </span>
            </li>
          ))}
        </ul>

        {/* ✅ Complete Button */}
        {!completed ? (
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <button className="create-workout-btn" onClick={handleCompleteWorkout}>
              ✅ Complete Workout
            </button>
          </div>
        ) : (
          <p style={{ textAlign: 'center', marginTop: '30px', color: 'green' }}>
            ✅ Workout completed and saved!
          </p>
        )}
      </div>
    </div>
  );
};

export default WorkoutDetailsPage;
