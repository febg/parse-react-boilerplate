import React from 'react';
import { Parse } from 'parse';
import { withRouter } from 'react-router-dom';
import { Button, Spinner, Alert } from 'react-bootstrap';
import * as dotProp from 'dot-prop';
import { resendEmailVerification } from '../parse/auth';

class VerifyEmail extends React.Component {
  constructor(props) {
    super(props);

    let alert = null;
    if (dotProp.get(props, 'location.state.emailSent')) {
      alert = <Alert variant="success">Email verification sent. Check your email to confirm your account.</Alert>;
    }
    this.state = { isLoading: false, alert };

    this.resendVerificationEmail = this.resendVerificationEmail.bind(this);
  }

  async resendVerificationEmail() {
    this.setState({ isLoading: true });
    const user = await Parse.User.currentAsync();

    const { apiError } = await resendEmailVerification();
    this.setState({ isLoading: false });
    if (apiError != null) {
      this.setState({
        alert: <Alert variant="danger">{apiError.message}</Alert>,
      });
      return;
    }

    this.setState({
      alert:
  <Alert variant="success">
Email verification sent. Check
    {' '}
    {user.getEmail()}
    {' '}
to confirm your account.
  </Alert>,
    });
  }

  render() {
    const { isLoading, alert } = this.state;
    return (
      <div>
        <h2>
          We sent you a link to verify your account
        </h2>
        {isLoading && <Spinner animation="grow" />}
        <Button onClick={this.resendVerificationEmail}>Resend verification email</Button>
        {alert}
      </div>
    );
  }
}

export default withRouter(VerifyEmail);
