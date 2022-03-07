import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { UserContext } from './UserContext';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  return (
    <div className="App">
      Hello World
    </div>
  );
}

export default App;
