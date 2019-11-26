import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from 'react-router-dom';
import {
  Navbar,
  Nav,
  NavDropdown,
} from 'react-bootstrap';
import { connect } from 'react-redux';
import { Parse } from 'parse';

import Main from './Main';
import About from './About';
import Account from './Account';
import Wallet from './Wallet';
import Login from './Login';
import Register from './Register';
import VerifyEmail from './VerifyEmail';
import store from '../redux/store';
import { setMeAction } from '../redux/actions';

async function logOut() {
  await Parse.User.logOut();
  store.dispatch(setMeAction(null));
}

/* eslint-disable react/prefer-stateless-function */
class Navigation extends React.Component {
  render() {
    const { me } = this.props;
    const title = me == null ? 'Login' : me.getUsername();
    return (
      <Router>
        <Navbar bg="dark" variant="dark">
          <Navbar.Brand href="/">App</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Link to="/about" className="nav-link">About</Link>
            </Nav>
            <Nav>
              <NavDropdown title={title} id="collasible-nav-dropdown" drop="left">
                {me == null && (
                  <>
                    <NavDropdown.Item as={Link} to="/login">Login</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/register">Register</NavDropdown.Item>
                  </>
                )}
                {me != null && (
                  <>
                    {me.get('emailVerified')
                      ? (
                        <>
                          <NavDropdown.Item as={Link} to="/account">Account Settings</NavDropdown.Item>
                          <NavDropdown.Item as={Link} to="/wallet">Wallet</NavDropdown.Item>
                        </>
                      )
                      : (
                        <>
                          <NavDropdown.Item as={Link} to="/verifyEmail">Verify Account</NavDropdown.Item>
                        </>
                      )}
                    <NavDropdown.Divider />
                    <NavDropdown.Item onClick={logOut}>Log Out</NavDropdown.Item>
                  </>
                )}
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <Switch>
          <Route exact path="/">
            <Main />
          </Route>
          <Route path="/about">
            <About />
          </Route>
          <Route path="/account">
            <Account />
          </Route>
          <Route path="/wallet">
            <Wallet />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/register">
            <Register />
          </Route>
          <Route path="/verifyEmail">
            <VerifyEmail />
          </Route>
        </Switch>
      </Router>
    );
  }
}

const mapStateToProps = (state) => ({
  me: state.auth.me,
});

export default connect(mapStateToProps)(Navigation);
