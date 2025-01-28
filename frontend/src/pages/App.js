import React from 'react';

import {
  Route,
  Switch,
  Redirect,
  useRouteMatch
} from "react-router-dom";

import { makeStyles } from '@material-ui/core/styles';

import { NoMatchRedirect, PrivateRoute } from '../components/routing-helpers';
import Sidebar from '../components/sidebar';

import Welcome from './Welcome';
import AllPosts from './AllPosts';
import FollowingPosts from './FollowingPosts';
import Profile from './Profile';

const useAppStyles = makeStyles({
  root: {
    flexGrow: 1,
    display: 'flex',
  },
  tabpanel: {
    width: "100%",
    padding: 15,
    marginLeft: 240
  }
});

export default function App() {
  const classes = useAppStyles();
  const { path } = useRouteMatch();

  return (
    <div className={classes.root}>
      <Sidebar />
      <div className={classes.tabpanel}>
        <Switch>
          <Route exact path={`${path}`}>
            <Welcome />
          </Route>
          <Route exact path={`${path}/all-posts`}>
            <AllPosts />
          </Route>
          <PrivateRoute exact path={`${path}/following-posts`}>
            <FollowingPosts />
          </PrivateRoute>
          <Route sensitive path={`${path}/profile/:username`}>
            <Profile />
          </Route>
          <Route exact path={`${path}/profile`}>
            <Redirect to={`${path}`} />
          </Route>
          <NoMatchRedirect />
        </Switch>
      </div>
    </div>
  );
};