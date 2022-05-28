import { Switch, Route, useParams, Redirect } from 'react-router-dom';
import React, { useEffect, useState, useContext } from "react";
import Activity from '../leader-club/activity/Activity';
import Calendar from "../leader-club/calendar/Calendar"
import Member from "../leader-club/member/Member"
import Message from "../leader-club/message/Message"
import Fund from "../leader-club/fund/Fund"
import NavbarClub from "../leader-club/Navbar-Club"
import axiosInstance from '../../helper/Axios';
import { UserContext } from '../../UserContext';
import './Club.css'

const Club = () => {
  const { user, setUser } = useContext(UserContext);
  const { club_id, club_name } = useParams();
  const [club, setClub] = useState();

  useEffect(() => {
    const verifyClub = async () => {
      try {
        const res = await axiosInstance.get(`/verifyclub/${club_id}`, { withCredentials: true });
        const data = res.data;
        //console.log('club', data)
        setClub(data);
      } catch (error) {
        console.log(error)
      }
    }
    verifyClub();
  }, []);

  return (
    <div className='club'>
      <div className='div-left-club'>
        <NavbarClub club={club}/>
      </div>
      <div className="div-right-club">
        <Switch>
          <Route path={`/club/${club_id}/${club_name}/activity`}>
            <Activity match={`/club/${club_id}/${club_name}/activity`} club_id={club_id}/>
          </Route>
          <Route path={`/club/${club_id}/${club_name}/calendar`}>
            <Calendar />
          </Route>
          <Route path={`/club/${club_id}/${club_name}/message`}>
            <Message club_id={club_id}/>
          </Route>
          <Route path={`/club/${club_id}/${club_name}/member`}>
            <Member club={club}/>
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