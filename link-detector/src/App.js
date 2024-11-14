import React from 'react';
import './App.css';
import MaliciousDetector from './MaliciousDetector';

function App() {
  return (
    <div className="App bg-gray-100 min-h-screen flex items-center justify-center">
      <header className="App-header w-full">
        <MaliciousDetector />
      </header>
    </div>
  );
}

export default App;
