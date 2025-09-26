import { useDispatch, useSelector } from 'react-redux';
import InputField from '../common/InputField.jsx';
import Button from '../common/Button.jsx';

import { joinClass } from '../../app/features/classesSlice.js'; 

const JoinClassModal = ({ onClose }) => {
  const [accessCode, setAccessCode] = useState('');
  const [error, setError] = useState('');
  
  const dispatch = useDispatch();
  const { status } = useSelector((state) => state.classes);
  
  const isLoading = status === 'loading'; 

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!accessCode.trim()) {
      setError('Access code cannot be empty.');
      return;
    }

    dispatch(joinClass(accessCode.trim()))
      .unwrap()
      .then(() => {
        onClose();
      })
      .catch((err) => {
        setError(err.message || 'Failed to join class. Please check the code.');
      });
  };

  return (
    <div className="join-class-modal">
      <h2>Join Class</h2>
      <p>Enter the access code provided by your instructor.</p>
      
      <form onSubmit={handleSubmit}>
        <InputField
          label="Access Code"
          type="text"
          placeholder="e.g., K9J-L4Y"
          value={accessCode}
          onChange={(e) => setAccessCode(e.target.value)}
          required
        />
        
        {error && <p className="form-error-message">{error}</p>}
        
        <div className="modal-actions">
          <Button 
            type="submit" 
            variant="primary" 
            disabled={isLoading}
          >
            {isLoading ? 'Joining...' : 'Join Class'}
          </Button>
          <Button 
            type="button" 
            variant="secondary" 
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default JoinClassModal;