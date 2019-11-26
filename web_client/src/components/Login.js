import React from 'react';
import { withRouter } from 'react-router-dom';
import { Form, Button, Alert } from 'react-bootstrap';
import './styles/forms.css';
import { Parse } from 'parse';
import store from '../redux/store';
import { setMeAction } from '../redux/actions';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      errorMessage: null,
    };
  }

  async componentDidMount() {
    // If the user clicked a link to the login page but they are already logged in, redirect them to home
    const user = await Parse.User.currentAsync();
    if (user != null) {
      store.dispatch(setMeAction(user));
      this.props.history.push('/');
    }
  }

  async onSubmit(ev) {
    const { email, password } = this.state;
    ev.preventDefault();
    try {
      const user = await Parse.User.logIn(email, password);
      store.dispatch(setMeAction(user));
      this.props.history.push('/');
    } catch (error) {
      this.setState({ errorMessage: error.message });
    }
  }

  render() {
    const { email, password, errorMessage } = this.state;
    return (
      <div className="formContainer">
        <div style={{ height: 35 }} />
        <h3>Sign in to get started</h3>
        <div style={{ height: 35 }} />
        <Form className="form" onSubmit={(ev) => this.onSubmit(ev)}>
          <div style={errorMessage == null ? { visibility: 'hidden' } : undefined}>
            <Alert variant="danger">{errorMessage}</Alert>
          </div>
          <Form.Label>Email Address</Form.Label>
          <Form.Control type="email" value={email} onChange={(e) => this.setState({ email: e.target.value })} />
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" value={password} onChange={(e) => this.setState({ password: e.target.value })} />
          <Button variant="primary" type="submit">
          Sign In
          </Button>
        </Form>
      </div>
    );
  }
}

export default withRouter(Login);
