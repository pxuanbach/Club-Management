import { Switch, Route, useParams } from 'react-router-dom';
import React, { useEffect, useState } from "react";
import { UserContext } from "../../UserContext";
import Activity from "../leader-club/Activity"
import Calendar from "../leader-club/calendar/Calendar"
import Member from "../leader-club/Member"
import Message from "../leader-club/Message"
import Fund from "../leader-club/Fund"
import NavbarClub from "../leader-club/Navbar-Club"
import './Club.css'

let socket;

const Club = () => {
  const { club_id, club_name } = useParams();

  return (
    <div className='club'>
      <div >
      <NavbarClub/>
      </div>
      <div className="div-right-club">
        <Switch >
          <Route path={`/club/${club_id}/${club_name}/activity`}>
            <Activity />
          </Route>
          <Route path={`/club/${club_id}/${club_name}/calendar`}>
            <Calendar />
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