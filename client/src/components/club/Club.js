import { Switch, Route, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Box, CircularProgress } from "@mui/material";
import Activity from "../leader-club/activity/Activity";
import Calendar from "../leader-club/calendar/Calendar";
import Member from "../leader-club/member/Member";
import Message from "../leader-club/message/Message";
import Fund from "../leader-club/fund/Fund";
import Notification from "../leader-club/invite/Notification";
import NavbarClub from "../leader-club/Navbar-Club";
import axiosInstance from "../../helper/Axios";
import "./Club.css";

const Club = () => {
  const { club_id, club_name } = useParams();
  const [club, setClub] = useState();

  useEffect(() => {
    const verifyClub = async () => {
      try {
        const res = await axiosInstance.get(`/verifyclub/${club_id}`, {
          withCredentials: true,
        });
        const data = res.data;
        //console.log('club', data)
        setClub(data);
      } catch (error) {
        console.log(error);
      }
    };
    verifyClub();
  }, []);

  return (
    <div>
      {club ? (
        <div className="club">
          <div className="div-left-club">
            <NavbarClub club={club} />
          </div>
          <div className="div-right-club">
            <Switch>
              <Route path={`/club/${club_id}/${club_name}/activity`}>
                <Activity
                  match={`/club/${club_id}/${club_name}/activity`}
                  club_id={club_id}
                />
              </Route>
              <Route path={`/club/${club_id}/${club_name}/calendar`}>
                <Calendar club_id={club_id} />
              </Route>
              <Route path={`/club/${club_id}/${club_name}/message`}>
                <Message club_id={club_id} />
              </Route>
              <Route path={`/club/${club_id}/${club_name}/member`}>
                <Member club={club} />
              </Route>
              <Route path={`/club/${club_id}/${club_name}/fund`}>
                <Fund club_id={club_id} />
              </Route>
              <Route path={`/club/${club_id}/${club_name}/invite`}>
                <Notification club={club} />
              </Route>
            </Switch>
          </div>
        </div>
      ) : (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
          }}
        >
          <CircularProgress />
        </Box>
      )}
    </div>
  );
};

export default Club;
