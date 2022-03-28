import { Switch, Route, useParams } from 'react-router-dom';
import React, { useState, useEffect } from "react";
import { UserContext } from "../../UserContext";
import Activity from "../leader-club/Activity"
import Calendartab from "../leader-club/calendar/Calendar"
import Member from "../leader-club/Member"
import Message from "../leader-club/Message"
import Fund from "../leader-club/Fund"
import NavbarClub from "../leader-club/Navbar-Club"
import './Club.css'
const Club = () => {
  const { club_id } = useParams();

  useEffect(() => {
    console.log(club_id)
  }, [])

  return (
    <div className='club'>
      <div >
      <NavbarClub/>
      </div>
      <div className="div-right-club">
        <Switch >
          <Route path={`/club/${club_id}/activity`}>
            <Activity />
          </Route>
          <Route path={`/club/${club_id}/calendar`}>
            <Calendar />
          </Route>
        </Switch>
      </div>
    </div>
  )
}

export default Club