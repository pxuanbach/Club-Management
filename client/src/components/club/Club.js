import { Switch, Route, useParams } from 'react-router-dom';
import React, { useEffect, useState } from "react";
import Activity from "../leader-club/activity/Activity"
import Calendar from "../leader-club/calendar/Calendar"
import Member from "../leader-club/member/Member"
import Message from "../leader-club/message/Message"
import Fund from "../leader-club/fund/Fund"
import NavbarClub from "../leader-club/Navbar-Club"
import { my_API } from '../../helper/Helper';
import './Club.css'

const Club = () => {
  const { club_id, club_name } = useParams();
  const [club, setClub] = useState();
  useEffect(() => {
    const verifyClub = async () => {
      try {
        const res = await fetch( my_API + `verifyclub/${club_id}`, {
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        });
        const data = await res.json();
        console.log('club', data)
        setClub(data);
      } catch (error) {
        console.log(error)
      }
    }
    verifyClub();
  }, [])
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
            <Message club_id={club_id}/>
          </Route>
          <Route path={`/club/${club_id}/${club_name}/member`}>
            <Member club_id={club_id}/>
          </Route>
          <Route path={`/club/${club_id}/${club_name}/fund`}>
            <Fund club_id={club_id}/>
          </Route>
        </Switch>
      </div>
    </div>
  )
}

export default Club