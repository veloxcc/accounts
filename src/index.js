require('dotenv').config();

import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import ReactGA from 'react-ga';
import {
  BrowserRouter as Router,
  Switch,
  Redirect,
  Route,
} from 'react-router-dom';
import firebase from './utils/firebase';

import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import LoginPage from './pages/LoginPage';

import 'milligram';
import './firebase-ui.css';
import './styles.css';

const googleTrackingId = process.env.GOOGLE_TRACKING_ID || '';

ReactGA.initialize(googleTrackingId);

const logoutUser = () => firebase.auth().signOut();

const App = props => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(function(user) {
      const userData = user ? { email: user.email, displayName: user.displayName } : null;
      setUser(userData);
      setLoading(false);
    });
  }, []);

  return (
    <Router basename={process.env.APP_ROUTER_BASENAME || null}>
      <div className="container">
        <header>
          <div className="row">
            <div className="column">
              <div className="header-overlay">
                <a href="/">velox.cc</a> / accounts
              </div>
            </div>
          </div>
        </header>
        <div className="row">
          <div className="column">
            <div className="page-contents">
              <Switch>
                <Route path="/terms">
                  <TermsPage />
                </Route>
                <Route path="/privacy">
                  <PrivacyPage />
                </Route>
                <Route
                  path="/login"
                  render={({ location }) => {
                    if (loading) return null;
                    return !user ?
                      <LoginPage redirectUrl="/" /> : 
                      <Redirect
                        to={{
                          pathname: '/',
                          state: { from: location },
                        }}
                      />
                  }}
                />
                <Route
                  path="/"
                  render={({ location }) => {
                    if (loading) return null;
                    return user ?
                      (
                        <div>
                          <p>You are signed in as: {user.email}</p>
                          <button onClick={logoutUser}>Logout</button>
                        </div>
                      ) : 
                      <Redirect
                        to={{
                          pathname: '/login',
                          state: { from: location },
                        }}
                      />
                  }}
                />
              </Switch>
            </div>
          </div>
        </div>
      </div>
    </Router>
  );
}

const mountNode = document.getElementById('app');
ReactDOM.render(<App />, mountNode);
