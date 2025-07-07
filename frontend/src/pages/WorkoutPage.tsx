// src/pages/WorkoutPage.tsx
import React, { useEffect, useState } from 'react';
import DifficultySelector from '../components/DifficultySelector';
import WorkoutCard from '../components/WorkoutCard';
import '../styles/workout.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export interface Workout {
  id: number;
  title: string;
  type: string;
  difficulty: 'beginner' | 'intermediate' | 'pro';
  duration: number; // in minutes
  calories: number;
  image: string;
}

const WorkoutPage: React.FC = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<'beginner' | 'intermediate' | 'pro'>('beginner');
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/workouts')
      .then(res => setWorkouts(res.data))
      .catch(err => console.error('❌ Failed to fetch workouts:', err));
  }, []);

  const filteredWorkouts = workouts.filter(w => w.difficulty === selectedDifficulty);

  return (
    <div className="workout-page">
      <h2 className="workout-title">🏋️‍♀️ Choose Your Workout Level</h2>
      <DifficultySelector selected={selectedDifficulty} onSelect={setSelectedDifficulty} />

     <div className="button-wrapper">
  <button
    className="create-workout-btn"
    onClick={() => navigate('/create-workout')}
  >
    ➕ Create My Own Workout
  </button>
</div>


      <div className="workout-list">
        {filteredWorkouts.map(workout => (
          <WorkoutCard key={workout.id} workout={workout} />
        ))}
      </div>
    </div>
  );
};

export default WorkoutPage;
