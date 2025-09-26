import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes.jsx'; // Import the file defining all routes

const App = () => {
  return (
    // All components within BrowserRouter (including AppRoutes and DashboardPage) 
    // will now have access to routing functionalities.
    <BrowserRouter>
      {/* AppRoutes will handle conditional rendering of pages and protection */}
      <AppRoutes /> 
    </BrowserRouter>
  );
};

export default App;