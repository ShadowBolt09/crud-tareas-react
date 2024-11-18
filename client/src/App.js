import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import routes from './routes/routes';
import Login from './components/Login';
import Register from './components/Register';
import Tareas from './components/Tareas';

function App() {
  return (
    <Router>
      <Routes>
        
        <Route path={routes.login} element={<Login />} />
        
        <Route path={routes.register} element={<Register />} />
        
        <Route path={routes.tareas} element={<Tareas />} />

        <Route path="*" element={<Navigate to={routes.login} />} />
      </Routes>
    </Router>
  );
}

export default App;
