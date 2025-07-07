// src/components/DifficultySelector.tsx
import React from 'react';

interface Props {
  selected: 'beginner' | 'intermediate' | 'pro';
  onSelect: (level: 'beginner' | 'intermediate' | 'pro') => void;
}

const DifficultySelector: React.FC<Props> = ({ selected, onSelect }) => {
  const levels: Array<'beginner' | 'intermediate' | 'pro'> = ['beginner', 'intermediate', 'pro'];

  return (
    <div className="difficulty-selector">
      {levels.map(level => (
        <div
          key={level}
          className={`difficulty-box ${selected === level ? 'active' : ''}`}
          onClick={() => onSelect(level)}
        >
          {level.charAt(0).toUpperCase() + level.slice(1)}
        </div>
      ))}
    </div>
  );
};

export default DifficultySelector;
