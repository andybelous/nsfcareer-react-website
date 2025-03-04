import React from 'react';
import { Redirect } from 'react-router-dom';
import {
  isAuthenticated
} from '../../apis';
import Spinner from '../Spinner/Spinner';


class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isAuthenticated: false,
      userDetails: null,
      isCheckingAuth: true,
      isLoaded: false
    };
  }

  render() {
    console.log('organization: this.state.userDetails',this.state.userDetails)
    if (!this.state.isLoaded) return <Spinner />;
 
    if (this.state.isAuthenticated && !this.state.isCheckingAuth) {
      if (this.state.userDetails.level === 1000) {
        return <Redirect to="/AdminDashboard" />;
      } else if (this.state.userDetails.level === 400) {  
        var sensor = this.state.userDetails.sensor && this.state.userDetails.sensor !== null && this.state.userDetails.sensor !== undefined ? this.state.userDetails.sensor : ''; 

        return <Redirect to={{
          pathname: '/OrganizationAdmin',
          state: {
            brand: {
              brand: sensor,
              user_cognito_id: this.state.userDetails.user_cognito_id
            }
          }
        }} />;
      } else if (this.state.userDetails.level === 300) {
        var sensor = this.state.userDetails.sensor && this.state.userDetails.sensor !== null && this.state.userDetails.sensor !== undefined ? this.state.userDetails.sensor : ''; 
        return <Redirect to={{
          pathname: '/TeamAdmin/'+this.state.userDetails.organization+'/'+sensor,
          state: {
            brand: {
              brand: null,
              organization: this.state.userDetails.organization,
              user_cognito_id: this.state.userDetails.user_cognito_id
            }
          }
        }} />;
      } else if (this.state.userDetails.level === 200) {
        var sensor = this.state.userDetails.sensor && this.state.userDetails.sensor !== null && this.state.userDetails.sensor !== undefined ? this.state.userDetails.sensor : ''; 

        return <Redirect to={{
          pathname: '/TeamAdmin/team/players/'+this.state.userDetails.organization+'/'+this.state.userDetails.team+'?brand='+sensor,
          state: {
            team: {
              brand: this.state.userDetails.sensor,
              organization: this.state.userDetails.organization,
              team_name: this.state.userDetails.team,
              user_cognito_id: this.state.userDetails.user_cognito_id
            }
          }
        }} />;
      } else {
        var sensor = this.state.userDetails.sensor && this.state.userDetails.sensor !== null && this.state.userDetails.sensor !== undefined ? this.state.userDetails.sensor : ''; 
        var sensor_id_number =  this.state.userDetails.sensor_id_number && this.state.userDetails.sensor_id_number !== null && this.state.userDetails.sensor_id_number !== undefined ? this.state.userDetails.sensor_id_number : ''; 
        return <Redirect to={{
          pathname: '/TeamAdmin/user/dashboard/'+ this.state.userDetails.user_cognito_id+'/'+sensor_id_number+'?team='+this.state.userDetails.team+'&org='+this.state.userDetails.organization+'&brand='+sensor,
          state: {
            team: {
              organization: this.state.userDetails.organization,
              team_name: this.state.userDetails.team
            },
            cognito_user_id: this.state.userDetails.user_cognito_id,
            player_name: this.state.userDetails.sensor_id_number
          }
        }} />;
      }
      
    } else {
      return <Redirect to="/Login" />;
    }

  }
  componentDidMount() {
    isAuthenticated(JSON.stringify({}))
    .then((value) => {
      if (value.data.message === 'success') {
          this.setState({
	          userDetails: JSON.parse(localStorage.getItem("state")).userInfo,
            isLoading: false,
            isAuthenticated: true,
            isCheckingAuth: false,
            isLoaded: true
          });
          console.log('userDetails    ---------------\n',JSON.parse(localStorage.getItem("state")).userInfo)
      } else {
        this.setState({ isAuthenticated: false, isCheckingAuth: false, isLoaded: true });
      }
    })
    .catch((err) => {
      this.setState({ isAuthenticated: false, isCheckingAuth: false, isLoaded: true });
    })     
  }
}

export default Dashboard;
