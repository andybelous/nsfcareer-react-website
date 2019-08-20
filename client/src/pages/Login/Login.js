import React from 'react';
import LoginComponent from '../../components/Authentication/LoginComponent';
import { withRouter } from 'react-router-dom';
import "./Login.css";

class Login extends React.Component {
  constructor(props) {
    super();
    this.state = { someKey: 'someValue' };
  }

  render() {
    return (
      <React.Fragment>

          <LoginComponent/>
        </React.Fragment>
    );
  }
}

export default withRouter(Login);
