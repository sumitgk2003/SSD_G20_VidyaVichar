import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

import Header from '../components/layout/Header';
import QuestionBoard from '../components/board/QuestionBoard';
import QuestionForm from '../components/board/QuestionForm';
import FilterControls from '../components/board/FilterControls';

import { fetchQuestionsByClassCode } from '../app/features/boardSlice';

import './ClassroomPage.css';

const ClassroomPage = () => {
  const dispatch = useDispatch();

  const { classCode } = useParams();

  const { role } = useSelector((state) => state.auth.user);

 
  useEffect(() => {
    if (classCode) {

      dispatch(fetchQuestionsByClassCode(classCode));
    }
  }, [dispatch, classCode]);

  return (
    <div className="classroom-page">
      <Header />
      <main className="classroom-content">
        <div className="classroom-header">
          <h1>Classroom: {classCode}</h1>

          {role === 'instructor' && <FilterControls />}
        </div>

        <QuestionBoard />

        {role === 'student' && <QuestionForm />}
      </main>
    </div>
  );
};

export default ClassroomPage;