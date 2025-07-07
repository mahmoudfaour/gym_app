// src/components/WorkoutCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import type { Workout } from '../pages/WorkoutPage';
import '../styles/workout.css';

interface Props {
  workout: Workout;
}

const WorkoutCard: React.FC<Props> = ({ workout }) => {
  return (
    <Link
      to={`/workout/${workout.id}`}
      className="workout-card-link"
      style={{ textDecoration: 'none' }}
    >
      <div
        className="workout-card"
        style={{
          backgroundImage: `url(${workout.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          cursor: 'pointer',
        }}
      >
        <div className="workout-card-overlay">
          <h3 className="workout-title">{workout.title}</h3>
          <p className="workout-meta">🕒 {workout.duration} min</p>
          <p className="workout-meta">🔥 {workout.calories} kcal</p>
        </div>
      </div>
    </Link>
  );
};

export default WorkoutCard;
