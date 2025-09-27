import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { questionService } from '../services/questionService';
import { classService } from '../services/classService';
import QuestionForm from '../components/QuestionForm';
import QuestionBoard from '../components/QuestionBoard';
import FilterControls from '../components/FilterControls';
import { io } from 'socket.io-client'; // ⬅️ IMPORT SOCKET.IO CLIENT

const ClassroomPage = () => {
  const { classId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [classData, setClassData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const isTeacher = user.role === 'teacher';
  // Assuming access logic is handled elsewhere, we use a simple check for socket connection
  const hasAccess = true; 

  // Wrap loadQuestions in useCallback for use in useEffect dependencies
  const loadQuestions = useCallback(async (showSpinner = true) => {
    if (showSpinner) {
      setLoading(true);
    }
    setError('');
    
    try {
      const result = isTeacher
        ? await questionService.getAllQuestionsForClass(classId)
        : await questionService.getQuestionsByClassId(classId);

      if (result.success) {
        setQuestions(result.data);
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('Failed to load questions');
    } finally {
      if (showSpinner) {
        setLoading(false);
      }
    }
  }, [classId, isTeacher]);


  // 1. INITIAL LOAD EFFECT
  useEffect(() => {
    loadClassData();
    loadQuestions();
  }, [classId, loadQuestions]);


  // 2. SOCKET.IO REAL-TIME EFFECT (REPLACES SETTIMEOUT/POLLING)
  useEffect(() => {
    // Only connect if the user is in a class context and has access
    if (!classId || !hasAccess) return;

    // Connect to the server where Socket.IO is running
    const socket = io('http://localhost:8000'); // Use your actual backend port

    // Join the room specific to this class
    socket.emit('joinClassroom', classId); 

    // Listen for the update event from the server
    socket.on('queryUpdate', (data) => {
      console.log(`Real-time update received for class: ${data.classId}. Reloading...`);
      // When any update occurs (post, answer, importance), silently re-fetch all queries
      loadQuestions(false); 
    });

    // Cleanup on component unmount
    return () => {
      socket.off('queryUpdate');
      socket.disconnect();
    };
  }, [classId, hasAccess, loadQuestions]);


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

  const handleCreateQuestion = async (questionData) => {
    const result = await questionService.createQuestion({
      ...questionData,
      author: user.name,
      classId: classId
    });
    
    if (result.success) {
      // For creation, we update local state for immediate feedback.
      // The socket event from the backend will trigger loadQuestions(false) 
      // to fully sync the list, including the question's populated fields.
      setQuestions([...questions, result.data]); 
      return { success: true, message: result.message };
    } else {
      return { success: false, message: result.message };
    }
  };

  const handleUpdateQuestion = async (questionId, updates) => {
    const result = await questionService.updateQuestion(questionId, updates);
    
    if (result.success) {
      // 1. Update state locally for immediate feedback 
      setQuestions(questions.map(q => 
        q.id === questionId ? { ...q, ...result.data } : q
      ));
      
      // 2. REMOVED: setTimeout(loadQuestions, 1000); ⬅️ Socket.IO handles the re-fetch.
      
      return { success: true, message: result.message };
    } else {
      // If the API failed, display the error
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