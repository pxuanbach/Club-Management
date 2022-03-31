import { Switch, Route, useRouteMatch, useParams } from 'react-router-dom';
import React, { useState, useEffect } from "react";
import { UserContext } from "../../UserContext";
import Activity from "../leader-club/activity/Activity"
import Calendartab from "../leader-club/calendar/Calendar"
import Member from "../leader-club/member/Member"
import Message from "../leader-club/Message"
import Fund from "../leader-club/Fund"
import NavbarClub from "../leader-club/Navbar-Club"
import './Club.css'
const Club = () => {
  const { path } = useRouteMatch();
  //const { type } = useParams();
  useEffect(() => {
    console.log(path)
  }, [])

  return (
    <div className='club'>
      <div >
      <NavbarClub/>
      </div>
      <div className="div-right-club">
        <Switch >
          <Route path={`${path}/activity`}>
            <Activity />
          </Route>
          <Route path={`${path}/calendar`}>
            <Calendartab />
          </Route>
          <Route path={`${path}/message`}>
            <Message />
          </Route>
          <Route path={`${path}/member`}>
            <Member />
          </Route>
        </Switch>
      </div>
    </div>
  )
}

export default Club