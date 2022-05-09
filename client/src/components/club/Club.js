import { Switch, Route, useParams } from 'react-router-dom';
import React, { useEffect, useState } from "react";
import { UserContext } from "../../UserContext";
import Activity from "../leader-club/activity/Activity"
import Calendar from "../leader-club/calendar/Calendar"
import Member from "../leader-club/member/Member"
import Message from "../leader-club/message/Message"
import Fund from "../leader-club/fund/Fund"
import NavbarClub from "../leader-club/Navbar-Club"
import './Club.css'

let socket;

const Club = () => {
  const { club_id, club_name } = useParams();

  return (
    <div className='club'>
      <div className='div-left-club'>
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
          <Route path={`/club/${club_id}/${club_name}/message`}>
            <Message />
          </Route>
          <Route path={`/club/${club_id}/${club_name}/member`}>
            <Member />
          </Route>
          <Route path={`/club/${club_id}/${club_name}/fund`}>
            <Fund />
          </Route>
        </Switch>
      </div>
    </div>
  )
}

export default Club