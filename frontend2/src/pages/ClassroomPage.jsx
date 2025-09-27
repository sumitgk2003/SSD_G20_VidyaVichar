import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { questionService } from '../services/questionService';
import { classService } from '../services/classService';
import QuestionForm from '../components/QuestionForm';
import QuestionBoard from '../components/QuestionBoard';
import FilterControls from '../components/FilterControls';

const ClassroomPage = () => {
  const { classId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [classData, setClassData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadClassData();
    loadQuestions();
  }, [classId]);

  const loadClassData = async () => {
    try {
      const result = await classService.getClassById(classId);
      if (result.success) {
        setClassData(result.data);
      }
    } catch (error) {
      console.error('Failed to load class data:', error);
    }
  };

  const loadQuestions = async () => {
    setLoading(true);
    setError('');
    
    try {
      const result = user.role === 'teacher'
        ? await questionService.getAllQuestionsForClass(classId) // Teacher sees ALL questions
        : await questionService.getQuestionsByClassId(classId);  // Student sees THEIR questions

      if (result.success) {
        setQuestions(result.data);
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('Failed to load questions');
    } finally {
      setLoading(false);
    }
  };
  const handleCreateQuestion = async (questionData) => {
    const result = await questionService.createQuestion({
      ...questionData,
      author: user.name,
      classId: classId
    });
    
    if (result.success) {
      setQuestions([...questions, result.data]);
      return { success: true, message: result.message };
    } else {
      return { success: false, message: result.message };
    }
  };

  const handleUpdateQuestion = async (questionId, updates) => {
    const result = await questionService.updateQuestion(questionId, updates);
    
    if (result.success) {
      setQuestions(questions.map(q => 
        q.id === questionId ? { ...q, ...updates } : q
      ));
      return { success: true, message: result.message };
    } else {
      return { success: false, message: result.message };
    }
  };

  const handleClearQuestions = async () => {
    const result = await questionService.clearQuestions(classId);
    
    if (result.success) {
      setQuestions([]);
      return { success: true, message: result.message };
    } else {
      return { success: false, message: result.message };
    }
  };

  const filteredQuestions = questions.filter(question => {
    switch (filter) {
      case 'unanswered':
        return question.status === 'Unanswered';
      case 'answered':
        return question.status === 'Answered';
      case 'important':
        return question.isImportant;
      default:
        return true;
    }
  });

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading Classroom...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h1 style={{ marginBottom: '5px', color: '#333' }}>
              {classData?.title || 'Classroom'}
            </h1>
            <p style={{ color: '#666' }}>
              {user.role === 'teacher' ? 'Manage questions from your students' : 'Ask questions and interact with your class'}
            </p>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="btn btn-secondary"
          >
            ← Back to Dashboard
          </button>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {user.role === 'teacher' && (
          <FilterControls
            filter={filter}
            onFilterChange={setFilter}
            questions={questions}
            onClearQuestions={handleClearQuestions}
          />
        )}

        {user.role === 'student' && (
          <QuestionForm
            onSubmit={handleCreateQuestion}
          />
        )}

        <QuestionBoard
          questions={filteredQuestions}
          userRole={user.role}
          onUpdateQuestion={handleUpdateQuestion}
        />
      </div>
    </div>
  );
};

export default ClassroomPage;
