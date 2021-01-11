import React from 'react';
import './App.css';
import WeeklyView from './containers/weekly.view';
import Report from './containers/report';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import { Nav, NavItem, NavLink } from 'react-bootstrap'


function App() {
  return (
    <Router>
      <div>
        <Nav defaultActiveKey='/edit'>
          <NavItem>
            <NavLink href='/edit' eventKey='report-2'>Edit/Create</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href='/report' eventKey='report-1'>Report</NavLink>
          </NavItem>
        </Nav>
      </div>

      <Switch>
        <Route path='/edit'>
          <WeeklyView />
        </Route>

        <Route path='/report'>
          <Report />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
