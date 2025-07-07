import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/workout.css';

interface RoutineInput {
  name: string;
  sets: number;
  reps: number;
  rest: number;
  calorieRatio: number;
}

const CreateWorkoutPage = () => {
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState('');
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'pro'>('beginner');
  const [routines, setRoutines] = useState<RoutineInput[]>([
    { name: '', sets: 1, reps: 1, rest: 30, calorieRatio: 0 },
  ]);
  const navigate = useNavigate();

  const handleAddRoutine = () => {
    setRoutines([...routines, { name: '', sets: 1, reps: 1, rest: 30, calorieRatio: 0 }]);
  };

  const handleRoutineChange = (
    index: number,
    field: keyof RoutineInput,
    value: string | number
  ) => {
    const updated = [...routines];
    if (field === 'name') {
      updated[index][field] = value as string;
    } else {
      updated[index][field] = Number(value) as number;
    }
    setRoutines(updated);
  };
const handleSubmit = async () => {
  const totalCalories = routines.reduce((sum, r) => sum + r.calorieRatio, 0);

  try {
    await axios.post('http://localhost:5000/api/workouts/custom', {
      title,
      type: 'Custom',
      duration: Number(duration),
      difficulty,
      image: '/images/workouts/personalworkout.jpg',
      totalCalories, // ✅ SEND this
      routines,
    });
    navigate('/workout');
  } catch (err) {
    console.error('Error creating workout:', err);
  }
};


  return (
    <div className="workout-page">
      <h2 className="workout-title">📝 Create Your Workout</h2>

      <div className="workout-details-content">
        <div className="form-group">
          <label>Workout Title</label>
          <input
            className="form-input"
            placeholder="e.g. Fat Burner Blast"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <label>Duration (in minutes)</label>
          <input
            className="form-input"
            type="number"
            min="0"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />

          <label>Difficulty</label>
          <select
            className="form-input"
            value={difficulty}
            onChange={(e) =>
              setDifficulty(e.target.value as 'beginner' | 'intermediate' | 'pro')
            }
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="pro">Pro</option>
          </select>
        </div>

        <h3 style={{ textAlign: 'center', marginTop: '30px' }}>🦾 Define Exercises:</h3>

        {routines.map((routine, index) => (
          <div key={index} className="routine-input-group">
            <div className="routine-field">
              <label>Exercise Name</label>
              <input
                className="form-input"
                placeholder="e.g. Push-ups"
                value={routine.name}
                onChange={(e) => handleRoutineChange(index, 'name', e.target.value)}
              />
            </div>

            <div className="routine-field">
              <label>Sets</label>
              <input
                className="form-input"
                type="number"
                min="1"
                value={routine.sets}
                onChange={(e) => handleRoutineChange(index, 'sets', e.target.value)}
              />
            </div>

            <div className="routine-field">
              <label>Reps</label>
              <input
                className="form-input"
                type="number"
                min="1"
                value={routine.reps}
                onChange={(e) => handleRoutineChange(index, 'reps', e.target.value)}
              />
            </div>

            <div className="routine-field">
              <label>Rest (sec)</label>
              <input
                className="form-input"
                type="number"
                min="0"
                value={routine.rest}
                onChange={(e) => handleRoutineChange(index, 'rest', e.target.value)}
              />
            </div>

            <div className="routine-field">
              <label>Calorie Ratio</label>
              <input
                className="form-input"
                type="number"
                step="0.01"
                min="0"
                max="1"
                value={routine.calorieRatio}
                onChange={(e) => handleRoutineChange(index, 'calorieRatio', e.target.value)}
              />
            </div>
          </div>
        ))}


        <div style={{ textAlign: 'center' }}>
          <button onClick={handleAddRoutine} className="create-workout-btn">➕ Add Exercise</button>
        </div>

        <div className="button-wrapper">
          <button className="create-workout-btn" onClick={handleSubmit}>
            ✅ Save Workout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateWorkoutPage;
