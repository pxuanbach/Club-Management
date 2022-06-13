import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { UserContext } from "./UserContext";
import "./App.css";
import Home from './components/home/Home'
import ManageAccount from "./components/manage/MngAccount";
import ManageClub from "./components/manage/MngClub";
import Info from "./components/info/Info";
import Navbar from "./components/layout/Navbar";
import Club from './components/club/Club';
import Login from './components/auth/Login'
import PersonMessage from "./components/person-message/PersonMessage";
import SchedulerActivity from "./components/scheduler/SchedulerActivity";
import ActivityDetail from './components/scheduler/ActivityDetail';
import NotFound from './components/not-found/NotFound';
import axiosInstance from "./helper/Axios";


function App() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const verifyUser = async () => {
      try {
        const res = await axiosInstance.get('/verifyuser', { withCredentials: true });
        const data = res.data;
        //console.log(data)
        setUser(data);
      } catch (error) {
        console.log(error)
      }
    }
    verifyUser();
  }, [])

  return (
    <Router>
      <div className="App">
        <UserContext.Provider value={{ user, setUser }}>
          <Navbar/>
          <Switch>
            <Route exact path="/">
              <Redirect to="/scheduler"/>
            </Route>
            <Route exact path="/scheduler" component={SchedulerActivity}/>
            <Route path="/scheduler/activity/:activityId" component={ActivityDetail}/>
            <Route path="/clubs" component={Home}/>
            <Route path="/mng-account" component={ManageAccount}/>
            <Route path="/mng-club" component={ManageClub}/>
            <Route path="/message" component={PersonMessage}/>
            <Route path="/info" component={Info}/>
            <Route path="/club/:club_id/:club_name" component={Club}/>
            <Route path='/login' component={Login}/>
            <Route path='*' component={NotFound}/>
          </Switch>
        </UserContext.Provider>
      </div>
    </Router>
  );
}

export default App;
