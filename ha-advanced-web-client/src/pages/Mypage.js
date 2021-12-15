import React from 'react';
import axios from 'axios';

axios.defaults.withCredentials = true;

function Mypage(props) {
  const { userinfo, handleLogout } = props;

  return (userinfo ?
    <div>
      <h1>Mypage</h1>
      <div className="username">{userinfo.username}</div>
      <div className="email">{userinfo.email}</div>
      <div className="mobile">{userinfo.mobile}</div>

      <button className="btn btn-logout" onClick={handleLogout}>logout</button>
    </div>
    : '');

}

export default Mypage;