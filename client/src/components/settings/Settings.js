import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import "./Settings.css";
import axios from "axios";
import { logoutUser } from "../../actions/authActions";
import Spinner from "../common/Spinner";
import SpinnerDelayed from "../common/SpinnerDelayed";

export class Settings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      errors: {},
      displayName: "",
      nameIsNew: false,
      isLoading: false,
      isLoadingForm: true,
      settingsSaved: false,
    };

    this.onChange = this.onChange.bind(this);
    this.saveSettings = this.saveSettings.bind(this);
  }

  componentDidMount() {
    const { auth } = this.props;
    this.setState({ displayName: auth.user.displayName });

    axios
      .get("api/quizzes/arequizzeshidden")
      .then(
        function (res) {
          this.setState({
            quizzesAreHidden: res.data,
            hideMyQuizzes: res.data,
            isLoadingForm: false,
          });
        }.bind(this)
      )
      .catch(
        function (err) {
          console.log("error: ", err.response.data);
          // this.setState({ errors: err.response.data.errors, isLoading: false });
        }.bind(this)
      );
  }

  saveSettings(e) {
    e.preventDefault();
    const { auth } = this.props;
    const { displayName, hideMyQuizzes, quizzesAreHidden } = this.state;

    this.setState({ isLoading: true });

    var atLeastOneSettingChanged = false;

    if (hideMyQuizzes !== quizzesAreHidden) {
      atLeastOneSettingChanged = true;
      const data = {
        hideMyQuizzes,
      };
      axios
        .post("api/quizzes/hidemyquizzes", data)
        .then(
          function (res) {
            this.setState(function (prevState) {
              return {
                isLoading: false,
                settingsSaved: true,
                quizzesAreHidden: !prevState.quizzesAreHidden,
              };
            });
          }.bind(this)
        )
        .catch(
          function (err) {
            console.log("error: ", err.response.data);
            this.setState({
              errors: err.response.data.errors,
              isLoading: false,
            });
          }.bind(this)
        );
    }

    if (displayName !== auth.user.displayName) {
      atLeastOneSettingChanged = true;

      const data = {
        newDisplayName: displayName,
      };

      axios
        .post("api/users/changedisplayname", data)
        .then(
          function (res) {
            this.props.logoutUser();
          }.bind(this)
        )
        .catch(
          function (err) {
            console.log("error: ", err.response.data);
            this.setState({ errors: err.response.data.errors, isLoading: false });
          }.bind(this)
        );
    }

    if (!atLeastOneSettingChanged) this.setState({ isLoading: false });
  }

  render() {
    const { errors, displayName, nameIsNew, isLoading, isLoadingForm, hideMyQuizzes, settingsSaved } = this.state;

    return (
      <div className="settingsMainDiv">
        <h1 className="settingsHeader">Settings</h1>

        <form className="searchFormDiv createQuizSearchFormDiv settingsFormDiv" onSubmit={this.saveSettings}>
          {!isLoadingForm ? (
            <div className="settingsFormWrapper">
              <div className="inputAndErrorDiv">
                <div className="quizHelperDiv">
                  <label className="inputLabel inputLabelSettings">Display name</label>
                </div>
                <input
                  maxLength="70"
                  autoComplete="off"
                  onChange={this.onChange}
                  // onBlur={this.onBlur}
                  type="text"
                  name="displayName"
                  tabIndex="2"
                  value={displayName}
                ></input>
                {errors.displayName ? <span className="errorSpan registerErrorSpan">{errors.displayName}</span> : null}

                {nameIsNew ? (
                  <div className="errorSpanWrapper errorSpanWrapperSettings">
                    <span className="errorSpan errorSpanSettings">
                      <img className="errorImgCreateQuiz" src="/images/warning.svg" alt="Attention"></img>
                      <span>Saving a new name will log you out of this session.</span>
                    </span>
                  </div>
                ) : null}
              </div>

              <div className="inputAndErrorDiv settingsHideQuizzesDiv">
                <div className="quizHelperDiv">
                  <label className="inputLabel inputLabelSettings">Hide all my posted quizzes</label>
                </div>
                <div className="centerCheckboxDiv">
                  <input
                    onChange={this.onChange}
                    // onBlur={this.onBlur}
                    type="checkbox"
                    name="hideMyQuizzes"
                    tabIndex="3"
                    checked={hideMyQuizzes}
                  ></input>
                </div>
                {errors.hideMyQuizzes ? (
                  <span className="errorSpan registerErrorSpan registerErrorSpanUsername">{errors.hideMyQuizzes}</span>
                ) : null}
              </div>

              <button type="submit" className="submitBtn uploadQuizBtn saveSettingsBtn" onClick={this.saveSettings}>
                Save
              </button>
              {/* <button type="submit" className="uploadQuizBtn saveSettingsBtn" onClick={this.saveSettings}>Save</button> */}

              {isLoading ? (
                <div className="settingsSpinner">
                  <SpinnerDelayed isLoading={true} />
                </div>
              ) : null}

              {settingsSaved ? (
                <div className="settingsSavedWrapper">
                  <span className="errorSpan registerErrorSpan settingsSaved">Settings saved</span>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="settingsSpinner">
              <h1>Loading</h1>
              <SpinnerDelayed isLoading={true} />
            </div>
          )}
        </form>
      </div>
    );
  }

  onChange(e) {
    const { auth } = this.props;

    this.setState({ settingsSaved: false });

    if (e.target.name === "hideMyQuizzes") {
      this.setState({ hideMyQuizzes: e.target.checked });
      return;
    }

    var targetName = e.target.name;
    if (e.target.name === "displayName") {
      var newName = e.target.value;
    }

    this.setState(
      { [e.target.name]: e.target.value },
      function () {
        if (targetName === "displayName") {
          if (newName !== auth.user.displayName) {
            this.setState({ nameIsNew: true });
          } else {
            this.setState({ nameIsNew: false });
          }
        }
      }.bind(this)
    );
  }
}

Settings.propTypes = {
  auth: PropTypes.object.isRequired,
  logoutUser: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    auth: state.auth,
  };
}

export default connect(mapStateToProps, { logoutUser })(Settings);
