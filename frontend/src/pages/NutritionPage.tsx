import React, { useState } from 'react';
import axios from 'axios';
import { FaTrash } from 'react-icons/fa';
import '../styles/fitness.css';

const API_KEY = 'aea952f3e71e41f098768df1d3009c10'; // Spoonacular API key

interface IntakeItem {
  name: string;
  quantity: string;
  calories: number;
  protein: number;
}

const NutritionPage: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [dailyIntake, setDailyIntake] = useState<IntakeItem[]>([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleAddFood = async () => {
    const query = encodeURIComponent(inputText.trim());
    if (!query) return;

    try {
      const res = await axios.get(
        `https://api.spoonacular.com/recipes/guessNutrition?title=${query}&apiKey=${API_KEY}`
      );

      const data = res.data;
      const calories = Number(data.calories?.value) || 0;
      const protein = Number(data.protein?.value) || 0;

      setDailyIntake(prev => [
        ...prev,
        {
          name: inputText,
          quantity: inputText,
          calories,
          protein,
        },
      ]);
      setInputText('');
    } catch (err) {
      console.error('API error:', err);
      alert('Failed to fetch nutrition data.');
    }
  };

  const handleDelete = (index: number) => {
    setDailyIntake(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmitTotal = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to submit.');
      return;
    }
    setShowConfirmModal(true);
  };

  const confirmSubmit = async () => {
    setShowConfirmModal(false);
    const token = localStorage.getItem('token');
    const totalCalories = dailyIntake.reduce((sum, item) => sum + item.calories, 0);
    const totalProtein = dailyIntake.reduce((sum, item) => sum + item.protein, 0);

    try {
      await axios.post(
        'http://localhost:5000/api/nutrition',
        {
          calories: totalCalories,
          protein: totalProtein,
          date: new Date().toISOString(),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert('Nutrition data submitted successfully!');
    } catch (err) {
      console.error('Submit error:', err);
      alert('Failed to submit nutrition data.');
    }
  };

  const totalCalories = dailyIntake.reduce((sum, item) => sum + item.calories, 0).toFixed(1);
  const totalProtein = dailyIntake.reduce((sum, item) => sum + item.protein, 0).toFixed(1);

  return (
    <div className="main-container">
      <h2 className="section-title">🥗 Nutrition Tracker</h2>

      <div className="nutrition-form">
        <input
          type="text"
          className="food-input"
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          placeholder='e.g. "1 cup rice" or "2 eggs"'
        />
        <button className="add-button" onClick={handleAddFood}>ADD</button>
      </div>

      <div className="nutrition-summary">
        <h3>Daily Intake:</h3>
        <ul>
          {dailyIntake.map((item, i) => (
            <li key={i}>
              {item.name} → {item.calories.toFixed(1)} kcal, {item.protein.toFixed(1)} g protein
              <FaTrash
                onClick={() => handleDelete(i)}
                style={{ marginLeft: '10px', cursor: 'pointer', color: 'red' }}
              />
            </li>
          ))}
        </ul>

        <p className="total-line">
          Total Energy: <strong>{totalCalories}</strong> kcal | Total Protein: <strong>{totalProtein}</strong> g
        </p>

        {dailyIntake.length > 0 && (
          <button className="submit-button" onClick={handleSubmitTotal}>
            Submit Total Calories Intake
          </button>
        )}
      </div>

      {showConfirmModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <p>Are you sure you want to upload your daily intake?</p>
            <div className="modal-buttons">
              <button className="confirm-btn" onClick={confirmSubmit}>Yes</button>
              <button className="cancel-btn" onClick={() => setShowConfirmModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NutritionPage;
