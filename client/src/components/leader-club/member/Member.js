import { Switch, Route, useRouteMatch, useParams } from 'react-router-dom';
import React, { useState, useEffect } from "react";
import TabGroup from './TabGroup';
import TabMember from './TabMember';
import NavbarMember from './Navbar-Member';
import "./Member.css"
const Member = () => {
  const { path } = useRouteMatch();
  //const { type } = useParams();
  useEffect(() => {
    console.log(path)
  }, [])
  return (
    <div className='div_member'>
      <div className='navheader'>
        <NavbarMember/>
      </div>
      <div className="div-body-member">
        <Switch >
          <Route path={`${path}/tabmember`}>
            <TabMember />
          </Route>
          <Route path={`${path}/tabgroup`}>
            <TabGroup />
          </Route>
        </Switch>
      </div>
    </div>
  )
}

export default Member