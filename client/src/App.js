import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { UserContext } from "./UserContext";
import "./App.css";
import Home from './components/home/home'
import Manage from "./components/manage/manage";

function App() {
  const [user, setUser] = useState(null);
  return (
    <Router>
      <div className="App">
        <UserContext.Provider value={{ user, setUser }}>
          <Switch>
            <Route exact path="/" component={Home}/>
            <Route path="/manage" component={Manage}/>
          </Switch>
        </UserContext.Provider>
      </div>
    </Router>
  );
}

export default App;
