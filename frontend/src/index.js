import React from 'react';
import ReactDOM from 'react-dom';

import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";

import './index.css';

import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import { AlertContextProvider } from './contexts/Alert';

import { AlertNotification } from './components/common';
import { NoMatch, NoMatchRedirect } from './components/routing-helpers';

import {
  App,
  Login,
  Register
} from './pages';

import * as serviceWorker from './serviceWorker';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#003773',
    },
    secondary: {
      main: '#f07532',
      contrastText: '#fff'
    },
    background: {
      default: '#fff',
    },
  },
  typography: {
    fontFamily: "'Josefin Sans', sans-serif",
  },
  spacing: 5
});

export default function AppRouter() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AlertContextProvider>
        <Router>
          <Switch>
            <Route exact path="/">
              <Redirect from="/" to="/home" />
            </Route>
            <Route path="/home">
              <App />
            </Route>
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/register">
              <Register />
            </Route>
            <Route path="/notfound" component={NoMatch} />
            <NoMatchRedirect />
          </Switch>
          <AlertNotification />
        </Router>
      </AlertContextProvider>
    </ThemeProvider>
  );
};

ReactDOM.render(<AppRouter />, document.getElementById('react-app'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();