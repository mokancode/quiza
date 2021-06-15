import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
// import io from 'socket.io-client';
import "./SearchQuiz.css";
import "./SearchQuizMobile.css";
import { createFriendRequest } from "../../actions/authActions";
import axios from "axios";
import { getRequests, getSentRequests, getFriends } from "../../actions/requestActions";
import { searchQuizzes, getMajors } from "../../actions/quizActions";
import classnames from "classnames";
import isEmpty from "../../validation/is-empty";
import Spinner from "../common/Spinner";
import SpinnerDelayed from "../common/SpinnerDelayed";

// const socketUrl = "localhost:5001";

export class SearchQuiz extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isSearching: false, // true = searching, false = not searching, null = no results found
      someList: [],
      connectedUsersList: [],
      friendList: [],
      errors: {},
      sentFriendRequests: [],
      receivedFriendRequests: [],
      courseTitleCountLeft: 50,
      courseCodeMainError: false,
      fieldsOfStudyList: [],
      schoolNamesSuggestions: [],
      courseCodeSuggestions: [],
      courseTitlesSuggestions: [],
      showCourseCodeLettersSuggestions: false,
      showCourseCodeDigitsSuggestions: false,
      showCourseTitlesSuggestions: false,
      showSchoolNamesSuggestions: false,
      showChooseOneParameterPlease: false,
      courseTitle: "",
      courseCodeDigits: "",
      courseCodeLetters: "",
      fieldOfStudy: "",
      schoolName: "",
      courseTermSeason: "",
      courseTermYear: "",
      quizCreatorName: "",
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    // this.createMessage = this.createMessage.bind(this);
    // this.addToList = this.addToList.bind(this);
    // this.updateConnectedUsersList = this.updateConnectedUsersList.bind(this);
    // this.updateFriendsList = this.updateFriendsList.bind(this);
    this.searchQuizzes = this.searchQuizzes.bind(this);
    this.filterCourseCodeLettersSuggestions = this.filterCourseCodeLettersSuggestions.bind(this);
    this.getCourseCodeLettersSuggestions = this.getCourseCodeLettersSuggestions.bind(this);
    this.getCourseCodeDigitsSuggestions = this.getCourseCodeDigitsSuggestions.bind(this);
    this.getCourseTitlesSuggestions = this.getCourseTitlesSuggestions.bind(this);
    this.getSchoolNamesSuggestions = this.getSchoolNamesSuggestions.bind(this);
    this.moveFocus = this.moveFocus.bind(this);
    this.selectCodeLetterSuggestionEnter = this.selectCodeLetterSuggestionEnter.bind(this);
    this.selectCodeLetterSuggestionClick = this.selectCodeLetterSuggestionClick.bind(this);
    this.selectCodeDigitSuggestionEnter = this.selectCodeDigitSuggestionEnter.bind(this);
    this.selectCodeDigitSuggestionClick = this.selectCodeDigitSuggestionClick.bind(this);
    this.selectSchoolNameSuggestionEnter = this.selectSchoolNameSuggestionEnter.bind(this);
    this.selectSchoolNameSuggestionClick = this.selectSchoolNameSuggestionClick.bind(this);
    this.selectCourseTitleSuggestionEnter = this.selectCourseTitleSuggestionEnter.bind(this);
    this.selectCourseTitleSuggestionClick = this.selectCourseTitleSuggestionClick.bind(this);
    this.loadParams = this.loadParams.bind(this);

    this.courseCodeLettersOnBlur = this.courseCodeLettersOnBlur.bind(this);
    this.courseCodeDigitsOnBlur = this.courseCodeDigitsOnBlur.bind(this);
    this.blurAllSuggestions = this.blurAllSuggestions.bind(this);

    // refs

    this.courseCodeLettersSuggestionInput = React.createRef();
    this.courseCodeDigitsSuggestionInput = React.createRef();
    this.courseTitleInput = React.createRef();
    this.selectFieldOfStudyRef = React.createRef();
    this.schoolNameInput = React.createRef();
    this.courseTermSeasonInput = React.createRef();
    this.courseTermYearInput = React.createRef();
    this.quizCreatorNameInput = React.createRef();
    this.courseCodeLettersSuggestions = React.createRef();
    this.courseCodeDigitsSuggestions = React.createRef();
    this.schoolNamesSuggestions = React.createRef();
    this.courseTitlesSuggestions = React.createRef();
  }

  render() {
    const { auth } = this.props;
    const {
      someList,
      errors,
      connectedUsersList,
      friendList,
      sentFriendRequests,
      receivedFriendRequests,
      courseTitleCountLeft,
      fieldsOfStudyList,
      courseCodeMainError,
      courseCodeLetters,
      courseCodeDigits,
      courseCodeSuggestions,
      courseTitlesSuggestions,
      courseTitle,
      isSearching,

      showCourseCodeLettersSuggestions,
      showCourseCodeDigitsSuggestions,
      showSchoolNamesSuggestions,
      showChooseOneParameterPlease,
      showCourseTitlesSuggestions,

      schoolName,
      schoolNamesSuggestions,
    } = this.state;

    return (
      <div className="searchQuizDiv">
        <div className="searchQuizDivInnerWrapper">
          {/* <div className="searchQuizSpinner">
                    <SpinnerDelayed isLoading={true}/>
                </div> */}
          {!isEmpty(fieldsOfStudyList) ? (
            <div>
              <h1 className="createQuizHeader searchQuizHeader">Search quizzes</h1>
              <form onClick={this.blurAllSuggestions} className="searchFormDiv" onSubmit={this.searchQuizzes}>
                {/* <h4 className="quizSearchHeader">Quiz Search</h4> */}

                {/* Course Code */}
                <label className="inputLabel">Course Code</label>
                <div className="courseCodeDiv">
                  <div className="courseCodeDivWrapper">
                    <div className="inputAndErrorDiv">
                      <input
                        onKeyDown={this.moveFocus}
                        ref={this.courseCodeLettersSuggestionInput}
                        className="courseCodeLettersSuggestionInput"
                        tabIndex="2"
                        onChange={this.getCourseCodeLettersSuggestions}
                        id="courseCodeLetters"
                        name="courseCodeLetters"
                        placeholder="e.g. CS"
                        maxLength={10}
                        autoComplete="off"
                        onBlur={this.courseCodeLettersOnBlur}
                        // type="text"
                        // pattern="[A-Za-z]{0,10}"
                        // title="Up to 10 letters"
                      ></input>

                      {/* Button for closing letter suggestions: Decided it serves no purpose for now. */}
                      {/* <div className={classnames("closeLetterSuggestions", {
                                    'visible': courseCodeLetters && courseCodeLetters.length > 0
                                })}></div> */}

                      {courseCodeLetters ? (
                        <ul
                          ref={this.courseCodeLettersSuggestions}
                          onKeyDown={this.moveFocus}
                          className={classnames("courseCodeLettersSuggestions", {
                            "courseCodeLettersSuggestionsVisible": showCourseCodeLettersSuggestions === true,
                          })}
                        >
                          {
                            // need to fix "index" for key, should be a proper _id coming from server instead
                            this.filterCourseCodeLettersSuggestions(courseCodeSuggestions).map(
                              function (courseCodeSuggestion, index) {
                                if (index === 0) {
                                  return (
                                    <li
                                      onClick={this.selectCodeLetterSuggestionClick}
                                      onKeyDown={this.selectCodeLetterSuggestionEnter}
                                      index={index}
                                      tabIndex="3"
                                      key={courseCodeSuggestion.id}
                                    >
                                      {courseCodeSuggestion.letters}
                                    </li>
                                  );
                                }
                                return (
                                  <li
                                    onClick={this.selectCodeLetterSuggestionClick}
                                    onKeyDown={this.selectCodeLetterSuggestionEnter}
                                    index={index}
                                    tabIndex="-1"
                                    key={courseCodeSuggestion.id}
                                  >
                                    {courseCodeSuggestion.letters}
                                  </li>
                                );
                              }.bind(this)
                            )
                          }
                        </ul>
                      ) : null}
                      {errors.courseCodeLetters ? <span className="errorSpan">{errors.courseCodeLetters}</span> : null}
                    </div>
                    <span className="dash">-</span>
                    <div className="inputAndErrorDiv">
                      <input
                        // disabled={courseCodeLetters && courseCodeLetters.length === 0}
                        disabled={courseCodeLetters.length === 0}
                        onKeyDown={this.moveFocus}
                        ref={this.courseCodeDigitsSuggestionInput}
                        tabIndex="4"
                        onChange={this.getCourseCodeDigitsSuggestions}
                        id="courseCodeDigits"
                        name="courseCodeDigits"
                        className="courseCodeDigitsSuggestionInput"
                        placeholder="e.g. 355"
                        maxLength={5}
                        autoComplete="off"
                        onBlur={this.courseCodeDigitsOnBlur}
                        // type="text"
                        // pattern="[0-9]{0,5}"
                        // title="Up to 5 digits"
                      ></input>

                      {courseCodeDigits ? (
                        <ul
                          ref={this.courseCodeDigitsSuggestions}
                          onKeyDown={this.moveFocus}
                          className={classnames("courseCodeDigitsSuggestions", {
                            "courseCodeDigitsSuggestionsVisible": showCourseCodeDigitsSuggestions === true,
                          })}
                        >
                          {
                            // need to fix "index" for key, should be a proper _id coming from server instead
                            this.filterCourseCodeDigitsSuggestions(courseCodeSuggestions).map(
                              function (courseCodeSuggestion, index) {
                                if (index === 0) {
                                  return (
                                    <li
                                      onClick={this.selectCodeDigitSuggestionClick}
                                      onKeyDown={this.selectCodeDigitSuggestionEnter}
                                      tabIndex="5"
                                      index={index}
                                      key={courseCodeSuggestion.id}
                                    >
                                      {courseCodeSuggestion.digits}
                                    </li>
                                  );
                                }
                                return (
                                  <li
                                    onClick={this.selectCodeDigitSuggestionClick}
                                    onKeyDown={this.selectCodeDigitSuggestionEnter}
                                    tabIndex="-1"
                                    index={index}
                                    key={courseCodeSuggestion.id}
                                  >
                                    {courseCodeSuggestion.digits}
                                  </li>
                                );
                              }.bind(this)
                            )
                          }
                        </ul>
                      ) : null}

                      {errors.courseCodeDigits ? <span className="errorSpan">{errors.courseCodeDigits}</span> : null}
                    </div>
                  </div>
                  {courseCodeMainError ? <div className="errorSpan">Can't leave one field empty!</div> : null}
                </div>

                {/* Course Title */}
                <label className="inputLabel">Course Title</label>
                <div className="inputAndErrorDiv">
                  <input
                    disabled={courseCodeDigits.length === 0}
                    tabIndex="6"
                    onChange={this.getCourseTitlesSuggestions}
                    onKeyDown={this.moveFocus}
                    name="courseTitle"
                    ref={this.courseTitleInput}
                    className="courseTitleInput"
                    placeholder="e.g. Internet and Web Technologies"
                    maxLength={50}
                    autoComplete="off"
                  ></input>
                  <span
                    className={classnames("courseTitleCountLeft", {
                      "courseTitleCountLeftVisible": courseTitleCountLeft < 50,
                    })}
                    style={{ color: "lightgray" }}
                  >
                    {courseTitleCountLeft}
                  </span>

                  {courseTitle ? (
                    <ul
                      ref={this.courseTitlesSuggestions}
                      onKeyDown={this.moveFocus}
                      className={classnames("courseTitlesSuggestions", {
                        "courseTitlesSuggestionsVisible": showCourseTitlesSuggestions === true,
                      })}
                    >
                      {
                        // need to fix "index" for key, should be a proper _id coming from server instead
                        this.filterCourseTitlesSuggestions(courseCodeSuggestions).map(
                          function (courseTitleSuggestion, index) {
                            if (index === 0) {
                              return (
                                <li
                                  onClick={this.selectCourseTitleSuggestionClick}
                                  onKeyDown={this.selectCourseTitleSuggestionEnter}
                                  tabIndex="7"
                                  index={index}
                                  key={courseTitleSuggestion.id}
                                >
                                  {courseTitleSuggestion.title}
                                </li>
                              );
                            }
                            return (
                              <li
                                onClick={this.selectCourseTitleSuggestionClick}
                                onKeyDown={this.selectCourseTitleSuggestionEnter}
                                tabIndex="-1"
                                index={index}
                                key={courseTitleSuggestion.id}
                              >
                                {courseTitleSuggestion.title}
                              </li>
                            );
                          }.bind(this)
                        )
                      }
                    </ul>
                  ) : null}
                </div>

                {/* Fields of study */}
                {/* {fieldsOfStudyList.length > 0 ? */}
                <div className="inputAndErrorDiv fieldsOfStudy">
                  <label className="inputLabel fieldOfStudy">Field of Study</label>
                  <select
                    ref={this.selectFieldOfStudyRef}
                    className="selectFieldsOfStudy"
                    onChange={function (e) {
                      this.setState({ fieldOfStudy: e.target.value });
                    }.bind(this)}
                    tabIndex="8"
                    name="fieldsofstudy"
                  >
                    <option value=""></option>
                    {fieldsOfStudyList.map(function (field, index) {
                      return (
                        <option value={field.name} key={field._id}>
                          {field.name}
                        </option>
                      );
                    })}
                  </select>
                </div>
                {/* // : null} */}

                {/* School name */}
                <div className="inputAndErrorDiv">
                  <label className="inputLabel school">School</label>
                  <input
                    className="schoolNameInput"
                    ref={this.schoolNameInput}
                    tabIndex="9"
                    onChange={this.getSchoolNamesSuggestions}
                    onKeyDown={this.moveFocus}
                    name="schoolName"
                    placeholder="e.g. Queens College"
                    maxLength={60}
                    autoComplete="off"
                  ></input>
                  {/* {true ?
                            <span style={{ color: 'red' }}>Username not found</span> : null} */}

                  {schoolName ? (
                    <ul
                      ref={this.schoolNamesSuggestions}
                      onKeyDown={this.moveFocus}
                      className={classnames("schoolNamesSuggestions", {
                        "schoolNamesSuggestionsVisible": showSchoolNamesSuggestions === true,
                      })}
                    >
                      {
                        // need to fix "index" for key, should be a proper _id coming from server instead
                        this.filterSchoolNamesSuggestions(schoolNamesSuggestions).map(
                          function (schoolNamesSuggestion, index) {
                            if (index === 0) {
                              return (
                                <li
                                  onClick={this.selectSchoolNameSuggestionClick}
                                  onKeyDown={this.selectSchoolNameSuggestionEnter}
                                  tabIndex="10"
                                  index={index}
                                  key={schoolNamesSuggestion.id}
                                >
                                  {schoolNamesSuggestion.name}
                                </li>
                              );
                            }
                            return (
                              <li
                                onClick={this.selectSchoolNameSuggestionClick}
                                onKeyDown={this.selectSchoolNameSuggestionEnter}
                                tabIndex="-1"
                                index={index}
                                key={schoolNamesSuggestion.id}
                              >
                                {schoolNamesSuggestion.name}
                              </li>
                            );
                          }.bind(this)
                        )
                      }
                    </ul>
                  ) : null}
                </div>

                {/* Course Term */}
                <label className="inputLabel term">Term</label>
                <div className="termSelectDiv">
                  <select
                    ref={this.courseTermSeasonInput}
                    onChange={function (e) {
                      this.setState({ courseTermSeason: e.target.value });
                    }.bind(this)}
                    name="termSeasons"
                    tabIndex="11"
                  >
                    <option value="Season" style={{ color: "gray" }}>
                      Season
                    </option>
                    <option value="Spring">Spring</option>
                    <option value="Summer">Summer</option>
                    <option value="Fall">Fall</option>
                    <option value="Winter">Winter</option>
                  </select>
                  <select
                    ref={this.courseTermYearInput}
                    onChange={function (e) {
                      this.setState({ courseTermYear: e.target.value });
                    }.bind(this)}
                    name="termYears"
                    tabIndex="12"
                  >
                    <option value="Year" style={{ color: "gray" }}>
                      Year
                    </option>
                    <option value="2019">2019</option>
                    <option value="2018">2018</option>
                    <option value="2017">2017</option>
                    <option value="2016">2016</option>
                    <option value="2015">2015</option>
                    <option value="2014">2014</option>
                    <option value="2013">2013</option>
                    <option value="2012">2012</option>
                    <option value="2011">2011</option>
                    <option value="2010">2010</option>
                  </select>
                </div>

                {/* Quiz Maker's Name */}
                <div className="inputAndErrorDiv">
                  <label className="inputLabel quizCreatorName">Quiz maker's username</label>
                  <input
                    ref={this.quizCreatorNameInput}
                    onChange={this.onChange}
                    name="quizCreatorName"
                    tabIndex="13"
                    placeholder="e.g. le_quiz_maker"
                    maxLength={30}
                    autoComplete="off"
                  ></input>
                  {/* {true ?
                                            <span className="usernameNotFound">Username not found</span> : null} */}
                </div>

                {/* Quiz Searchable ID */}
                <div className="inputAndErrorDiv">
                  <label className="inputLabel quizCreatorName">Quiz ID</label>
                  <input
                    ref={this.quizSearchableIdInput}
                    onChange={this.onChange}
                    name="searchableId"
                    tabIndex="14"
                    // placeholder="e.g. le_quiz_maker"
                    maxLength={30}
                    autoComplete="off"
                  ></input>
                  {/* {true ?
                                            <span className="usernameNotFound">Username not found</span> : null} */}
                </div>
                {showChooseOneParameterPlease ? (
                  <span className="errorSpan showChooseOneParameterPlease">
                    <img className="answerAllErrorImage" src="/images/warning.svg" alt="Attention"></img>
                    <p>Please fill out at least one field</p>
                  </span>
                ) : null}
                <button className="submitBtn">Search</button>
                {isSearching === true ? (
                  <div className="quizSearchSpinnerDiv">
                    <SpinnerDelayed isLoading={true} />
                  </div>
                ) : isSearching === false ? null : (
                  <div className="noResultsFoundWrapperDiv">
                    <p className="errorSpan noResultsFound">No quizzes were found matching search criteria</p>
                  </div>
                )}
              </form>
            </div>
          ) : (
            <div className="searchQuizSpinner">
              <SpinnerDelayed isLoading={true} />
            </div>
          )}
        </div>
      </div>
    );
  }

  componentDidMount() {
    // The commented code below pertains to the postponed Friends feature

    // this.socketStuff();

    // this.props.navbarShouldUpdate(true);

    // const getReceivedRequests = this.props.getRequests();
    // var getReceivedRequestsPromise = function () {
    //     getReceivedRequests
    //         .then(function (fulfilled) {
    //             // console.log("promise getReceivedRequests success: ", fulfilled);
    //             var receivedFriendRequests = fulfilled;
    //             receivedFriendRequests = receivedFriendRequests.map(function (elt) {
    //                 return elt._id.toString();
    //             });

    //             this.setState({ receivedFriendRequests });
    //         }.bind(this))
    //         .catch(function (error) {
    //             console.log("promise error: ", error);
    //         });
    // }.bind(this);
    // getReceivedRequestsPromise();

    // const getSentRequests = this.props.getSentRequests();
    // var getSentRequestsPromise = function () {
    //     getSentRequests
    //         .then(function (fulfilled) {
    //             // console.log("promise getSentRequests success: ", fulfilled);
    //             var sentFriendRequests = fulfilled;
    //             sentFriendRequests = sentFriendRequests.map(function (elt) {
    //                 return elt._id.toString();
    //             });

    //             this.setState({ sentFriendRequests });
    //         }.bind(this))
    //         .catch(function (error) {
    //             console.log("promise error: ", error);
    //         });
    // }.bind(this);
    // getSentRequestsPromise();

    // this.props.getFriends();

    // const mFunc = this.props.getFriends();
    // var mPromise = function () {
    //     mFunc
    //         .then(function (fulfilled) {
    //             console.log("promise success: ", fulfilled);
    //             // this.setState({ friendRequestsNames: fulfilled });
    //             this.setState({ friendList: fulfilled });
    //         }.bind(this))
    //         .catch(function (error) {
    //             console.log("promise error: ", error);
    //         });
    // }.bind(this);
    // mPromise();

    if (isEmpty(this.props.quizzes.fieldsOfStudyList)) {
      // console.log("getting majors");
      const mFunc = this.props.getMajors();
      var mPromise = function () {
        mFunc
          .then(
            function (fulfilled) {
              // console.log("got majors: ", fulfilled.data);
              this.loadParams();
            }.bind(this)
          )
          .catch(function (error) {
            console.log("failed to get majors: ");
          });
      }.bind(this);
      mPromise();
    } else {
      // console.log("majors already in redux");
      this.setState(
        { fieldsOfStudyList: this.props.quizzes.fieldsOfStudyList },
        function () {
          this.loadParams();
        }.bind(this)
      );
    }
  }

  loadParams() {
    var params = new URLSearchParams(this.props.location.search);
    // console.log("test params: ", params);

    const quizTerm = {
      season: params.get("qs"),
      year: params.get("qy"),
    };

    const quizCreatorName = params.get("qmn");
    const searchableId = params.get("qsid");

    const quizData = {
      courseId: params.get("cid"),
      majorId: params.get("mid"),
      schoolId: params.get("sid"),
    };

    // console.log("quizData:", quizData);

    if (!isEmpty(quizCreatorName)) this.setState({ initialQuizCreatorName: quizCreatorName });
    if (!isEmpty(searchableId)) this.setState({ initialSearchableId: searchableId });

    axios
      .post("/api/quizzes/getsearchparams/", quizData)
      .then(
        function (res) {
          if (!isEmpty(res.data)) {
            var items = res.data;
            // console.log("items: ", items);
            try {
              if (!isEmpty(items.course)) this.setState({ paramCourse: items.course });
              if (!isEmpty(items.major)) this.setState({ initialMajorName: items.major.name });
              if (!isEmpty(items.school)) this.setState({ paramSchool: items.school });
              if (!isEmpty(quizTerm.season)) this.setState({ initialTermSeason: quizTerm.season });
              if (!isEmpty(quizTerm.year)) this.setState({ initialTermYear: quizTerm.year });
            } catch (err) {}
          }
        }.bind(this)
      )
      .catch(function (err) {});
  }

  componentDidUpdate(nextProps, prevState) {
    // console.log("ccc componentDidUpdate nextProps: ", nextProps.requests);
    // console.log("derived componentDidUpdate prevState: ", prevState.friendList);

    // console.log("componentDidUpdate nextProps:", nextProps.quizzes.quizzes);
    // console.log("componentDidUpdate prevState:", prevState);

    if (!isEmpty(prevState.paramCourse)) {
      // console.log("paramCourse: ", prevState.paramCourse);
      try {
        this.courseCodeLettersSuggestionInput.current.value = prevState.paramCourse.code.letters;
        this.courseCodeDigitsSuggestionInput.current.value = prevState.paramCourse.code.digits;
        this.courseTitleInput.current.value = prevState.paramCourse.title;

        this.setState(
          {
            paramCourseId: prevState.paramCourse._id,
            courseCodeLetters: prevState.paramCourse.code.letters,
            courseCodeDigits: prevState.paramCourse.code.digits,
            courseTitle: prevState.paramCourse.title,
          },
          function () {
            this.setState({ paramCourse: undefined });
          }.bind(this)
        );
      } catch (err) {}
    }
    if (!isEmpty(prevState.initialMajorName)) {
      try {
        this.selectFieldOfStudyRef.current.value = prevState.initialMajorName;
        this.setState({ fieldOfStudy: prevState.initialMajorName, initialMajorName: undefined });
      } catch (err) {}
    }
    if (!isEmpty(prevState.paramSchool)) {
      try {
        this.schoolNameInput.current.value = prevState.paramSchool.name;
        // this.setState({ schoolName: prevState.paramSchool, paramSchool: undefined });
        this.setState({ initialSchool: prevState.paramSchool, schoolName: prevState.paramSchool.name, paramSchool: undefined });
      } catch (err) {}
    }
    if (!isEmpty(prevState.initialTermYear)) {
      try {
        this.courseTermYearInput.current.value = prevState.initialTermYear;
        this.setState({ courseTermYear: prevState.initialTermYear, initialTermYear: undefined });
      } catch (err) {}
    }
    if (!isEmpty(prevState.initialTermSeason)) {
      try {
        this.courseTermSeasonInput.current.value = prevState.initialTermSeason;
        this.setState({ courseTermSeason: prevState.initialTermSeason, initialTermSeason: undefined });
      } catch (err) {}
    }
    if (!isEmpty(prevState.initialQuizCreatorName)) {
      try {
        this.quizCreatorNameInput.current.value = prevState.initialQuizCreatorName;
        this.setState({ quizCreatorName: prevState.initialQuizCreatorName, initialQuizCreatorName: undefined });
      } catch (err) {}
    }
    if (!isEmpty(prevState.initialSearchableId)) {
      try {
        this.quizSearchableIdInput.current.value = prevState.initialSearchableId;
        this.setState({ searchableId: prevState.initialSearchableId, initialSearchableId: undefined });
      } catch (err) {}
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    try {
      // console.log("getDerivedStateFromProps INITIATING");

      // console.log("prevState: ", prevState.friendList);
      // console.log("ccc derived nextProps: ", nextProps.requests);

      // var friendList = [];
      // if (nextProps.requests.friends.length > 0) {
      //     friendList = nextProps.requests.friends;
      //     friendList.sort(function (a, b) {
      //         if (isEmpty(a.username) || isEmpty(b.username)) return 0;
      //         var x = a.username.toLowerCase();
      //         var y = b.username.toLowerCase();
      //         if (x < y) { return -1; }
      //         if (x > y) { return 1; }
      //         return 0;
      //     });

      //     function compareFriendsArrays(a, b) {
      //         // console.log("derived a: ", a);
      //         // console.log("derived b: ", b);
      //         if (a.length !== b.length) return false;

      //         else {
      //             for (var i = 0; i < a.length; i++) {
      //                 if (a[i].id !== b[i].id) {
      //                     return false;
      //                 }
      //             }
      //         }

      //         return true;
      //     }

      //     if (!compareFriendsArrays(friendList, prevState.friendList)) {
      //         return {
      //             friendList: friendList
      //         }
      //     }
      // }

      // console.log("before derived updated fieldsOfStudyList ");
      //  compare fieldsOfStudyList
      if (
        !isEmpty(nextProps.quizzes.fieldsOfStudyList) &&
        nextProps.quizzes.fieldsOfStudyList.length !== prevState.fieldsOfStudyList.length
      ) {
        // console.log("derived updated fieldsOfStudyList ");
        return {
          fieldsOfStudyList: nextProps.quizzes.fieldsOfStudyList,
        };
      }
    } catch (err) {
      console.log("derived err: ", err);
    }

    return null;
  }

  componentWillUnmount() {
    // const { socket } = this.props;
    // socket.disconnect();
  }

  // connectSocket = () => {
  // connectSocket() {
  //     const socket = io(socketUrl);
  //     socket.on('connect', function () {
  //         console.log("Socket connected from SearchQuiz.js (client)", socket);
  //     });

  //     this.setState({ socket });
  // }

  // disconnectSocket = () => {
  // disconnectSocket() {
  //     const { socket } = this.state;
  //     socket.disconnect();
  //     console.log("socket disconnected: ", socket);
  // }
  // socketStuff() {
  //     return;

  //     const { auth } = this.props;
  //     var { socket } = this.props;
  //     console.log("SearchQuiz calling socketStuff()");

  //     // console.log("socket: ", socket);
  //     // if (socket === null || socket === undefined || (socket && socket.disconnected)) {
  //     //     console.log("socket before disconnect (SearchQuiz)", socket);
  //     //     socket.disconnect();
  //     //     console.log("Socket was not received from props");
  //     //     socket = io(socketUrl);
  //     //     console.log("socket after disconnect (SearchQuiz)", socket);
  //     //     socket.on('connect', function () {
  //     //         console.log("Socket connected from SearchQuiz (client)", socket);
  //     //     });

  //     //     this.setState({ socket });
  //     // } else {
  //     //     console.log("Socket received from props", socket);
  //     // }

  //     // this.props.setSocket(socket);

  //     // if (socket.connected === true) {
  //     //     console.log("socket connected = true");
  //     socket.emit('addConnectedUser', auth);
  //     // } else {
  //     //     console.log("socket connected = false");
  //     // }

  //     socket.on('newMessage', this.addToList);

  //     // socket.on('createMessage', this.addToList);
  //     socket.on('createMessage', function (data) {
  //         this.addToList(data);
  //     }.bind(this));

  //     socket.on('updateConnectedUsersList', this.updateConnectedUsersList);
  //     // socket.on('updateConnectedUsersList', function (data) {
  //     //     console.log("connected sockets: ", data);
  //     // });

  //     // socket.on('receiveUpdateRequests', function (data) {
  //     //     console.log("receive: ", data);
  //     // });

  //     socket.on('updateFriendsList', this.updateFriendsList);

  // }

  // updateFriendsList() {
  //     axios.get('api/users/friendslist')
  //         .then(res => this.setState({ updateFriendsList: res.data }))
  //         .catch(err => console.log("Error loading friends list: ", err.response.data));
  // }

  // updateConnectedUsersList = (users) => {
  // updateConnectedUsersList(users) {
  //     console.log("SearchQuiz calling updateConnectedUsersList");
  //     const { user } = this.props.auth;

  //     // Need to check if updated is same or not.

  //     // sort the newly received array ('users' paramter)
  //     let newArray = Object.assign([], users);

  //     console.log("newArray: ", newArray);

  //     try {

  //         newArray.sort(function (a, b) {
  //             var x = a.username.toLowerCase();
  //             var y = b.username.toLowerCase();
  //             if (x < y) { return -1; }
  //             if (x > y) { return 1; }
  //             return 0;
  //         });
  //     } catch (err) {
  //         // no username, only socketid.
  //     }

  //     // console.log("new array: ", newArray);

  //     // sort the already-existing array which is stored in state
  //     let arrayInState = this.state.connectedUsersList;

  //     console.log("arrayInState: ", arrayInState);
  //     try {

  //         arrayInState.sort(function (a, b) {
  //             var x = a.username.toLowerCase();
  //             var y = b.username.toLowerCase();
  //             if (x < y) { return -1; }
  //             if (x > y) { return 1; }
  //             return 0;
  //         });
  //     } catch (err) {
  //         // no username, only socketid
  //     }
  //     if (!this.compareArrays(newArray, arrayInState)) {

  //         newArray = newArray.filter(function (elt) { return elt.id !== user.id });

  //         this.setState({ connectedUsersList: newArray });
  //         // console.log("connected users list updated");
  //     } else {
  //         // console.log("connected users list did not need to be updated");
  //     }

  // }

  compareArrays(a, b) {
    if (a.length !== b.length) return false;
    else {
      for (var i = 0; i < a.length; i++) {
        if (a[i].id !== b[i].id) {
          return false;
        } else if (a[i].socketid !== b[i].socketid) {
          return false;
        }
      }
    }

    return true;
  }

  // addToList(newData) {
  //     // console.log("newData: ", newData);
  //     if (!newData) return;

  //     newData.id = this.state.someList.length + 1;
  //     var list = this.state.someList;
  //     list.push(newData);
  //     this.setState({ someList: list });
  // }

  onSubmit(e) {
    e.preventDefalt();
  }

  onChange(e) {
    let { courseTitleCountLeft } = this.state;

    this.setState(
      { [e.target.name]: e.target.value },
      function (eventTargetName) {
        if (eventTargetName === "courseTitle") {
          this.setState({ courseTitleCountLeft: 50 - this.state.courseTitle.length });
        }
      }.bind(this, e.target.name)
    );
  }

  // getSocketNumber() {
  //     const { socket } = this.props;

  //     socket.emit('socketCount', function (data) {
  //         console.log("socketCount: ", data);
  //     })
  // }

  // sendFriendRequest(recipientId, socketId) {

  //     // // console.log("User ID: ", recipientId);

  //     // const { socket } = this.props;
  //     // var { auth } = this.props;

  //     // var recipientId = { recipientId };

  //     // axios.post('api/users/sendfriendrequest', recipientId)
  //     //     .then(res => {
  //     //         socket.emit('sendUpdateRequests', socketId);
  //     //         // console.log(res.data);

  //     //         var sentFriendRequests = res.data;
  //     //         sentFriendRequests = sentFriendRequests.map(function (elt) {
  //     //             return elt._id.toString();
  //     //         });

  //     //         this.setState({ sentFriendRequests });
  //     //     })
  //     //     .catch(err => console.log(err.response.data));

  //     // // const mFunc = this.props.createFriendRequest({ "recipient": id });
  //     // // var mPromise = function () {
  //     // //     mFunc
  //     // //         .then(function (fulfilled) {
  //     // //             console.log("promise success: ", fulfilled);
  //     // //             // socket.emit()

  //     // //             axios.get('api/users/updaterequests')
  //     // //                 .then(res => {
  //     // //                     socket.emit('sendUpdateRequests', id);
  //     // //                 })
  //     // //                 .catch(err => console.log(err));

  //     // //         })
  //     // //         .catch(function (error) {
  //     // //             console.log("promise error: ", error);
  //     // //         });
  //     // // };

  //     // // mPromise();

  //     // // console.log("freq: ", this.props.createFriendRequest(id));

  // }

  searchQuizzes(e) {
    e.preventDefault();

    this.setState({ courseCodeMainError: false, errors: {} });

    var {
      errors,
      courseTitle,
      courseCodeDigits,
      courseCodeLetters,
      fieldOfStudy,
      schoolName,
      courseTermSeason,
      courseTermYear,
      quizCreatorName,
      courseCodeSuggestions,
      fieldsOfStudyList,
      schoolNamesSuggestions,
      searchableId,
    } = this.state;

    if (courseCodeDigits && !courseCodeLetters) {
      this.setState({ courseCodeMainError: true });
      return;
    } else if (courseCodeLetters && !courseCodeDigits) {
      this.setState({ courseCodeMainError: true });
      return;
    }

    /*
            List of all search elements:
            courseTitle, courseCodeDigits, courseCodeLetters, fieldOfStudy,
            schoolName, courseTermSeason, courseTermYear, quizCreatorName.
        */

    // If neither element is selected, prompt the user to make at least one search parameter!!1
    if (
      !searchableId &&
      !courseTitle &&
      !courseCodeDigits &&
      !courseCodeLetters &&
      !fieldOfStudy &&
      !schoolName &&
      (!courseTermSeason || courseTermSeason === "Season") &&
      (!courseTermYear || courseTermYear === "Year") &&
      !quizCreatorName
    ) {
      this.setState({ showChooseOneParameterPlease: true });
      return;
    } else {
      this.setState({ showChooseOneParameterPlease: false });
    }

    // Selected course logic:
    var selectedCourseId = "";

    var letterRegex = new RegExp(courseCodeLetters, "ig");
    var digitRegex = new RegExp(courseCodeDigits, "ig");
    var titleRegex = new RegExp(courseTitle, "ig");

    if (courseCodeSuggestions.length > 0 && courseCodeLetters.length > 0 && courseCodeDigits.length > 0) {
      var exactCourse = courseCodeSuggestions.filter(function (course) {
        if (courseTitle.length > 0) {
          return course.letters.match(letterRegex) && course.digits.match(digitRegex) && course.title.match(titleRegex);
        } else return course.letters.match(letterRegex) && course.digits.match(digitRegex);
      });

      if (exactCourse.length > 0) {
        // console.log("exactCourse: ", exactCourse);
        if (!this.state.selectedCourse) {
          // this.setState({ selectedCourse: exactCourse[0] });
          // console.log("exactCourse: ", exactCourse[0]);
          selectedCourseId = exactCourse[0].id;
        }
        if (!this.state.selectedCourseWithTitle && courseTitle.length > 0) {
          // this.setState({ selectedCourseWithTitle: exactCourse[0] });
          // console.log("exactCourseWithTitle: ", exactCourse[0]);
          selectedCourseId = exactCourse[0].id;
        }
      } else {
        // console.log("exactCourse: not yet.. ");
      }
    } else if (!isEmpty(this.state.paramCourseId)) {
      selectedCourseId = this.state.paramCourseId;
    }

    // Selected Field of Study logic:
    var selectedFieldOfStudyId = "";
    if (!isEmpty(fieldOfStudy)) {
      selectedFieldOfStudyId =
        fieldsOfStudyList[
          fieldsOfStudyList
            .map(function (field) {
              return field.name;
            })
            .indexOf(fieldOfStudy)
        ]._id;
    }
    // console.log("exactField", selectedFieldOfStudyId);

    // Selected School logic:
    var selectedSchoolId = "";
    if (!isEmpty(schoolName) && schoolNamesSuggestions.length > 0) {
      // console.log("school name: ", schoolName);
      // selectedSchoolId = schoolNamesSuggestions[schoolNamesSuggestions.map(function (school) { return school.name }).indexOf(schoolName)].id;
      var schoolIdIndex = schoolNamesSuggestions
        .map(function (school) {
          return school.name;
        })
        .indexOf(schoolName);
      if (schoolIdIndex !== -1) {
        selectedSchoolId = schoolNamesSuggestions[schoolIdIndex].id;
      }
    } else if (!isEmpty(this.state.initialSchool)) {
      if (!isEmpty(schoolName)) {
        selectedSchoolId = this.state.initialSchool._id;
      }
    }
    // console.log("exactSchool", selectedSchoolId);

    if (courseTermSeason === "Season") {
      courseTermSeason = "";
    }

    if (courseTermYear === "Year") {
      courseTermYear = "";
    }

    var quizTerm = {
      season: courseTermSeason,
      year: courseTermYear,
    };

    const quizData = {
      courseId: selectedCourseId,
      majorId: selectedFieldOfStudyId,
      schoolId: selectedSchoolId,
      quizTerm,
      quizCreatorName,
      searchableId,
    };

    // console.log("quiz data SearchQuiz: ", quizData);

    const searchQuizzesFunc = this.props.searchQuizzes(quizData);
    var searchQuizzesPromise = function () {
      searchQuizzesFunc
        .then(
          function (fulfilled) {
            this.setState(
              { isSearching: false },
              function () {
                if (isEmpty(fulfilled)) this.setState({ isSearching: null });
              }.bind(this)
            );
            // console.log("promise success: ", fulfilled);
            if (fulfilled && fulfilled.length > 0) {
              var query = "?";
              if (!isEmpty(selectedCourseId)) query += "cid=" + selectedCourseId;
              if (!isEmpty(selectedFieldOfStudyId)) {
                if (query === "?") query += "mid=" + selectedFieldOfStudyId;
                else query += "&mid=" + selectedFieldOfStudyId;
              }

              if (!isEmpty(selectedSchoolId)) {
                if (query === "?") query += "sid=" + selectedSchoolId;
                else query += "&sid=" + selectedSchoolId;
              }

              if (!isEmpty(quizTerm.season)) {
                if (query === "?") query += "qs=" + quizTerm.season;
                else query += "&qs=" + quizTerm.season;
              }
              if (!isEmpty(quizTerm.year)) {
                if (query === "?") query += "qy=" + quizTerm.year;
                else query += "&qy=" + quizTerm.year;
              }
              if (!isEmpty(quizCreatorName)) {
                if (query === "?") query += "qmn=" + quizCreatorName;
                else query += "&qmn=" + quizCreatorName;
              }
              if (!isEmpty(searchableId)) {
                if (query === "?") query += "qsid=" + searchableId;
                else query += "&qsid=" + searchableId;
              }
              this.props.history.push(`/quizzes${query}`);
            }
          }.bind(this)
        )
        .catch(
          function (error) {
            this.setState({ isSearching: false });
            // console.log("promise error: ", error);
          }.bind(this)
        );
    }.bind(this);

    searchQuizzesPromise();
    this.setState({ isSearching: true });

    // axios.post('/api/quizzes/searchquizzes/', quizData)
    //     .then(res => {
    //         console.log("quizzes: ", res.data);
    //     })
    //     .catch(err => {
    //         // console.log("quizzes errors: ", err.response.data);
    //         this.setState({ errors: err.response.data });
    //     })
  }

  getCourseCodeLettersSuggestions(e) {
    if (this.state.courseCodeMainError === true) {
      var { errors } = this.state;
      // errors.courseCodeLetters = '';
      // errors.courseCodeDigits = '';
      this.setState({ courseCodeMainError: false, errors });
    }

    if (this.state.showCourseCodeLettersSuggestions === false) {
      this.setState({ showCourseCodeLettersSuggestions: true });
    }

    var eventTargetValue = e.target.value.trim();
    if (eventTargetValue === "") {
      this.setState({ [e.target.name]: "" });
      e.target.value = "";
      return;
    }

    this.setState(
      { [e.target.name]: eventTargetValue },
      function (eventTargetName) {
        var { courseCodeLetters } = this.state;
        if (courseCodeLetters.length === 1) {
          axios
            .get(`/api/courses/getcourses/${courseCodeLetters}`)
            .then(
              function (res) {
                // console.log("getcourses success: ", res.data);
                this.setState({ courseCodeSuggestions: res.data });
                // return;
              }.bind(this)
            )
            .catch(
              function (err) {
                console.log("getcourses fail: ", err);
                return console.log("getCourseCodeLettersSuggestions ERROR: ", err.response.data);
              }.bind(this)
            );
        }
      }.bind(this, e.target.name)
    );
  }
  getCourseCodeDigitsSuggestions(e) {
    var { errors, courseCodeMainError } = this.state;

    if (
      courseCodeMainError === true ||
      (errors.courseCodeDigits && errors.courseCodeDigits.length > 0) ||
      (errors.courseCodeLetters && errors.courseCodeLetters.length > 0)
    ) {
      // errors.courseCodeLetters = '';
      // errors.courseCodeDigits = '';
      this.setState({ courseCodeMainError: false, errors });
    }

    if (this.state.showCourseCodeDigitsSuggestions === false) {
      this.setState({ showCourseCodeDigitsSuggestions: true });
    }

    var eventTargetValue = e.target.value.trim();
    if (eventTargetValue === "") {
      this.setState({ [e.target.name]: "" });
      e.target.value = "";
      return;
    }
    // return;
    this.setState({ [e.target.name]: eventTargetValue });
    //     , function (eventTargetName) {
    //     var { courseCodeLetters } = this.state;
    //     if (courseCodeLetters.length === 1) {
    //         axios.get(`/api/courses/getcourses/${courseCodeLetters}`)
    //             .then(function (res) {
    //                 console.log("getcourses success: ", res.data);
    //                 this.setState({ courseCodeSuggestions: res.data });
    //                 // return;
    //             }.bind(this))
    //             .catch(function (err) {
    //                 console.log("getcourses fail: ", err);
    //                 return console.log("getCourseCodeLettersSuggestions ERROR: ", err.response.data);
    //             }.bind(this))
    //     }

    // }.bind(this, e.target.name));
  }
  getCourseTitlesSuggestions(e) {
    if (this.state.showCourseTitlesSuggestions === false) {
      this.setState({ showCourseTitlesSuggestions: true });
    }

    var eventTargetValue = e.target.value.trim();
    if (eventTargetValue === "") {
      this.setState({ [e.target.name]: "" });
      e.target.value = "";
      return;
    }
    // return;
    this.setState({ [e.target.name]: eventTargetValue });
    //     , function (eventTargetName) {
    //     var { courseCodeLetters } = this.state;
    //     if (courseCodeLetters.length === 1) {
    //         axios.get(`/api/courses/getcourses/${courseCodeLetters}`)
    //             .then(function (res) {
    //                 console.log("getcourses success: ", res.data);
    //                 this.setState({ courseCodeSuggestions: res.data });
    //                 // return;
    //             }.bind(this))
    //             .catch(function (err) {
    //                 console.log("getcourses fail: ", err);
    //                 return console.log("getCourseCodeLettersSuggestions ERROR: ", err.response.data);
    //             }.bind(this))
    //     }

    // }.bind(this, e.target.name));
  }
  getSchoolNamesSuggestions(e) {
    if (this.state.showSchoolNamesSuggestions === false) {
      this.setState({ showSchoolNamesSuggestions: true });
    }

    var eventTargetValue = e.target.value.trim();
    if (eventTargetValue === "") {
      this.setState({ [e.target.name]: "" });
      e.target.value = "";
      return;
    }

    this.setState(
      { [e.target.name]: eventTargetValue },
      function (eventTargetName) {
        var { schoolName } = this.state;
        if (schoolName.length === 1) {
          axios
            .get(`/api/schools/getschools/${schoolName}`)
            .then(
              function (res) {
                // console.log("getschools success: ", res.data);
                this.setState({ schoolNamesSuggestions: res.data });
              }.bind(this)
            )
            .catch(
              function (err) {
                console.log("getschools fail: ", err);
                return console.log("getSchoolNamesSuggestions ERROR: ", err.response.data);
              }.bind(this)
            );
        }
      }.bind(this, e.target.name)
    );
  }

  filterCourseCodeLettersSuggestions(courseCodeSuggestions) {
    var { courseCodeLetters } = this.state;

    var returnList = courseCodeSuggestions.filter(function (sug) {
      let regex = new RegExp(courseCodeLetters, "ig");
      return sug.letters.match(regex);
    });

    function removeDuplicates(originalArray, objKey) {
      var trimmedArray = [];
      var values = [];
      var value;

      for (var i = 0; i < originalArray.length; i++) {
        value = originalArray[i][objKey];

        if (values.indexOf(value) === -1) {
          trimmedArray.push(originalArray[i]);
          values.push(value);
        }
      }

      return trimmedArray;
    }

    var returnListNoDuplicates = removeDuplicates(returnList, "letters");
    if (returnListNoDuplicates.length >= 5) {
      returnListNoDuplicates = returnListNoDuplicates.slice(0, 5);
    }

    // return returnList;
    return returnListNoDuplicates;
  }
  filterCourseCodeDigitsSuggestions(courseCodeSuggestions) {
    var { courseCodeDigits } = this.state;
    // console.log("course digits letters: ", courseCodeDigits);
    var returnList = courseCodeSuggestions.filter(function (sug) {
      let regex = new RegExp(courseCodeDigits, "ig");
      return sug.digits.match(regex);
    });

    // console.log("course digits letters before dupl: ", returnList);
    function removeDuplicates(originalArray, objKey) {
      var trimmedArray = [];
      var values = [];
      var value;

      for (var i = 0; i < originalArray.length; i++) {
        value = originalArray[i][objKey];

        if (values.indexOf(value) === -1) {
          trimmedArray.push(originalArray[i]);
          values.push(value);
        }
      }
      return trimmedArray;
    }

    var returnListNoDuplicates = removeDuplicates(returnList, "digits");
    // console.log("course digits letters after dupl: ", returnListNoDuplicates);

    if (returnListNoDuplicates.length >= 5) {
      returnListNoDuplicates = returnListNoDuplicates.slice(0, 5);
    }

    return returnListNoDuplicates;
  }
  filterSchoolNamesSuggestions(schoolNamesSuggestions) {
    var { schoolName } = this.state;
    // console.log("school name: ", schoolName);
    // console.log("filter schoolNamesSuggestions: ", schoolNamesSuggestions);

    var returnList = schoolNamesSuggestions.filter(function (sug) {
      let regex = new RegExp(schoolName, "ig");
      return sug.name.match(regex);
    });

    // console.log("school name before dupl: ", returnList);

    /* 
            Since there shouldn't be school duplicates in the first place, 
            I'll leave this duplicate-removing code commented out for now.
        */

    // function removeDuplicates(originalArray, objKey) {
    //     var trimmedArray = [];
    //     var values = [];
    //     var value;

    //     for (var i = 0; i < originalArray.length; i++) {
    //         value = originalArray[i][objKey];

    //         if (values.indexOf(value) === -1) {
    //             trimmedArray.push(originalArray[i]);
    //             values.push(value);
    //         }
    //     }
    //     return trimmedArray;
    // }

    // var returnListNoDuplicates = removeDuplicates(returnList, 'name');
    // console.log("course digits letters after dupl: ", returnListNoDuplicates);

    // if (returnListNoDuplicates.length >= 5) {
    //     returnListNoDuplicates = returnListNoDuplicates.slice(0, 5);
    // }

    if (returnList.length >= 5) {
      returnList = returnList.slice(0, 5);
    }

    return returnList;
    // return returnListNoDuplicates;
  }
  filterCourseTitlesSuggestions(courseTitlesSuggestions) {
    var { courseTitle, courseCodeLetters, courseCodeDigits } = this.state;
    // console.log("course title: ", courseTitle);
    // console.log("filter courseTitlesSuggestions: ", courseTitlesSuggestions);

    var returnList = courseTitlesSuggestions.filter(function (sug) {
      let regex = new RegExp(courseTitle, "ig");
      return sug.title.match(regex) && sug.digits === courseCodeDigits && sug.letters === courseCodeLetters;
    });

    function removeDuplicates(originalArray, objKey) {
      var trimmedArray = [];
      var values = [];
      var value;

      for (var i = 0; i < originalArray.length; i++) {
        value = originalArray[i][objKey];

        if (values.indexOf(value) === -1) {
          trimmedArray.push(originalArray[i]);
          values.push(value);
        }
      }
      return trimmedArray;
    }

    var returnListNoDuplicates = removeDuplicates(returnList, "title");
    // console.log("course digits letters after dupl: ", returnListNoDuplicates);

    if (returnListNoDuplicates.length >= 5) {
      returnListNoDuplicates = returnListNoDuplicates.slice(0, 5);
    }

    // if (returnList.length >= 5) {
    //     returnList = returnList.slice(0, 5);
    // }

    // return returnList;
    return returnListNoDuplicates;
  }

  moveFocus(e) {
    var sugsLetters = this.courseCodeLettersSuggestions.current;
    var sugsDigits = this.courseCodeDigitsSuggestions.current;
    var sugsSchools = this.schoolNamesSuggestions.current;
    var sugsCourseTitles = this.courseTitlesSuggestions.current;

    if (e.target.name === "courseCodeLetters") {
      this.setState({ initialEventCaller: "courseCodeLetters" });
    } else if (e.target.name === "courseCodeDigits") {
      this.setState({ initialEventCaller: "courseCodeDigits" });
    } else if (e.target.name === "schoolName") {
      this.setState({ initialEventCaller: "schoolName" });
    } else if (e.target.name === "courseTitle") {
      this.setState({ initialEventCaller: "courseTitle" });
    }

    if (e.target.name === "courseCodeLetters") {
      if (sugsLetters && e.keyCode === 40) {
        if (sugsLetters.childNodes.length > 0) {
          e.preventDefault();
          sugsLetters.childNodes[0].focus();
        }
      }
      return;
    } else if (e.target.name === "courseCodeDigits") {
      if (sugsDigits && e.keyCode === 40) {
        if (sugsDigits.childNodes.length > 0) {
          e.preventDefault();
          sugsDigits.childNodes[0].focus();
        }
      }
      return;
    } else if (e.target.name === "schoolName") {
      if (sugsSchools && e.keyCode === 40) {
        if (sugsSchools.childNodes.length > 0) {
          e.preventDefault();
          sugsSchools.childNodes[0].focus();
        }
      }
      return;
    } else if (e.target.name === "courseTitle") {
      if (sugsCourseTitles && e.keyCode === 40) {
        if (sugsCourseTitles.childNodes.length > 0) {
          e.preventDefault();
          sugsCourseTitles.childNodes[0].focus();
        }
      }
      return;
    }

    const active = document.activeElement;

    if (e.keyCode === 40 && active.nextSibling) {
      e.preventDefault();
      active.nextSibling.focus();
    }
    if (e.keyCode === 38) {
      var indexOfElt = active.getAttribute("index");
      // console.log("keydown index: ", indexOfElt);
      if (active.previousSibling) {
        e.preventDefault();
        active.previousSibling.focus();
      } else {
        if (indexOfElt === "0") {
          const { initialEventCaller } = this.state;
          // console.log("eTarget up: ", initialEventCaller);
          var inp;
          if (initialEventCaller === "courseCodeLetters") {
            inp = this.courseCodeLettersSuggestionInput.current;
          } else if (initialEventCaller === "courseCodeDigits") {
            inp = this.courseCodeDigitsSuggestionInput.current;
          } else if (initialEventCaller === "schoolName") {
            inp = this.schoolNameInput.current;
          } else if (initialEventCaller === "courseTitle") {
            inp = this.courseTitleInput.current;
          }
          inp.focus();
          setTimeout(
            function () {
              inp.setSelectionRange(inp.value.length, inp.value.length);
            }.bind(this),
            1
          );
        }
      }
    }
  }

  selectCodeLetterSuggestionEnter(e) {
    var inp = this.courseCodeLettersSuggestionInput.current;
    if (e.keyCode === 13) {
      inp.value = e.target.innerHTML;
      this.setState({ courseCodeLetters: e.target.innerHTML });
      if (this.state.showCourseCodeLettersSuggestions === true) {
        this.setState({ showCourseCodeLettersSuggestions: false });
      }
    }
  }
  selectCodeLetterSuggestionClick(e) {
    var inp = this.courseCodeLettersSuggestionInput.current;
    inp.value = e.target.innerHTML;
    this.setState({ courseCodeLetters: e.target.innerHTML });
    if (this.state.showCourseCodeLettersSuggestions === true) {
      this.setState({ showCourseCodeLettersSuggestions: false });
    }
  }
  selectCodeDigitSuggestionEnter(e) {
    var inp = this.courseCodeDigitsSuggestionInput.current;
    if (e.keyCode === 13) {
      inp.value = e.target.innerHTML;
      this.setState({ courseCodeDigits: e.target.innerHTML });
      if (this.state.showCourseCodeDigitsSuggestions === true) {
        this.setState({ showCourseCodeDigitsSuggestions: false });
      }
    }
  }
  selectCodeDigitSuggestionClick(e) {
    var inp = this.courseCodeDigitsSuggestionInput.current;
    inp.value = e.target.innerHTML;
    this.setState({ courseCodeDigits: e.target.innerHTML });
    if (this.state.showCourseCodeDigitsSuggestions === true) {
      this.setState({ showCourseCodeDigitsSuggestions: false });
    }
  }
  selectSchoolNameSuggestionEnter(e) {
    var inp = this.schoolNameInput.current;
    if (e.keyCode === 13) {
      inp.value = e.target.innerHTML;
      this.setState({ schoolName: e.target.innerHTML });
      if (this.state.showSchoolNamesSuggestions === true) {
        this.setState({ showSchoolNamesSuggestions: false });
      }
    }
  }
  selectSchoolNameSuggestionClick(e) {
    var inp = this.schoolNameInput.current;
    inp.value = e.target.innerHTML;
    this.setState({ schoolName: e.target.innerHTML });
    if (this.state.showSchoolNamesSuggestions === true) {
      this.setState({ showSchoolNamesSuggestions: false });
    }
  }
  selectCourseTitleSuggestionEnter(e) {
    var inp = this.courseTitleInput.current;
    if (e.keyCode === 13) {
      inp.value = e.target.innerHTML;
      this.setState({ courseTitle: e.target.innerHTML });
      if (this.state.showCourseTitlesSuggestions === true) {
        this.setState({ showCourseTitlesSuggestions: false });
      }
    }
  }
  selectCourseTitleSuggestionClick(e) {
    var inp = this.courseTitleInput.current;
    inp.value = e.target.innerHTML;
    this.setState({ courseTitle: e.target.innerHTML });
    if (this.state.showCourseTitlesSuggestions === true) {
      this.setState({ showCourseTitlesSuggestions: false });
    }
  }

  courseCodeLettersOnBlur(e) {
    const { courseCodeLetters, errors } = this.state;
    if (courseCodeLetters.match(new RegExp("[^A-z]"))) {
      errors.courseCodeLetters = "Letters only";
    } else {
      errors.courseCodeLetters = "";
    }
  }

  courseCodeDigitsOnBlur(e) {
    const { courseCodeDigits, errors } = this.state;
    if (courseCodeDigits.match(new RegExp("[^0-9]"))) {
      errors.courseCodeDigits = "Digits only";
    } else {
      errors.courseCodeDigits = "";
    }
  }

  blurAllSuggestions(e) {
    this.setState({
      showCourseCodeLettersSuggestions: false,
      showCourseCodeDigitsSuggestions: false,
      showSchoolNamesSuggestions: false,
      showCourseTitlesSuggestions: false,
    });
  }
}

SearchQuiz.propTypes = {
  // createFriendRequest: PropTypes.func.isRequired,
  // getRequests: PropTypes.func.isRequired,
  // getSentRequests: PropTypes.func.isRequired,
  // getFriends: PropTypes.func.isRequired,
  getMajors: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  // requests: PropTypes.object,
};

// const mapStateToProps = (state) => ({
function mapStateToProps(state) {
  return {
    auth: state.auth,
    requests: state.requests,
    quizzes: state.quizzes,
  };
}

export default connect(mapStateToProps, {
  // createFriendRequest,
  getRequests,
  getFriends,
  getSentRequests,
  searchQuizzes,
  getMajors,
})(SearchQuiz);
