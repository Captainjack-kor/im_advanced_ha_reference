import React from "react";
import { MemoryRouter } from "react-router-dom";
import sinon from "sinon";

import { expect } from "chai";
import Enzyme, { mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import nock from "nock";

import Signup from "../src/pages/Signup";
import Mypage from "../src/pages/Mypage";
import Login from "../src/pages/Login";

const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const dom = new JSDOM(`<!doctype html><html><body><p>paragraph</p></body></html>`);

global.window = dom.window;
global.document = dom.window.document;

Enzyme.configure({ adapter: new Adapter() });

describe("Advanced Web Hiring Assessments - Client", () => {
  const mockedUser = {
    email: "coding.kim@codestates.com",
    username: "김코딩",
    mobile: "010-1523-2342",
  };

  describe("Signup test", () => {
    it("it should sign up successfully when button click", (done) => {
      const wrapper = mount(
        <MemoryRouter>
          <Signup />
        </MemoryRouter>
      );

      const uniqueEmail = new Date().toISOString() + "@test.com";

      const scope = nock("https://localhost:4000")
        .post("/signup")
        .reply(201)

      const target = wrapper.children().childAt(0).childAt(0);
      target.setState({
        email: uniqueEmail,
        password: "1234",
        username: "test",
        mobile: "010-1234-5678",
      });
      target.find(".btn-signup").simulate("click");

      setTimeout(() => {
        const ajaxCallCount = scope.interceptors[0].interceptionCounter;
        expect(ajaxCallCount).to.eql(1); // ajax call이 1회 발생
        expect(scope.interceptors[0].statusCode).to.eql(201);

        scope.done();
        done();
      });
    });

    it("it should display error message when button click without enough information", (done) => {
      const wrapper = mount(
        <MemoryRouter>
          <Signup />
        </MemoryRouter>
      );

      wrapper.find(".btn-signup").simulate("click");

      setTimeout(() => {
        expect(wrapper.find(".alert-box").text()).to.eql('모든 항목은 필수입니다')
        done();
      });
    });

    it("it should not be able to send POST request without enough information", (done) => {
      const wrapper = mount(
        <MemoryRouter>
          <Signup />
        </MemoryRouter>
      );

      const scope = nock("https://localhost:4000")
        .post("/signup")
        .reply(201)

      wrapper.find(".btn-signup").simulate("click");

      setTimeout(() => {
        const ajaxCallCount = scope.interceptors[0].interceptionCounter;
        expect(ajaxCallCount).to.eql(0);  // ajax call이 발생하지 않음

        nock.abortPendingRequests();
        done();
      });
    });

  });

  describe("Login Test", () => {
    it("it should log in successfully when button click", (done) => {
      const wrapper = mount(
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      );

      const scope = nock("https://localhost:4000")
        .post("/signin")
        .reply();

      const target = wrapper.children().childAt(0).childAt(0);
      const loginBtn = target.find(".btn-login");
      target.setState({ email: "test@test.net", password: "1234" });
      loginBtn.simulate("click");

      setTimeout(() => {
        const ajaxCallCount = scope.interceptors[0].interceptionCounter;
        expect(ajaxCallCount).to.eql(1);

        scope.done();
        done();
      });
    });

    it("it should display error message when button click without id and password", (done) => {
      const wrapper = mount(
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      );

      wrapper.find(".btn-login").simulate("click");

      setTimeout(() => {
        expect(wrapper.find(".alert-box").text()).to.eql('이메일과 비밀번호를 입력하세요')
        done();
      });
    });

    it("it should not be able to send POST request without enough information", (done) => {
      const wrapper = mount(
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      );

      const scope = nock("https://localhost:4000")
        .post("/signin")
        .reply(201)

      wrapper.find(".btn-login").simulate("click");

      setTimeout(() => {
        const ajaxCallCount = scope.interceptors[0].interceptionCounter;
        expect(ajaxCallCount).to.eql(0);  // ajax call이 발생하지 않음

        nock.abortPendingRequests();
        done();
      });
    });

    it('it should be called handleResponseSuccess callback after log in', (done) => {
      const callback = sinon.spy(() => { });
      const wrapper = mount(
        <MemoryRouter>
          <Login handleResponseSuccess={callback} />
        </MemoryRouter>
      );

      const scope = nock("https://localhost:4000")
        .post("/signin")
        .reply();

      const target = wrapper.children().childAt(0).childAt(0);
      const loginBtn = target.find(".btn-login");
      target.setState({ email: "test@test.net", password: "1234" });
      loginBtn.simulate("click");

      setTimeout(() => {
        expect(callback.callCount).to.eql(1);
        done();
      }, 200);
    })
  });

  describe("Mypage test", () => {
    let container;
    beforeEach(() => {
      container = document.createElement("div");
      document.body.appendChild(container);
    });

    afterEach(() => {
      document.body.removeChild(container);
      container = null;
    });

    it("it should render user information if userinfo is provided", () => {
      const wrapper = mount(<Mypage userinfo={mockedUser} />, {
        attachTo: container,
      });

      expect(wrapper.find("h1").text()).to.eql("Mypage");
      expect(wrapper.find(".username").text()).to.eql("김코딩");
      expect(wrapper.find(".email").text()).to.eql("coding.kim@codestates.com");
      expect(wrapper.find(".mobile").text()).to.eql("010-1523-2342");
    });

    it('it should render nothing if userinfo is not provided', () => {
      const wrapper = mount(<Mypage />, {
        attachTo: container,
      });

      expect(wrapper.text()).to.eql('');
    })

    it("it should render logout button with handler from props", () => {
      const handler = () => { };
      const wrapper = mount(<Mypage userinfo={mockedUser} handleLogout={handler} />, {
        attachTo: container,
      });
      expect(wrapper.find("button.btn-logout").prop("onClick")).to.eql(handler);
    });
  });
});
