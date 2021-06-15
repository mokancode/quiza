import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link, withRouter } from "react-router-dom";
import classnames from "classnames";
import "./Sidebar.css";
import isEmpty from "../../validation/is-empty";

export class Sidebar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      liList: [
        { link: "/myquizzes", name: "My quizzes" }, // auth only
        { link: "/searchquiz", name: "Search" },
        { link: "/history", name: "History" }, // auth only
        // { link: "/discover", name: "Discover" },
        { link: "/settings", name: "Settings" }, // auth only
      ],
      dashboardSideMenuVisible: false,
    };
  }

  componentDidMount() {
    this.setState({ dashboardSideMenuVisible: true });

    // const { auth } = this.props;
    // if (auth.isAuthenticated === false) {
    //     console.log("auth isauth: ", auth);
    //         // this.props.history.push('/dashboard');
    // }
  }

  componentDidUpdate(nextProps, prevState) {
    // console.log("sidebar update props: ", nextProps);
  }

  render() {
    const { isAuthenticated, user } = this.props.auth;
    const { location } = this.props;
    const { dashboardSideMenuVisible } = this.state;

    // console.log("location: ", isEmpty(location.pathname.match(/^(\/createquiz).*$/)));
    // console.log("Sidebar.js render props: ", this.props);
    // console.log("condition", !isAuthenticated && isEmpty(location.pathname.match(/^(\/createquiz).*$/)));

    const { liList } = this.state;

    return (
      <div className="dashboardMain">
        {/* {!isAuthenticated && isEmpty(location.pathname.match(/^(\/createquiz).*$/)) ? null : */}
        <div className="dashboardSidebarWrapper">
          <div
            className={classnames("dashboardSideMenu", {
              "dashboardSideMenuVisible": dashboardSideMenuVisible,
            })}
            style={{ "marginLeft": "-200px" }}
          >
            <ul className="dashboardSideMenuList">
              {/* <li className="dashboardSideMenuListDashboardElt"><Link to="/dashboard">Dashboard</Link></li> */}
              {liList.map(function (liElt, index) {
                if (!isAuthenticated && (liElt.link === "/myquizzes" || liElt.link === "/history" || liElt.link === "/settings"))
                  return null;
                else
                  return (
                    <li className={classnames("sideBarElt", { "sidebarLiLighter": index % 2 != 0 })}>
                      <Link to={liElt.link}>{liElt.name}</Link>
                    </li>
                  );
              })}
            </ul>
          </div>
          <div className="dashboardSidebarGradient"></div>
        </div>
        {/* } */}
      </div>
    );
  }
}

Sidebar.propTypes = {
  auth: PropTypes.object.isRequired,
  styles: PropTypes.object,
};

function mapStateToProps(state) {
  return {
    auth: state.auth,
    requests: state.requests,
    styles: state.styles,
  };
}

export default withRouter(connect(mapStateToProps, {})(Sidebar));
