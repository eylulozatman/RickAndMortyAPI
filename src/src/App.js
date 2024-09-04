import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from './homepage';


function App() {
  return (
    <Router>
      <div className="App">
    
        <Routes>
          <Route path="/" element={<Homepage />} /> 
        </Routes>
      </div>
    </Router>
  );
}

export default App;
