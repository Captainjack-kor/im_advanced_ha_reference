import React from "react";
import { Switch, Route, Redirect, withRouter } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Mypage from "./pages/Mypage";
import axios from "axios";
import './App.css';

class App extends React.Component {
  state = {
    isLogin: true,
    userinfo: null,
  };

  componentDidMount() {
    this.isAuthenticated();
  }

  isAuthenticated() {
    return axios.get("https://localhost:4000/user")
      .then((res) => {
        console.log(res.data);
        this.setState({ userinfo: res.data, isLogin: true });
        this.props.history.push('/');
      })
      .catch((err) => {
        if (err.response.status === 401) {
          this.setState({ isLogin: false })
          this.props.history.push('/login');
        }
      })
  }

  handleResponseSuccess() {
    this.isAuthenticated();
  }

  handleLogout() {
    axios.post("https://localhost:4000/signout")
      .then((res) => {
        this.setState({ userinfo: null, isLogin: false });
        this.props.history.push('/');
      })
  }

  render() {
    const { isLogin, userinfo } = this.state;

    return (
      <div>
        <Switch>
          <Route
            path='/login'
            render={() => (
              <Login isLogin={isLogin} handleResponseSuccess={this.handleResponseSuccess.bind(this)} />
            )}
          />
          <Route exact path='/signup' render={() => <Signup isLogin={isLogin} />} />
          <Route
            exact
            path='/mypage'
            render={() => <Mypage userinfo={userinfo} handleLogout={this.handleLogout.bind(this)} />}
          />
          <Route
            path='/'
            render={() => {
              if (isLogin) {
                return <Redirect to='/mypage' />;
              }
              return <Redirect to='/login' />;
            }}
          />
        </Switch>
      </div>
    );
  }
}
export default withRouter(App);
