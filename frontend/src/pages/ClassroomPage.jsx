import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import QuestionBoard from '../components/board/QuestionBoard';
import { fetchClassById } from '../app/features/classSlice';
import { fetchQuestions } from '../app/features/boardSlice';
import './ClassroomPage.css';

const ClassroomPage = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { user, isAuthenticated, role } = useSelector((state) => state.auth);
const { currentClass, status: classStatus } = useSelector((state) => state.classes);
const { status: boardStatus } = useSelector((state) => state.board); // Get board status

useEffect(() => {
  if (!isAuthenticated) {
    navigate('/');
    return;
  }
  
  if (classStatus === 'idle' || (classStatus === 'failed' && !currentClass)) {
    dispatch(fetchClassById(classId));
  }
  
  // Only fetch questions if the status is not 'succeeded' or 'loading'
  // NOTE: You must manage the status for fetchQuestions in boardSlice.
  if (boardStatus === 'idle' || boardStatus === 'failed') {
      dispatch(fetchQuestions(classId));
  }
  
}, [classId, isAuthenticated, navigate, dispatch, classStatus, boardStatus]); 

  if (!isAuthenticated) {
    return null;
  }

  if (classStatus === 'loading' || boardStatus === 'loading') {
    return (
      <div className="classroom-loading">
        <Header />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading classroom...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="classroom-page">
      <Header />
      <main className="classroom-main">
        <div className="classroom-header">
          <div className="class-info">
            <h1 className="class-title">
              {currentClass?.title || 'Q&A Board'}
            </h1>
            <p className="class-subject">
              {currentClass?.subject || 'Interactive Learning Session'}
            </p>
            {currentClass?.instructorName && (
              <p className="instructor-info">
                Instructor: {currentClass.instructorName}
              </p>
            )}
          </div>
          
          <div className="user-info">
            <span className="user-role">
              {role === 'instructor' ? '👨‍🏫' : '🎓'} {role}
            </span>
            <span className="user-name">{user?.name}</span>
          </div>
        </div>

        <QuestionBoard classId={classId} />
      </main>
    </div>
  );
};

export default ClassroomPage;