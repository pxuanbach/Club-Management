import React from 'react'
import { Switch, Route } from 'react-router-dom'
import FormActivity from './FormActivity'
import TabContent from './tabcontent/TabContent'

const Activity = ({ match, club_id }) => {
    return (
        <Switch>
            <Route path={`${match}/:activityId`}>
                <FormActivity match={match} />
            </Route>
            <Route path={match}>
                <TabContent match={match} club_id={club_id}/>
            </Route>
        </Switch>

    )
}

export default Activity