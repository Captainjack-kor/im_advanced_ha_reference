import React from "react";
import { withRouter, Link } from "react-router-dom";
import axios from "axios";

axios.defaults.withCredentials = true;
class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      username: "",
      mobile: "",
      errorMessage: ""
    };
    this.handleInputValue = this.handleInputValue.bind(this);
  }

  handleInputValue = (key) => (e) => {
    this.setState({ [key]: e.target.value });
  };

  handleSignup = () => {
    // TODO : 서버에 회원가입 요청 후 로그인 페이지로 이동 하세요.
    //        로그인 페이지로 이동시, 다음 코드를 이용하세요.
    //        this.props.history.push("/");
    //
    // TODO : 모든 항목을 입력하지 않았을 경우 에러를 표시해야 합니다.
    const { email, password, mobile, username } = this.state;
    if (!email || !password || !mobile || !username) {
      this.setState({
        errorMessage: "모든 항목은 필수입니다"
      });
      return;
    }
    else {
      this.setState({
        errorMessage: ""
      });
    }

    axios
      .post("https://localhost:4000/signup", {
        email: email,
        password: password,
        username: username,
        mobile: mobile,
      })
      .then((res) => {
        this.props.history.push("/");
      })
      .catch((err) => console.log(err));
  }

  render() {
    return (
      <div>
        <center>
          <h1>Sign Up</h1>
          <form onSubmit={(e) => e.preventDefault()}>
            <div>모든 항목은 필수입니다</div>
            <div>
              <span>이메일</span>
              <input
                type="email"
                onChange={this.handleInputValue("email")}
              ></input>
            </div>
            <div>
              <span>비밀번호</span>
              <input
                type="password"
                onChange={this.handleInputValue("password")}
              ></input>
            </div>
            <div>
              <span>이름</span>
              <input
                type='text'
                onChange={this.handleInputValue("username")}
              ></input>
            </div>
            <div>
              <span>전화번호</span>
              <input
                type='tel'
                onChange={this.handleInputValue("mobile")}
              ></input>
            </div>
            <div>
              <Link to='/login'>이미 아이디가 있으신가요?</Link>
            </div>
            <button
              className="btn btn-signup"
              type='submit'
              onClick={this.handleSignup}
            >
              회원가입
            </button>
            {this.state.errorMessage ?
              <div className="alert-box">
                {this.state.errorMessage}
              </div> : ''}
          </form>
        </center>
      </div>
    );
  }
}

export default withRouter(Signup);
