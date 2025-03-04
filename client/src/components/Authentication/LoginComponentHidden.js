import React from 'react';
import { Link, Redirect, withRouter } from 'react-router-dom';
import Footer from '../Footer';
import { formDataToJson } from '../../utilities/utility';
import { logInHidden, logInFirstTime, checkIfPlayerExists, loginWithoutEmail } from '../../apis';
import { connect } from 'react-redux';
import store from '../../Store';
import '../../mixed_style.css';
import { getStatusOfDarkmode } from '../../reducer';
import { setIsSignedInSucceeded, userDetails } from '../../Actions';
// import DarkMode from '../DarkMode';
import facebook_icon from './facebook_icon.png';
import google_icon from './google_icon.png';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'
import GoogleLogin from 'react-google-login';
import axios from 'axios';
import ResendMail from './ResendMail'

let search = window.location.search;
let params = new URLSearchParams(search);

class LoginComponentHidden extends React.Component {
  constructor(props) {
    super(props);
    console.log("Login Props", props);
    this.state = {
      tempPasswordRequired: false,
      isLoginError: false,
      loginErrorCode: '',
      isLoading: false,
      isSignInSuccessed: false,
      userType: '',
      userDetails: '',
      isValidPlayer: false,
      name: '',
      cognito_user_id: '',
      signUpStatus: false,
      IRBProcessMessage: '',
      signupData: '',
      isSingup: false
    };
    if (this.props.location.state && this.props.location.state.message) {
      this.state.IRBProcessMessage = this.props.location.state.message;
    }
    console.log("JSON.STRINGIFY(THIS.STATE)", this.state);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  isAdminType = (userType) => {
    if (userType === 'Admin') {
      return true;
    } else {
      return false;
    }
  };

  componentWillReceiveProps(nextProps) {
    this.setState({ isSignInSuccessed: nextProps.signedIn });
  }

  componentDidMount() {
    // Scrolling winddow to top when user clicks on about us page
    window.scrollTo(0, 0)
    if (getStatusOfDarkmode().status === true) {
      document.getElementsByTagName('body')[0].style.background = '#171b25';
      this.refs.loginForm.style.background = "rgb(35, 40, 56)";
      // this.refs.dashboardView.src = "/img/icon/dashboardViewDark.png";
      this.refs.brainIcon.style.border = "5px solid rgb(23, 27, 37)";
      for (let i = 1; i <= 2; i++) {
        this.refs[`p${i}`].style.color = "#fff";
      }
    }
  }

  handleSubmit(e) {
    console.log('SIGNIN IN CLICKED');
    e.preventDefault();
    e.persist();
    //temporary setting authentication to change nav bar tabs

    console.log('LOGIN API CALLED');
    const formData = new FormData(e.target);
    this.setState({
      isLoginError: false,
      isLoading: true
    });
    // converting formData to JSON
    const formJsonData = formDataToJson(formData);
    console.log(formJsonData)
    if (this.state.tempPasswordRequired) {
      // call API of first Time Login with Temporary Password
      logInFirstTime(formJsonData)
        .then((response) => {
          if (response.data.message === 'success') {
            u_details = response.data.user_details;
            this.setState({
              isLoading: false,
              isSignInSuccessed: true
            });
            store.dispatch(setIsSignedInSucceeded());
            store.dispatch(userDetails(u_details));
            this.props.isAuthenticated(true);
          } else {
            // show error
            this.setState({
              loginError: response.data.error,
              isLoginError: true,
              isLoading: false
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      var u_details = '';
      logInHidden(formJsonData)
        .then((response) => {
          console.log('Login ', response);
          if (response.data.message === 'success') {
            if (response.data.status === 'FORCE_CHANGE_PASSWORD') {
              this.setState({
                tempPasswordRequired: true,
                isLoading: false
              });
            } else {
              // login redirect code here
              u_details = response.data.user_details;
              console.log("Cognito ", u_details);

              checkIfPlayerExists({ name: response.data.user_details.first_name + " " + response.data.user_details.last_name })
                .then(res => {

                  this.setState({
                    isValidPlayer: res.data.flag,
                    isLoading: false,
                    isSignInSuccessed: true,
                    userType: u_details.user_type,
                    userDetails: u_details,
                    name: u_details.first_name + " " + u_details.last_name,
                    cognito_user_id: u_details.user_cognito_id
                  })
                  console.log("USER DETAILS ", u_details);
                  store.dispatch(setIsSignedInSucceeded());
                  store.dispatch(userDetails(u_details));

                  this.props.isAuthenticated(true);
                })
                .catch(err => {
                  this.setState({
                    isLoginError: true,
                    isLoading: false,
                    loginError: response.data.error
                  });
                })

            }
          } else {
            if (response.data.error === 'your email is not verified, Check your mail to verify your account') {
              this.setState({
                isLoginError: true,
                isLoading: false,
                loginError: response.data.error,
                resendEmail: true
              });
            } else {
              this.setState({
                isLoginError: true,
                isLoading: false,
                loginError: response.data.error
              });
            }
          }

          // Now update the state with data that we added
        })
        .catch((err) => {
          e.target.reset();
          // catch error
          this.setState({
            isLoginError: true,
            isLoading: false,
            loginError: err
          });
          console.log('error : ', err);
        });
    }
  }
  responseFacebook = (response) => {
    console.log('fb rs', response);
    if (response.email) {
      var formJsonData = { userID: response.userID, first_name: response.first_name, last_name: response.last_name, email: response.email, type: 'facebook' }
      this.setState({
        signupData: {
          userID: response.userID,
          first_name: response.first_name,
          last_name: response.last_name,
          email: response.email,
          type: 'facebook'
        }
      })
      this.LoginWithoutEmail(formJsonData);
    } else {
      console.log(response.first_name, response.userID);
      // eslint-disable-next-line
      var formJsonData = { userID: response.userID, first_name: response.first_name, last_name: response.last_name, email: '', type: 'facebook' }
      this.setState({
        signupData: {
          userID: response.userID,
          first_name: response.first_name,
          last_name: response.last_name,
          email: '',
          type: 'facebook'
        }
      })
      if (response.status !== "unknown") {
        this.LoginWithoutEmail(formJsonData);
      }
    }
  }
  //google response
  responseGoogle = (response) => {
    console.log(response);
    if (response.profileObj) {
      var formJsonData = { userID: response.profileObj.googleId, first_name: response.profileObj.familyName, last_name: response.profileObj.givenName, email: response.profileObj.email, type: 'google' }
      this.setState({
        signupData: {
          userID: response.profileObj.googleId,
          first_name: response.profileObj.familyName,
          last_name: response.profileObj.givenName,
          email: response.profileObj.email,
          type: 'google'
        }
      })
      this.LoginWithoutEmail(formJsonData);
    }
  }

  LoginWithoutEmail = (formJsonData) => {
    this.setState({ isLoading: true })
    loginWithoutEmail(formJsonData)
      .then(res => {
        console.log('res', res);
        if (res.data.message === 'notExists') {
          this.setState({
            isSingup: true,
            isLoading: false
          })
        } else if (res.data.message === 'success') {
          if (res.data.status === 'FORCE_CHANGE_PASSWORD') {
            formJsonData['user_name'] = res.data.user_name;
            formJsonData['password'] = formJsonData.userID;
            formJsonData['new_password'] = formJsonData.userID;
            this.handleChangePassword(formJsonData);
          } else {
            var u_details = res.data.user_details;
            console.log("Cognito ", u_details);

            checkIfPlayerExists({ name: res.data.user_details.first_name + " " + res.data.user_details.last_name })
              .then(res => {

                this.setState({
                  isValidPlayer: res.data.flag,
                  isLoading: false,
                  isSignInSuccessed: true,
                  userType: u_details.user_type,
                  userDetails: u_details,
                  name: u_details.first_name + " " + u_details.last_name,
                  cognito_user_id: u_details.user_cognito_id
                })
                console.log("USER DETAILS ", u_details);
                store.dispatch(setIsSignedInSucceeded());
                store.dispatch(userDetails(u_details));

                this.props.isAuthenticated(true);
              })
              .catch(err => {
                this.setState({
                  isLoginError: true,
                  isLoading: false,
                  loginError: res.data.error
                });
              })
          }
        } else {
          this.setState({
            isLoginError: true,
            isLoading: false,
            loginError: res.data.error
          });
        }
      }).catch(err => {
        console.log('err', err);
      })
  }
  logIn = () => {

  }
  handleChangePassword = (formJsonData) => {
    axios.post(`/logInFirstTime`, formJsonData, { withCredentials: true })
      .then((response) => {
        console.log('logInFirstTime', response)
        if (response.data.message === 'success') {
          var u_details = response.data.user_details;
          this.setState({
            isLoading: false,
            isSignInSuccessed: true
          });
          store.dispatch(setIsSignedInSucceeded());
          store.dispatch(userDetails(u_details));
          this.props.isAuthenticated(true);
        } else {
          // show error
          this.setState({
            loginError: response.data.error,
            isLoginError: true,
            isLoading: false
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  handleChange =(e)=>{
    this.setState({user_name: e.target.value})
  }
  resendVerficationMail = ()=>{
    const {user_name} = this.state;
    // console.log('user_name',user_name)
    this.setState({isResendMail: true});
  }

  statusVerficationMail = ()=>{
    this.setState({isResendMail : false})
  }

  render() {

    if (this.state.isSignInSuccessed) {

      return <Redirect to="/Dashboard" />;
    }
    if(this.state.isResendMail){
      return <ResendMail user_name={this.state.user_name} statusVerficationMail={this.statusVerficationMail}/>
    }

    if (this.state.isSingup) {
      return <Redirect to={{
        pathname: '/User/SignUp/',
        state: { data: this.state.signupData }
      }} />
    }
    return (
      <React.Fragment>
        <div className="dynamic__height">
          <div className="container  pl-0 pr-0 login-height overflow-hidden">

            <div style={{ marginTop: "5vh", marginBottom: "2vh" }} className="row login">
              <div className="col-md-12  mb-5">
                <div className="text-center">
                  <p style={{
                    fontSize: "20px",
                    fontWeight: "900",
                    width: '44%',
                    margin: 'auto'
                  }} className="top-heading__login animated fadeInUp">
                    The Dashboard gives users and administrators a cumulative
                    overview, as well as an in-depth analysis on each head
                    acceleration event.
                  </p>
                </div>
              </div>

              {/*<div className="col-md-6 mb-5 p-3 animated fadeInLeft">
                <div id="dashboard-view" className="text-right dashboard-mock">
                  <div className="text-center dashboard-example">
                    Dashboard Example
                  </div>
                  <img ref="dashboardView"
                    className="img-fluid"
                    src="/img/dashboardMock.png"
                    alt=""
                  />
                </div>
              </div>
              // Default div for Sign In section
              <div className="col-md-6 mb-5 p-3 animated fadeInRight">
              */
              }
              <div className="col-md-6 mb-6  offset-md-3 p-3 animated fadeInRight">
                {/*eslint-disable-next-line*/}
                <div style={{ paddingLeft: "0% !important" }} ref="loginForm" style={{ margin: "3%" }} className="card card-border">
                  <div className="card-body">

                    <div ref="brainIcon" className="text-center brain-icon">
                      <img src="img/icon/brain.png" alt="img" />
                    </div>
                    {params.get('error') ? (
                      <div
                        className="alert alert-info api-response-alert"
                        role="alert"
                      >
                        <strong >Failed! </strong> {params.get('error')}
                      </div>
                    ) : null}
                    {params.get('success') ? (
                      <div
                        className="alert alert-info api-response-alert-success"
                        role="alert"
                      >
                        <strong >Success! </strong> Your account has been verified successfully.
                      </div>
                    ) : null}
                    {this.state.IRBProcessMessage.length > 0 ? (
                      <div
                        className="alert alert-info api-response-alert-success"
                        role="alert"
                      >
                        <strong > Success!</strong> {this.state.IRBProcessMessage}.
                      </div>
                    ) : null}
                    {this.state.message ? (
                      <div
                        className="alert alert-info api-response-alert"
                        role="alert"
                      >
                        <strong > Success !</strong> {this.state.message}.
                      </div>
                    ) : null}
                    <form onSubmit={this.handleSubmit} ref="signInForm">
                      <div className="input-group mt-3 mb-5">
                        <div className="input-group-prepend">
                          <span className="input-group-text" id="basic-addon1">
                            <img src="img/icon/user.svg" alt="" />
                          </span>
                        </div>
                        <input
                          type="text"
                          className="form-control"
                          name="user_name"
                          placeholder="E-mail"
                          aria-label="Username"
                          aria-describedby="basic-addon1"
                          onChange={this.handleChange}
                        />
                      </div>
                      <div className="input-group mb-1">
                        <div className="input-group-prepend">
                          <span className="input-group-text" id="basic-addon1">
                            <img src="img/icon/lock.svg" alt="" />
                          </span>
                        </div>
                        <input
                          type="password"
                          className="form-control"
                          name="password"
                          placeholder="Password"
                          aria-label="Password"
                          aria-describedby="basic-addon1"
                        />
                      </div>

                      {this.state.tempPasswordRequired ? (
                        <div style={{ marginTop: "2rem" }} className="input-group mb-1">
                          <div className="input-group-prepend">
                            <span
                              className="input-group-text"
                              id="basic-addon1"
                            >
                              <img src="img/icon/lock.svg" alt="" />
                            </span>
                          </div>
                          <input
                            type="password"
                            className="form-control"
                            name="new_password"
                            placeholder="New Password (Min. 8 digit password)"
                            aria-label="Password"
                            aria-describedby="basic-addon1"
                          />
                        </div>
                      ) : null}

                      <div>
                        <Link
                          to="/Forgot-Password"
                          className="float-right forgot-pswd"
                        >
                          Forgot password?
                        </Link>
                      </div>
                      <button
                        type="submit"
                        className="btn btn-primary log-in-btn btn-block mt-5"
                      >
                        LOG IN
                      </button>
                    </form>

                    <FacebookLogin
                      appId="372593693091338"
                      autoLoad={false}
                      fields="first_name, last_name,email,picture,gender"
                      callback={this.responseFacebook}
                      render={renderProps => (
                        <>
                          <div className="tab_login_buttons" onClick={renderProps.onClick}>
                            <img src={facebook_icon} alt="img" /> <p>Sign in using Facebook </p>
                          </div>
                        </>
                      )}
                    />
                    <GoogleLogin
                      clientId="2204546519-6oqassj4ircoq48qaecu4nb30r1fthsk.apps.googleusercontent.com"
                      render={renderProps => (
                        <>
                          <div className="tab_login_buttons2" onClick={renderProps.onClick} disabled={renderProps.disabled}>
                            <img src={google_icon} alt="img" /> <p>Sign in using Google</p>
                          </div>
                        </>
                      )}
                      buttonText="Login"
                      onSuccess={this.responseGoogle}
                      onFailure={this.responseGoogle}
                      cookiePolicy={'single_host_origin'}
                    />
                    <div style={{ 'float': 'left', 'width': '100%' }}>
                      {this.state.isLoading ? (
                        <div className="d-flex justify-content-center center-spinner">
                          <div
                            className="spinner-border text-primary"
                            role="status"
                          >
                            <span className="sr-only">Loading...</span>
                          </div>
                        </div>
                      ) : null}
                      {this.state.isLoginError ?
                        this.state.resendEmail ?
                          (
                            <div
                              className="alert alert-info api-response-alert"
                              role="alert"

                            >
                              <>

                                <strong >Failed! </strong><p dangerouslySetInnerHTML={{ __html: this.state.loginError }} style={{ 'display': 'contents' }}></p>.<br/> <span onClick={this.resendVerficationMail}
                                  style={{
                                    'font-size': '18px',
                                    'color': '#ffffff',
                                    'font-weight': '600',
                                    'text-decoration': 'underline',
                                    'cursor': 'pointer'
                                  }}
                                >Resend Email</span>
                              </>
                            </div>
                          )
                          :
                          (
                            <div
                              className="alert alert-info api-response-alert"
                              role="alert"

                            >
                              <>

                                <strong >Failed! </strong><p dangerouslySetInnerHTML={{ __html: this.state.loginError }} style={{ 'display': 'contents' }}></p>.
                              </>
                            </div>
                          )

                        : null}
                    </div>
                    <div className="text-center">
                      <p ref="p1" className="mt-4 sign-up-link">
                        Don't have an account?{' '}
                        <Link className="sign-up" to="SignUp">
                          {' '}
                          Sign Up{' '}
                        </Link>
                      </p>
                    </div>

                    <div className="option-or">
                      <div className="or-img text-center">
                        <img src="/img/icon/or.png" className="" alt="" />
                      </div>
                      <div className="text-center">
                        <p ref="p2" className="sign-up-link">
                          Are you an administrator including coach, parent,
                          trainer, or military unit leader? <br />
                          <Link className="sign-up" to="SignUpElse">
                            {' '}
                            Sign Up for Someone Else.
                          </Link>{' '}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        <Footer />
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  console.log("ARMIN", state);
  return {
    // dispatching actions
    signedIn: state.isSignedInSuccess
  };
}

export default connect(mapStateToProps)(withRouter(LoginComponentHidden));
