import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import "./Landing.css";

export class Landing extends Component {
  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      // this.props.history.push('/dashboard');
      this.props.history.push("/myquizzes");
    } else {
      this.props.history.push("/searchquiz");
    }
  }

  render() {
    return (
      <div className="landingPageMainDiv">
        <h1>Welcome to Quiza</h1>
      </div>
    );
  }
}

Landing.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(Landing);
