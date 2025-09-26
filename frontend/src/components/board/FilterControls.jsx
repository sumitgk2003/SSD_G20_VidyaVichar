import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Button from '../common/Button.jsx';

// Assume the action to set the filter is defined in boardSlice
import { setFilter } from '../../app/features/boardSlice.js'; 

const FilterControls = () => {
  const dispatch = useDispatch();
  // Get the current filter state from the board slice
  const currentFilter = useSelector((state) => state.board.filter);

  // Define the available filters
  const filters = [
    { label: 'All Questions', value: 'all' },
    { label: 'Unanswered', value: 'unanswered' },
    { label: 'Answered', value: 'answered' },
    { label: 'Important', value: 'important' },
  ];

  const handleFilterChange = (filterValue) => {
    dispatch(setFilter(filterValue));
  };

  return (
    <div className="filter-controls">
      <h4 className="controls-title">Filter Questions:</h4>
      <div className="filter-buttons">
        {filters.map((filter) => (
          <Button
            key={filter.value}
            onClick={() => handleFilterChange(filter.value)}
            // Use a different variant (e.g., 'primary') if the filter is active
            variant={currentFilter === filter.value ? 'primary' : 'secondary'}
            size="small"
          >
            {filter.label}
          </Button>
        ))}
      </div>

      {/* Placeholder for an instructor action, like "Clear Board" */}
      <Button 
        variant="danger-outline" 
        size="small"
        // onClick={() => dispatch(clearBoard())} // Assumes a 'clearBoard' thunk exists
        disabled // Disabled until implemented
      >
        Clear Board
      </Button>
    </div>
  );
};

export default FilterControls;