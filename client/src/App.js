import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { UserContext } from "./UserContext";
import "./App.css";
import Home from './components/home/Home'
import ManageAccount from "./components/manage/MngAccount";
import ManageClub from "./components/manage/MngClub";
import Info from "./components/info/Info";
import Navbar from "./components/layout/Navbar";
import Club from './components/club/Club'


function App() {
  const [user, setUser] = useState(null);
  return (
    <Router>
      <div className="App">
        <UserContext.Provider value={{ user, setUser }}>
          <Navbar/>
          <Switch>
            <Route exact path="/" component={Home}/>
            <Route path="/mng-account" component={ManageAccount}/>
            <Route path="/mng-club" component={ManageClub}/>
            <Route path="/info" component={Info}/>
            <Route path="/club" component={Club}/>

          </Switch>
        </UserContext.Provider>
      </div>
    </Router>
  );
}

export default App;
