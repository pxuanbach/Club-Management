import React from 'react'
import { Switch, Route } from 'react-router-dom'
import FormActivity from './FormActivity'
import TabContent from './tabcontent/TabContent'

const Activity = ({ match }) => {
    return (
        <Switch>
            <Route path={`${match}/:activity_name`}>
                <FormActivity match={match} />
            </Route>
            <Route path={match}>
                <TabContent match={match}/>
            </Route>
        </Switch>

    )
}

export default Activity