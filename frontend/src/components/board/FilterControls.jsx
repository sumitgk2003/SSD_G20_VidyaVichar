import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Button from '../common/Button';
import { setFilter, clearQuestions } from '../../app/features/boardSlice';
import './FilterControls.css';

const FilterControls = () => {
  const dispatch = useDispatch();
  const { filter, questions } = useSelector((state) => state.board);

  const filters = [
    { value: 'all', label: 'All Questions', count: questions.length },
    { value: 'unanswered', label: 'Unanswered', count: questions.filter(q => q.status === 'open').length },
    { value: 'answered', label: 'Answered', count: questions.filter(q => q.status === 'answered').length },
    { value: 'important', label: 'Important', count: questions.filter(q => q.isImportant).length },
  ];

  const handleFilterChange = (filterValue) => {
    dispatch(setFilter(filterValue));
  };

  const handleClearBoard = () => {
    if (window.confirm('Are you sure you want to clear all questions? This action cannot be undone.')) {
      dispatch(clearQuestions());
    }
  };

  return (
    <div className="filter-controls">
      <div className="filter-section">
        <h3>Filter Questions</h3>
        <div className="filter-buttons">
          {filters.map((filterOption) => (
            <Button
              key={filterOption.value}
              onClick={() => handleFilterChange(filterOption.value)}
              variant={filter === filterOption.value ? 'primary' : 'outline'}
              size="small"
              className="filter-btn"
            >
              {filterOption.label}
              <span className="filter-count">({filterOption.count})</span>
            </Button>
          ))}
        </div>
      </div>
      
      <div className="actions-section">
        <Button
          onClick={handleClearBoard}
          variant="danger"
          size="small"
          className="clear-btn"
        >
          🗑️ Clear Board
        </Button>
      </div>
    </div>
  );
};

export default FilterControls;