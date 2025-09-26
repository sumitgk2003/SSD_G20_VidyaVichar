import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import QuestionBoard from '../components/board/QuestionBoard.jsx';

// FIX: Correct the import name to match the export in boardSlice.js
import { fetchQuestions } from '../app/features/boardSlice.js'; 
import { resetBoardStatus } from '../app/features/boardSlice.js';

const ClassroomPage = () => {
  const dispatch = useDispatch();
  const { classId } = useParams();

  // Get relevant state from the board slice
  const { status, error, currentClass } = useSelector((state) => state.board);
  const { isAuthenticated } = useSelector((state) => state.auth);

  // 1. Fetch questions on mount and clean up on unmount
  useEffect(() => {
    if (classId && isAuthenticated) {
      // Dispatch the correctly named thunk
      dispatch(fetchQuestions(classId));
    }

    // Cleanup: reset board state when leaving the page
    return () => {
      dispatch(resetBoardStatus());
    };
  }, [dispatch, classId, isAuthenticated]);

  // 2. Handle loading and error states
  if (status === 'loading') {
    return <div className="page-center-message">Connecting to Classroom...</div>;
  }

  if (status === 'failed') {
    return (
      <div className="page-center-message error">
        <h1>Error</h1>
        <p>Failed to load the classroom: {error}</p>
      </div>
    );
  }

  // 3. Render the main Q&A board
  return (
    <div className="classroom-page">
      {/* QuestionBoard handles the actual display of the sticky notes */}
      <QuestionBoard />
    </div>
  );
};

export default ClassroomPage;