import React, { Component } from "react";
import isEmpty from "../../validation/is-empty";
import "./CreateQuiz.scss";
import Spinner from "../common/Spinner";
import axios from "axios";
import { connect } from "react-redux";
import { getMajors, getTeachers, setQuizDraft, getMyQuizzes, clearMyQuizzes } from "../../actions/quizActions";
import SpinnerDelayed from "../../components/common/SpinnerDelayed";
import PropTypes from "prop-types";
import QuestionItem from "./QuestionItem";
import Tilt from "react-parallax-tilt";
import QuizName from "./CreateQuizComponents/QuizName";
import classNames from "classnames";
import { v4 as generateUniqueID } from "uuid";

const initialState = {
  isLoading: true,
  someList: [],
  connectedUsersList: [],
  friendList: [],
  errors: {},
  sentFriendRequests: [],
  receivedFriendRequests: [],
  courseTitleCountLeft: 50,
  fieldsOfStudyList: [],
  schoolNamesSuggestions: [],
  courseCodeSuggestions: [],
  courseTitlesSuggestions: [],
  teacherNamesSuggestions: [],
  questions: [], // quiz component
  teacher_Name: "", // quiz component
  courseTitle: "", // quiz component
  courseCodeDigits: "", // quiz component
  courseCodeLetters: "", // quiz component
  fieldOfStudy: "", // quiz component
  schoolName: "", // quiz component
  courseTermSeason: "", // quiz component
  courseTermYear: "", // quiz component
  quizCreatorName: "", // quiz component
  quiz_Name: "", // quiz component
  newTimeout: 0,
  newTimeoutAnswer: 0,
  showCourseCodeLettersSuggestions: false,
  showCourseCodeDigitsSuggestions: false,
  showCourseTitlesSuggestions: false,
  showSchoolNamesSuggestions: false,
  showChooseOneParameterPlease: false,
  showTeacherNamesSuggestions: false,
  quizCreated: false,

  quizNameInput: "",
};

export class CreateQuiz extends Component {
  constructor(props) {
    super(props);

    this.state = initialState;

    this.questionOnChange = this.questionOnChange.bind(this);
    this.questionOnChangeKeyDown = this.questionOnChangeKeyDown.bind(this);
    this.answerOnChange = this.answerOnChange.bind(this);
    this.addQuestion = this.addQuestion.bind(this);
    this.addAnswer = this.addAnswer.bind(this);
    this.deleteAnswer = this.deleteAnswer.bind(this);
    this.deleteQuestion = this.deleteQuestion.bind(this);
    this.setCorrectAnswer = this.setCorrectAnswer.bind(this);

    // Quiz associations functions
    this.getCourseCodeLettersSuggestions = this.getCourseCodeLettersSuggestions.bind(this);
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
    this.selectTeacherNamesSuggestionsEnter = this.selectTeacherNamesSuggestionsEnter.bind(this);
    this.selectTeacherNamesSuggestionsClick = this.selectTeacherNamesSuggestionsClick.bind(this);
    this.blurAllSuggestions = this.blurAllSuggestions.bind(this);
    this.blurAllSuggestionsEsc = this.blurAllSuggestionsEsc.bind(this);
    this.blurAllSuggestionsOnTab = this.blurAllSuggestionsOnTab.bind(this);

    this.questionInputOnFocus = this.questionInputOnFocus.bind(this);
    this.questionInputOnBlur = this.questionInputOnBlur.bind(this);

    this.createQuiz = this.createQuiz.bind(this);
    this.saveDraftAndExit = this.saveDraftAndExit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onPasteHandler = this.onPasteHandler.bind(this);
    this.onQuestionImageUpload = this.onQuestionImageUpload.bind(this);
    this.deleteQuestionImage = this.deleteQuestionImage.bind(this);

    //refs
    this.courseCodeLettersSuggestionInput = React.createRef();
    this.courseCodeDigitsSuggestionInput = React.createRef();
    this.courseTitleInput = React.createRef();
    this.schoolNameInput = React.createRef();
    this.courseTermSeasonInput = React.createRef();
    this.courseTermYearInput = React.createRef();
    this.createQuizInnerDiv = React.createRef();
    this.teacherNameInput = React.createRef();
    this.teacherNamesSuggestions = React.createRef();
    this.courseCodeLettersSuggestions = React.createRef();
    this.courseCodeDigitsSuggestions = React.createRef();
    this.courseTitlesSuggestions = React.createRef();
    this.fieldOfStudyRef = React.createRef();
    this.schoolNamesSuggestions = React.createRef();
    this.createQuizQuestionsListOL = React.createRef();
  }

  render() {
    const { questions } = this.state;
    const {
      someList,
      errors,
      connectedUsersList,
      friendList,
      sentFriendRequests,
      receivedFriendRequests,
      courseTitleCountLeft,
      fieldOfStudy,
      fieldsOfStudyList,
      courseCodeMainError,
      courseCodeLetters,
      courseCodeDigits,
      courseCodeSuggestions,
      courseTitlesSuggestions,
      courseTitle,
      isLoading,
      teacher_Name,
      teacherNamesSuggestions,
      courseTermSeason,
      courseTermYear,
      showCourseCodeLettersSuggestions,
      showCourseCodeDigitsSuggestions,
      showSchoolNamesSuggestions,
      showChooseOneParameterPlease,
      showCourseTitlesSuggestions,
      showTeacherNamesSuggestions,
      schoolName,
      schoolNamesSuggestions,
      questionIndexToDelete,
      showConfirmDeleteQuestionWindow,
      isDeletingQuestion,
      draftSaving,
      draftSaved,
    } = this.state;

    return (
      <div className="createQuizDivMain" onKeyDown={this.blurAllSuggestionsEsc} style={{ opacity: 0 }}>
        <div className="createQuizDiv">
          {errors.draft ? (
            <div className="draftErrorDiv">
              <img className="errorImgCreateQuiz" src="/images/warning.svg" alt="Attention"></img>
              <span className="errorSpan draftErrorSpan">{errors.draft}</span>
            </div>
          ) : null}

          {/* {this.state.quizDraft ?
                        <h1>QUIZ DRAFT LOADED</h1> :
                        <h1>NOT YET</h1>
                    } */}

          {!isEmpty(fieldsOfStudyList) ? (
            // {true ?
            <div ref={this.createQuizInnerDiv} className="createQuizInnerDiv">
              <h1 className="createQuizHeader">Create a new Quiz</h1>

              {/* Quiz name, school, major, course  */}
              <form
                onKeyDown={this.blurAllSuggestionsOnTab}
                onClick={this.blurAllSuggestions}
                className="searchFormDiv createQuizSearchFormDiv"
                // onSubmit={this.createQuiz}
              >
                {/* <h4 className="quizSearchHeader">Associations</h4> */}
                <p className="requiredElements">* = required field</p>

                {/* Quiz Name */}
                <div className="inputAndErrorDiv">
                  <div className="quizHelperDiv">
                    <label className="inputLabel">Name your quiz *</label>
                    <div
                      onClick={function () {
                        this.setState({ quizNameHelper: true });
                      }.bind(this)}
                      className="whatIsThis"
                    >
                      ?
                    </div>
                    {this.state.quizNameHelper === true ? (
                      <div className="instructionHelperDiv quizNameHelper">
                        <button
                          onClick={function () {
                            this.setState({ quizNameHelper: false });
                          }.bind(this)}
                          className="closeHelpBtn"
                        >
                          X
                        </button>
                        <span className="helperParagraph quizNameHelperParagraph">
                          May include, but is not limited to, the relevant book's title/author, chapter(s) and section(s) in a concise
                          format (e.g "<span className="innerInfoSpan">Author name</span>", "
                          <span className="innerInfoSpan">Book title</span>",
                          <span className="innerInfoSpan"> 1st Ed</span>,<span className="innerInfoSpan"> Ch 2</span>,
                          <span className="innerInfoSpan"> Sec 3</span>)
                        </span>
                      </div>
                    ) : null}
                  </div>
                  <QuizName quizName={this.state.quizNameInput} onChange={this.onChange} />
                  {errors.quizName ? (
                    <span className="errorSpan errorSpanQuizName">
                      <img className="errorImgCreateQuiz" src="/images/warning.svg" alt="Attention"></img>
                      <span>{errors.quizName}</span>
                    </span>
                  ) : null}
                </div>

                {/* Teacher Name */}
                <div className="inputAndErrorDiv teacherNameinputAndErrorDiv">
                  <div className="quizHelperDiv teacherNameDiv">
                    <label className="inputLabel teacherNameLabel">Teacher name</label>
                    <div
                      onClick={function () {
                        this.setState({ quizTeacherNameHelper: true });
                      }.bind(this)}
                      className="whatIsThis"
                    >
                      ?
                    </div>
                    {this.state.quizTeacherNameHelper === true ? (
                      <div className="instructionHelperDiv quizTeacherNameHelper">
                        <button
                          onClick={function () {
                            this.setState({ quizTeacherNameHelper: false });
                          }.bind(this)}
                          className="closeHelpBtn"
                        >
                          X
                        </button>
                        <span className="helperParagraph quizTeacherNameHelperParagraph">
                          Different teachers often have different approaches to their lectures and material they decide to cover for the
                          same course. Hence it's a good idea to let users know to whose teaching style this quiz is relevant!
                        </span>
                      </div>
                    ) : null}
                  </div>
                  <input
                    ref={this.teacherNameInput}
                    className="teacherNameInput"
                    autoComplete={"off"}
                    defaultValue={teacher_Name}
                    onChange={this.onChange}
                    onKeyDown={this.moveFocus}
                    name="teacher_Name" // underscore on purpose because otherwise (with camel case) the browser auto-completes
                    placeholder="e.g. Albert Einstein"
                    tabIndex="3"
                  ></input>
                  {teacher_Name ? (
                    <ul
                      ref={this.teacherNamesSuggestions}
                      onKeyDown={this.moveFocus}
                      className={classNames("teacherNamesSuggestions createQuizTeacherNamesSuggestions", {
                        "teacherNamesSuggestionsVisible": showTeacherNamesSuggestions === true,
                      })}
                    >
                      {
                        // need to fix "index" for key, should be a proper _id coming from server instead
                        this.filterTeacherNamesSuggestions(teacherNamesSuggestions).map(
                          function (teacherSuggestion, index) {
                            if (index === 0) {
                              return (
                                <li
                                  onClick={this.selectTeacherNamesSuggestionsClick}
                                  onKeyDown={this.selectTeacherNamesSuggestionsEnter}
                                  tabIndex="4"
                                  index={index}
                                  key={teacherSuggestion.id}
                                >
                                  {teacherSuggestion.teacherName}
                                </li>
                              );
                            }
                            return (
                              <li
                                onClick={this.selectTeacherNamesSuggestionsClick}
                                onKeyDown={this.selectTeacherNamesSuggestionsEnter}
                                tabIndex="-1"
                                index={index}
                                key={teacherSuggestion.id}
                              >
                                {teacherSuggestion.teacherName}
                              </li>
                            );
                          }.bind(this)
                        )
                      }
                    </ul>
                  ) : null}
                  {errors.teacherName ? (
                    <span className="errorSpan">
                      <img className="errorImgCreateQuiz" src="/images/warning.svg" alt="Attention"></img>
                      <span>{errors.teacherName}</span>
                    </span>
                  ) : null}
                </div>

                {/* Course Code */}
                <div className="courseCodeDiv">
                  <label className="inputLabel courseCodeLabel">Course Code *</label>
                  <div className="courseCodeDivWrapper createQuizCourseCodeDivWrapper">
                    <div className="courseCodeInnerWrapperDiv">
                      <div className="inputAndErrorDiv courseCodeLettersinputAndErrorDiv">
                        <input
                          onKeyDown={this.moveFocus}
                          ref={this.courseCodeLettersSuggestionInput}
                          className="courseCodeLettersSuggestionInput"
                          tabIndex="5"
                          onChange={this.getCourseCodeLettersSuggestions}
                          defaultValue={courseCodeLetters}
                          id="courseCodeLetters"
                          name="courseCodeLetters"
                          placeholder="e.g. CS"
                          maxLength={10}
                          autoComplete="off"
                          // type="text"
                          // pattern="[A-Za-z]{0,10}"
                          // title="Up to 10 letters"
                        ></input>

                        {/* Button for closing letter suggestions: Decided it serves no purpose for now. */}
                        {/* <div className={classNames("closeLetterSuggestions", {
                                    'visible': courseCodeLetters && courseCodeLetters.length > 0
                                })}></div> */}

                        {courseCodeLetters ? (
                          <ul
                            ref={this.courseCodeLettersSuggestions}
                            onKeyDown={this.moveFocus}
                            className={classNames("courseCodeLettersSuggestions createQuizCourseCodeLettersSuggestions", {
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
                                        tabIndex="6"
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
                        {errors.courseCodeLettersOnly ? (
                          <span className="errorSpan">
                            <img className="errorImgCreateQuiz" src="/images/warning.svg" alt="Attention"></img>
                            <span>{errors.courseCodeLettersOnly}</span>
                          </span>
                        ) : null}
                      </div>
                      <span className="dash">-</span>
                      <div className="inputAndErrorDiv courseCodeLettersinputAndErrorDiv">
                        <input
                          // disabled={courseCodeLetters && courseCodeLetters.length === 0}
                          defaultValue={courseCodeDigits}
                          disabled={courseCodeLetters.length === 0}
                          onKeyDown={this.moveFocus}
                          ref={this.courseCodeDigitsSuggestionInput}
                          tabIndex="7"
                          onChange={this.getCourseCodeDigitsSuggestions}
                          id="courseCodeDigits"
                          name="courseCodeDigits"
                          className="courseCodeDigitsSuggestionInput"
                          placeholder="e.g. 355"
                          maxLength={5}
                          autoComplete="off"
                          // type="text"
                          // pattern="[0-9]{0,5}"
                          // title="Up to 5 digits"
                        ></input>

                        {courseCodeDigits ? (
                          <ul
                            ref={this.courseCodeDigitsSuggestions}
                            onKeyDown={this.moveFocus}
                            className={classNames("courseCodeDigitsSuggestions createQuizCourseCodeDigitsSuggestions", {
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
                                        tabIndex="8"
                                        index={index}
                                        key={courseCodeSuggestions.id + "_digit"}
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
                                      key={courseCodeSuggestions.id + "_digit"}
                                    >
                                      {courseCodeSuggestion.digits}
                                    </li>
                                  );
                                }.bind(this)
                              )
                            }
                          </ul>
                        ) : null}
                        {errors.courseCodeDigitsOnly ? (
                          <span className="errorSpan">
                            <img className="errorImgCreateQuiz" src="/images/warning.svg" alt="Attention"></img>
                            <span>{errors.courseCodeDigitsOnly}</span>
                          </span>
                        ) : null}
                      </div>
                    </div>

                    {errors.courseCodeLetters ? (
                      <span className="errorSpan errorSpan errorSpanCourseCodeLetters">
                        <img className="errorImgCreateQuiz" src="/images/warning.svg" alt="Attention"></img>
                        <span>{errors.courseCodeLetters} </span>
                      </span>
                    ) : null}
                    {errors.courseCodeDigits ? (
                      <span className="errorSpan errorSpan errorSpanCourseCodeDigits">
                        <img className="errorImgCreateQuiz" src="/images/warning.svg" alt="Attention"></img>
                        <span>{errors.courseCodeDigits} </span>
                      </span>
                    ) : null}
                    {errors.courseCodeBothError ? (
                      <span className="errorSpan">
                        <img className="errorImgCreateQuiz" src="/images/warning.svg" alt="Attention"></img>
                        <span>{errors.courseCodeBothError}</span>
                      </span>
                    ) : null}
                  </div>
                </div>

                {/* Course Title */}
                <div className="inputAndErrorDiv courseTitleinputAndErrorDiv">
                  <label className="inputLabel">Course Title *</label>
                  <input
                    disabled={courseCodeDigits.length === 0}
                    tabIndex="9"
                    onChange={this.getCourseTitlesSuggestions}
                    onKeyDown={this.moveFocus}
                    name="courseTitle"
                    ref={this.courseTitleInput}
                    defaultValue={courseTitle}
                    className="courseTitleInput"
                    placeholder="e.g. Internet and Web Technologies"
                    maxLength={70}
                    autoComplete="off"
                  ></input>
                  <span
                    className={classNames("courseTitleCountLeft", {
                      "courseTitleCountLeftVisible": courseTitleCountLeft <= 10,
                    })}
                    style={{ color: "lightgray" }}
                  >
                    {courseTitleCountLeft}
                  </span>

                  {courseTitle ? (
                    <ul
                      ref={this.courseTitlesSuggestions}
                      onKeyDown={this.moveFocus}
                      className={classNames("courseTitlesSuggestions createQuizCourseTitlesSuggestions", {
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
                                  tabIndex="10"
                                  index={index}
                                  key={courseTitleSuggestion.id + "_title"}
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
                                key={courseTitleSuggestion.id + "_title"}
                              >
                                {courseTitleSuggestion.title}
                              </li>
                            );
                          }.bind(this)
                        )
                      }
                    </ul>
                  ) : null}
                  {errors.courseTitle ? (
                    <span className="errorSpan">
                      <img className="errorImgCreateQuiz" src="/images/warning.svg" alt="Attention"></img>
                      <span>{errors.courseTitle}</span>
                    </span>
                  ) : null}
                </div>

                {/* Fields of study */}
                {/* {fieldsOfStudyList.length > 0 ? */}
                <div className="inputAndErrorDiv fieldsOfStudy">
                  <label className="inputLabel fieldOfStudy createQuizFieldOfStudy">Field of Study *</label>
                  <select
                    value={fieldOfStudy}
                    // defaultValue={fieldOfStudy}
                    ref={this.fieldOfStudyRef}
                    className="selectFieldsOfStudy"
                    onChange={function (e) {
                      this.setState({ fieldOfStudy: e.target.value });
                    }.bind(this)}
                    tabIndex="11"
                    name="fieldsofstudy"
                  >
                    <option value=""></option>
                    {fieldsOfStudyList.map(function (field) {
                      return (
                        <option key={field._id} value={`${field.name}`}>
                          {field.name}
                        </option>
                      );
                    })}
                  </select>
                  {errors.majorName ? (
                    <span className="errorSpan errorSpanMajorName">
                      <img className="errorImgCreateQuiz" src="/images/warning.svg" alt="Attention"></img>
                      <span>{errors.majorName}</span>
                    </span>
                  ) : null}
                </div>
                {/* // : null} */}

                {/* School name */}
                <div className="inputAndErrorDiv schoolNameinputAndErrorDiv">
                  <label className="inputLabel school createQuizSchool">School *</label>
                  <input
                    defaultValue={schoolName}
                    className="schoolNameInput"
                    ref={this.schoolNameInput}
                    tabIndex="12"
                    onChange={this.getSchoolNamesSuggestions}
                    onKeyDown={this.moveFocus}
                    name="schoolName"
                    placeholder="e.g. Queens College"
                    maxLength={70}
                    autoComplete="off"
                  ></input>
                  {/* {true ?
                            <span style={{ color: 'red' }}>Username not found</span> : null} */}

                  {schoolName ? (
                    <ul
                      ref={this.schoolNamesSuggestions}
                      onKeyDown={this.moveFocus}
                      className={classNames("schoolNamesSuggestions createQuizSchoolNamesSuggestions", {
                        "schoolNamesSuggestionsVisible": showSchoolNamesSuggestions === true,
                      })}
                    >
                      {
                        // need to fix "index" for key, should be a proper _id coming from server instead
                        this.filterSchoolNamesSuggestions(schoolNamesSuggestions).map(
                          function (schoolSuggestion, index) {
                            if (index === 0) {
                              return (
                                <li
                                  onClick={this.selectSchoolNameSuggestionClick}
                                  onKeyDown={this.selectSchoolNameSuggestionEnter}
                                  tabIndex="13"
                                  index={index}
                                  key={schoolSuggestion.id}
                                >
                                  {schoolSuggestion.name}
                                </li>
                              );
                            }
                            return (
                              <li
                                onClick={this.selectSchoolNameSuggestionClick}
                                onKeyDown={this.selectSchoolNameSuggestionEnter}
                                tabIndex="-1"
                                index={index}
                                key={schoolSuggestion.id}
                              >
                                {schoolSuggestion.name}
                              </li>
                            );
                          }.bind(this)
                        )
                      }
                    </ul>
                  ) : null}

                  {errors.schoolName ? (
                    <span className="errorSpan errorSpanSchoolName">
                      <img className="errorImgCreateQuiz" src="/images/warning.svg" alt="Attention"></img>
                      <span>{errors.schoolName}</span>
                    </span>
                  ) : null}
                </div>

                {/* Course Term */}
                <div className="termSelectDivWrapper">
                  <label className="inputLabel term createQuizTerm">Term</label>
                  <div className="termSelectDiv">
                    <div className="quizTermInnerWrapperDiv">
                      <select
                        value={courseTermSeason}
                        ref={this.courseTermSeasonInput}
                        onChange={function (e) {
                          this.setState({ courseTermSeason: e.target.value });
                        }.bind(this)}
                        name="termSeasons"
                        tabIndex="14"
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
                        value={courseTermYear}
                        ref={this.courseTermYearInput}
                        onChange={function (e) {
                          this.setState({ courseTermYear: e.target.value });
                        }.bind(this)}
                        name="termYears"
                        tabIndex="15"
                      >
                        <option value="Year" style={{ color: "gray" }}>
                          Year
                        </option>
                        <option value="2021">2021</option>
                        <option value="2020">2020</option>
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

                    {errors.quizTerm ? (
                      <span className="errorSpan errorSpanQuizTerm">
                        <img className="errorImgCreateQuiz" src="/images/warning.svg" alt="Attention"></img>
                        <span>{errors.quizTerm}</span>
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="createQuizButtonsDiv">
                  <button
                    className={classNames("submitBtn uploadQuizBtn", {
                      "uploadQuizBtnLoading": isLoading,
                    })}
                    disabled={isLoading}
                    onClick={function (e) {
                      this.createQuiz(e);
                    }.bind(this)}
                  >
                    Create
                  </button>
                  <button
                    className={classNames("submitBtn uploadQuizBtn saveQuizDraftBtn", {
                      "uploadQuizBtnLoading": isLoading,
                    })}
                    disabled={isLoading}
                    onClick={function (e) {
                      this.saveDraftAndExit(e);
                    }.bind(this)}
                  >
                    Save draft
                  </button>
                </div>

                <div
                  className={classNames("createQuizSpinnerWrapper", {
                    "createQuizSpinnerWrapperVisible": isLoading,
                  })}
                >
                  <div className="createQuizSpinner">
                    <SpinnerDelayed isLoading={true} />
                  </div>
                </div>
                {errors.questionsList ? (
                  <div className="errorSpanWrapper">
                    <span className="errorSpan errorSpanQuestionsList">
                      <img className="errorImgCreateQuiz" src="/images/warning.svg" alt="Attention"></img>
                      <span>{errors.questionsList}</span>
                    </span>
                  </div>
                ) : null}

                {!isEmpty(errors.questionErrors) && errors.questionErrors.length > 0 ? (
                  <Tilt className="Tilt" tiltMaxAngleX={7} tiltMaxAngleY={7}>
                    <div className="errorSpanWrapper errorSpanWrapperQuestionErrors">
                      <img className="errorImgCreateQuiz" src="/images/warning.svg" alt="Attention"></img>
                      <ol className="questionErrorsOrderedList">
                        {errors.questionErrors.map(function (errorObj) {
                          return (
                            <li key={errorObj.id}>
                              <span className="errorSpan errorSpanQuestionsList">
                                <span>{errorObj.error}</span>
                              </span>
                            </li>
                          );
                        })}
                      </ol>
                    </div>
                  </Tilt>
                ) : null}

                {!isEmpty(errors) && !isEmpty(errors.connectionError) ? (
                  <Tilt className="Tilt" tiltMaxAngleX={7} tiltMaxAngleY={7}>
                    <span className="errorSpan errorSpanQuestionsList connectionErrorCreateQuiz">Connection error</span>
                  </Tilt>
                ) : null}
              </form>

              <div className="questionsOuterDiv">
                {/* Questions */}
                {/* {!isEmpty(questions) ? */}
                <ol ref={this.createQuizQuestionsListOL} className="createQuizQuestionsListOL">
                  {questions.map(
                    function (question, questionIndex) {
                      return (
                        <QuestionItem
                          key={question._id || question.tempID}
                          disableTextInputs={draftSaving}
                          questionIndex={questionIndex}
                          questions={questions}
                          question={question}
                          questionOnChange={this.questionOnChange}
                          questionOnChangeKeyDown={this.questionOnChangeKeyDown}
                          answerOnChange={this.answerOnChange}
                          setCorrectAnswer={this.setCorrectAnswer}
                          addAnswer={this.addAnswer}
                          deleteAnswer={this.deleteAnswer}
                          deleteQuestion={this.deleteQuestion}
                          newTimeout={this.state.newTimeout}
                          newTimeoutAnswer={this.state.newTimeoutAnswer}
                          questionInputOnBlur={this.questionInputOnBlur}
                          questionInputOnFocus={this.questionInputOnFocus}
                          onPasteHandler={this.onPasteHandler}
                          onQuestionImageUpload={this.onQuestionImageUpload}
                          deleteQuestionImage={this.deleteQuestionImage}
                        />
                      );
                    }.bind(this)
                  )}
                </ol>
                {/* : null} */}
                <button className="submitBtn addQuestionBtn" type="button" onClick={this.addQuestion}>
                  + Add a question
                </button>
              </div>
            </div>
          ) : (
            <div
              className={classNames("createQuizSpinnerWrapper", {
                "createQuizSpinnerWrapperVisible": isLoading,
              })}
            >
              <div className="createQuizSpinner">
                <SpinnerDelayed isLoading={true} />
              </div>
            </div>
          )}

          <div
            className={classNames("areYouSureDiscardDraft confirmDeleteQuestionDiv", {
              "areYouSureDiscardDraftVisible": showConfirmDeleteQuestionWindow,
            })}
          >
            <Tilt className="Tilt" tiltMaxAngleX={7} tiltMaxAngleY={7}>
              <div className="confirmDiscardDivWrapper">
                <div
                  className={classNames("confirmDiscardDiv searchFormDiv createQuizSearchFormDiv", {
                    "confirmDiscardDivExtended": showConfirmDeleteQuestionWindow,
                  })}
                >
                  <h1>{`Delete question ${questionIndexToDelete + 1}?`}</h1>
                  <div className="confirmDiscardBtnsDiv">
                    <button
                      className="submitBtn uploadQuizBtn"
                      onClick={function () {
                        this.confirmDeleteQuestion(questionIndexToDelete);
                      }.bind(this)}
                    >
                      Delete
                    </button>
                    {/* <button className="submitBtn uploadQuizBtn" onClick={function () { this.cancelDiscardDraft() }.bind(this)}>Cancel</button> */}
                    <button
                      className="submitBtn uploadQuizBtn"
                      onClick={function () {
                        this.setState({ showConfirmDeleteQuestionWindow: false });
                      }.bind(this)}
                    >
                      Cancel
                    </button>
                  </div>
                  <div
                    className={classNames("confirmDiscardSpinnerDiv", {
                      "confirmDiscardSpinnerDivVisible": isDeletingQuestion,
                    })}
                  >
                    <SpinnerDelayed isLoading={true} />
                  </div>
                </div>
              </div>
            </Tilt>
          </div>
        </div>

        <p
          className={classNames("savingParagraph", {
            show: draftSaving,
            saved: draftSaved,
          })}
        >
          {draftSaved ? "Saved" : "Saving"}
        </p>
      </div>
    );
  }

  componentDidMount() {
    if (!isEmpty(this.state.fieldsOfStudyList)) {
      // console.log("did mount setting isLoading to false");
      this.setState({ isLoading: false });
    }

    // console.log("create quiz didMount");
    if (isEmpty(this.props.quizzes.fieldsOfStudyList)) {
      // console.log("create quiz calling getMajors");
      this.props.getMajors();
    } else {
      // console.log("create quiz fieldsOfStudyList already exists");
      this.setState({ fieldsOfStudyList: this.props.quizzes.fieldsOfStudyList });
    }
    if (isEmpty(this.props.quizzes.teachersList)) {
      // console.log("create quiz calling getTeachers");
      this.props.getTeachers();
    } else {
      // console.log("create quiz teachersList already exists")
      this.setState({ teacherNamesSuggestions: this.props.quizzes.teachersList });
    }

    // Load draft from redux (props) if it exists
    if (!isEmpty(this.props.quizzes.draft)) {
      // console.log("loading quiz draft from redux", this.props.quizzes.draft);
      // this.setState({ quizDraft: this.props.quizzes.draft }
      //     , function () { // BUG, but this calls componentDidUpdate, which is needed (hackish solution)
      //         // this.componentDidUpdate();
      //         // this.setState({ quizDraft: undefined }, function () {
      //         // }.bind(this))
      //     }.bind(this));
    }

    // Load draft from server if "id" parameter exists in URL.
    else {
      var params = new URLSearchParams(this.props.location.search);
      const quizId = params.get("qid");
      if (!isEmpty(quizId)) {
        // console.log("requesting quiz draft from server", quizId);
        axios
          .get(`/api/quizzes/getquizdraft/${quizId}`)
          .then(
            function (res) {
              var quizDraft = Object.assign({}, JSON.parse(res.data));
              // var quizDraft = res.data;
              // console.log("quiz draft:", quizDraft);

              // console.log("quiz draft questions", res.data);

              if (res.data.errors) {
                return this.setState({ errors: res.data.errors });
              }

              // var questionsListString = JSON.stringify(JSON.parse(quizDraft).questionsList);

              this.setState(
                { quizDraft },
                // this.setState({ quizDraft: JSON.parse(quizDraft), questionsListString }
                function () {
                  this.setState(
                    { quizDraft: undefined },
                    function () {
                      // BUG, but this calls componentDidUpdate, which is needed (hackish solution)
                    }.bind(this)
                  );
                }.bind(this)
              );

              this.props.setQuizDraft(quizDraft);

              // quizName, schoolBody, majorBody, courseBody, questionsList, quizCreatorName, teacherName, quizTerm

              // questions: [], // quiz component
              // teacher_Name: '', // quiz component
              // courseTitle: '', // quiz component
              // courseCodeDigits: '', // quiz component
              // courseCodeLetters: '', // quiz component
              // fieldOfStudy: '', // quiz component
              // schoolName: '', // quiz component
              // courseTermSeason: '', // quiz component
              // courseTermYear: '', // quiz component
              // quizCreatorName: '', // quiz component
              // quiz_Name: '', // quiz component

              // try {
              // if (!isEmpty(quizDraft.questionsList)) this.setState({ draft_questions: quizDraft.questionsList });
              // if (!isEmpty(quizDraft.teacherName)) this.setState({ draft_teacher_Name: quizDraft.teacherName });
              // if (!isEmpty(quizDraft.course) && !isEmpty(quizDraft.course.title)) this.setState({ draft_courseTitle: quizDraft.course.title });
              // if (!isEmpty(quizDraft.course) && !isEmpty(quizDraft.course.letters)) this.setState({ draft_courseCodeDigits: quizDraft.course.code.letters });
              // if (!isEmpty(quizDraft.course) && !isEmpty(quizDraft.course.digits)) this.setState({ draft_courseCodeDigits: quizDraft.course.code.digits });
              // if (!isEmpty(quizDraft.major) && !isEmpty(quizDraft.major.name)) this.setState({ draft_fieldOfStudy: quizDraft.major.name });
              // if (!isEmpty(quizDraft.school) && !isEmpty(quizDraft.school.name)) this.setState({ draft_schoolName: quizDraft.school.name });
              // if (!isEmpty(quizDraft.term) && !isEmpty(quizDraft.term.season)) this.setState({ draft_courseTermSeason: quizDraft.term.season });
              // if (!isEmpty(quizDraft.term) && !isEmpty(quizDraft.term.year)) this.setState({ draft_courseTermYear: quizDraft.term.year });
              // if (!isEmpty(quizDraft.name)) this.setState({ draft_quiz_Name: quizDraft.name });

              // } catch (err) {
              //     console.log("trycatch draft error: ", err);
              // }
            }.bind(this)
          )
          .catch(
            function (err) {
              console.log("error getquizdraft", err.response.data);
              this.setState(
                { errors: err.response.data },
                function () {
                  // hide the createquiz form
                  var mRef = this.createQuizInnerDiv.current;
                  if (mRef) {
                    mRef.style.display = "none";
                  }
                }.bind(this)
              );
            }.bind(this)
          );
      }
    }

    window.scroll({
      // behavior: 'smooth',
      left: 0,
      top: 0,
    });

    setInterval(() => {
      console.log("interval");
      this.saveDraftFunc();
    }, 180000);
  }

  componentDidUpdate(nextProps, prevState) {
    // try {

    if (!isEmpty(this.state.fieldsOfStudyList) && prevState.isLoading === true) {
      // console.log("did update setting isLoading to false");
      this.setState({ isLoading: false });
    }

    if (!isEmpty(nextProps.quizzes.myQuizzes)) {
      // console.log("my quizzes CLEARED");
      nextProps.clearMyQuizzes();
    }

    if ((!isEmpty(prevState.fieldsOfStudyList) || !isEmpty(nextProps.quizzes.fieldsOfStudyList)) && !isEmpty(prevState.quizDraft)) {
      var quizDraft = prevState.quizDraft;
      // console.log("quizDraft did update: ", prevState.quizDraft);
      if (!isEmpty(quizDraft._id)) this.setState({ quizId: quizDraft._id });
      if (!isEmpty(quizDraft.quizCreatorId)) {
        // console.log("quizCreatorId not empty: ", quizDraft.quizCreatorId);
        this.setState({ quizCreatorId: quizDraft.quizCreatorId });
      } else {
        // console.log("quizCreatorId empty");
      }

      if (!isEmpty(quizDraft.questionsList)) {
        this.setState({ questions: JSON.parse(JSON.stringify(quizDraft.questionsList)) });
      }

      if (!isEmpty(quizDraft.teacherName)) {
        this.setState({ teacher_Name: quizDraft.teacherName });
        // this.teacherNameInput.current.value = quizDraft.teacherName;
      }
      if (!isEmpty(quizDraft.course) && !isEmpty(quizDraft.course.title)) {
        this.setState({ courseTitle: quizDraft.course.title });
        // this.courseTitleInput.current.value = quizDraft.course.title;
      }
      if (!isEmpty(quizDraft.course) && !isEmpty(quizDraft.course.code.letters)) {
        this.setState({ courseCodeLetters: quizDraft.course.code.letters });
        // this.courseCodeLettersSuggestionInput.current.value = quizDraft.course.code.letters;
      }
      if (!isEmpty(quizDraft.course) && !isEmpty(quizDraft.course.code.digits)) {
        this.setState({ courseCodeDigits: quizDraft.course.code.digits });
        // this.courseCodeDigitsSuggestionInput.current.value = quizDraft.course.code.digits;
      }
      if (!isEmpty(quizDraft.major) && !isEmpty(quizDraft.major.name)) {
        this.setState({ fieldOfStudy: quizDraft.major.name });
        // this.fieldOfStudyRef.current.value = quizDraft.major.name;
        // console.log("Major name field: ", this.fieldOfStudyRef.current);
        // console.log("Major name from quizDraft.major.name: ", quizDraft.major.name);
        // console.log("Major name field has been set: ", this.fieldOfStudyRef.current.value);
      }
      if (!isEmpty(quizDraft.school) && !isEmpty(quizDraft.school.name)) {
        this.setState({ schoolName: quizDraft.school.name });
        // this.schoolNameInput.current.value = quizDraft.school.name;
      }
      if (!isEmpty(quizDraft.term) && !isEmpty(quizDraft.term.season)) {
        this.setState({ courseTermSeason: quizDraft.term.season });
        // this.courseTermSeasonInput.current.value = quizDraft.term.season;
      }
      if (!isEmpty(quizDraft.term) && !isEmpty(quizDraft.term.year)) {
        this.setState({ courseTermYear: quizDraft.term.year });
        // this.courseTermYearInput.current.value = quizDraft.term.year;
      }
      if (!isEmpty(quizDraft.name)) {
        this.setState({ quiz_Name: quizDraft.name, quizNameInput: quizDraft.name });
      }
      if (!isEmpty(quizDraft.searchableId)) {
        this.setState({ searchableId: quizDraft.searchableId });
      }

      //  When all have been set, remove quizDraft from state.

      // if (JSON.stringify(quizDraft.questionsList) != JSON.stringify(prevState.questions))
      //   console.log("problem at questions", quizDraft.questionsList, prevState.questions);
      // if (quizDraft.teacherName != prevState.teacher_Name)
      //   console.log(`problem at teacher name, ${quizDraft.teacherName}, ${prevState.teacher_Name}`);
      // if (this.teacherNameInput.current.value != quizDraft.teacherName) {
      //   console.log("problem at teacherName");
      //   // console.log("teacherName node: ", this.teacherNameInput.current.value)
      //   // console.log("teacherName quizDraft: ", quizDraft.teacherName)
      // }
      if (quizDraft.course.title != prevState.courseTitle) console.log("problem at course title state");
      // else if (this.courseTitleInput.current.value != quizDraft.course.title) console.log("problem at course title")
      else if (quizDraft.course.code.letters != prevState.courseCodeLetters) console.log("problem at code letters state");
      // else if (this.courseCodeLettersSuggestionInput.current.value != quizDraft.course.code.letters) console.log("problem at code letters")
      else if (quizDraft.course.code.digits != prevState.courseCodeDigits) console.log("problem at code digits state");
      // else if (this.courseCodeDigitsSuggestionInput.current.value != quizDraft.course.code.digits) console.log("problem at code digits")
      else if (quizDraft.major.name != prevState.fieldOfStudy) console.log("problem at major name state");
      // // else if (this.fieldOfStudyRef.current.value != quizDraft.major.name) console.log("problem at major name", this.fieldOfStudyRef.current.value, ", ", quizDraft.major.name)
      else if (quizDraft.school.name != prevState.schoolName) console.log("problem at school name state");
      // else if (this.schoolNameInput.current.value != quizDraft.school.name) console.log("problem at school name")
      else if (quizDraft.term.season != prevState.courseTermSeason) console.log("problem at term season state");
      // else if (this.courseTermSeasonInput.current.value != quizDraft.term.season && !isEmpty(quizDraft.term.season)) console.log("problem at term season")
      else if (quizDraft.term.year != prevState.courseTermYear) console.log("problem at term year state");
      // else if (this.courseTermYearInput.current.value != quizDraft.term.year && !isEmpty(quizDraft.term.year)) console.log("problem at term year", this.courseTermYearInput.current.value)
      else if (quizDraft.name != prevState.quiz_Name) console.log("problem at quiz name state");
      else if (this.state.quizNameInput != quizDraft.name) console.log("problem at quiz name");
      // else if (quizDraft.searchableId != prevState.searchableId) console.log("problem at searchableId")
      else {
        this.setState({ quizDraft: undefined });
      }
    } else {
      // console.log("err");
    }
    // } catch (err) {
    //     // console.log("");
    // }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!isEmpty(nextProps.quizzes.draft) && isEmpty(prevState.quizDraft) && isEmpty(prevState.draftBeenLoaded)) {
      // console.log("loading quiz draft from redux", nextProps.quizzes.draft);
      return {
        quizDraft: nextProps.quizzes.draft,
        draftBeenLoaded: true,
      };
    }

    // if (!isEmpty(nextProps.quizzes.draft)) {
    //     var quizDraft = nextProps.quizzes.draft;
    //     console.log("nextProps: ", nextProps.quizzes.draft);

    //     return {
    //         courseCodeLetters:
    //         // courseCodeDigits
    //         // courseTitle
    //         // fieldOfStudy
    //         // schoolName
    //         // courseTermSeason
    //         // courseTermYear
    //         // questions
    //         // quiz_Name
    //         // teacher_Name
    //     }

    // if (isEmpty(courseCodeLetters)) courseCodeLetters = "";
    // if (isEmpty(courseCodeDigits)) courseCodeDigits = "";
    // if (isEmpty(courseTitle)) courseTitle = "";
    // if (isEmpty(fieldOfStudy)) fieldOfStudy = "";
    // if (isEmpty(schoolName)) schoolName = "";
    // if (isEmpty(courseTermSeason)) courseTermSeason = "";
    // if (isEmpty(courseTermYear)) courseTermYear = "";
    // if (isEmpty(questions)) questions = [];
    // if (isEmpty(quiz_Name)) quiz_Name = "";
    // if (isEmpty(teacher_Name)) teacher_Name = "";

    // Load draft from global state (redux)
    // if (!isEmpty(nextProps.quizzes.draft) && prevState.draftQuizSet != true) {
    //     const quizDraft = nextProps.quizzes.draft;

    //     return {
    //         quizDraft: quizDraft,
    //         draftQuizSet: true
    //     }
    // }

    //  compare fieldsOfStudyList
    if (
      !isEmpty(nextProps.quizzes.fieldsOfStudyList) &&
      nextProps.quizzes.fieldsOfStudyList.length !== prevState.fieldsOfStudyList.length
    ) {
      // console.log("derived setting isLoading to false");
      return {
        fieldsOfStudyList: nextProps.quizzes.fieldsOfStudyList,
        isLoading: false,
      };
    }

    //  if teacherNamesSuggestions is empty or neither is empty but lengths don't match then update it.
    if (
      (isEmpty(prevState.teacherNamesSuggestions) && !isEmpty(nextProps.quizzes.teachersList)) ||
      (!isEmpty(prevState.teacherNamesSuggestions) &&
        !isEmpty(nextProps.quizzes.teachersList && nextProps.quizzes.teachersList.length !== prevState.teacherNamesSuggestions.length))
    ) {
      return {
        teacherNamesSuggestions: nextProps.quizzes.teachersList,
      };
    }
    return null;
  }

  saveDraftFunc = () => {
    var {
      courseCodeLetters,
      courseCodeDigits,
      courseTitle,
      fieldOfStudy,
      schoolName,
      courseTermSeason,
      courseTermYear,
      questions,
      quiz_Name,
      teacher_Name,
      quizCreatorId,
      quizCreated,
      searchableId,
    } = this.state;
    const { auth } = this.props;
    const { draft } = this.props.quizzes;

    // console.log("attempting save");

    this.setState({ draftSaved: false, draftSaving: false });

    if (quizCreated === true) return;

    if (isEmpty(courseCodeLetters)) courseCodeLetters = "";
    if (isEmpty(courseCodeDigits)) courseCodeDigits = "";
    if (isEmpty(courseTitle)) courseTitle = "";
    if (isEmpty(fieldOfStudy)) fieldOfStudy = "";
    if (isEmpty(schoolName)) schoolName = "";
    if (isEmpty(courseTermSeason)) courseTermSeason = "";
    if (isEmpty(courseTermYear)) courseTermYear = "";
    if (isEmpty(questions)) questions = [];
    if (isEmpty(quiz_Name)) quiz_Name = "";
    if (isEmpty(teacher_Name)) teacher_Name = "";

    if (courseTermSeason === "Season") {
      courseTermSeason = "";
    }

    if (courseTermYear === "Year") {
      courseTermYear = "";
    }

    // Compare original draft to changes:
    // if (draft.course.code.letters !== courseCodeLetters) console.log("different letters");
    // if (draft.course.code.digits !== courseCodeDigits) console.log("different digits");
    // if (draft.course.title !== courseTitle) console.log("different title");
    // if (draft.major.name !== fieldOfStudy) console.log("different fieldOfStudy", draft.fieldOfStudy, fieldOfStudy);
    // if (draft.school.name !== schoolName) console.log("different schoolName");
    // if (draft.term.season !== courseTermSeason) console.log("different courseTermSeason");
    // if (draft.term.year !== courseTermYear) console.log("different courseTermYear");
    // if (JSON.stringify(draft.questionsList) !== JSON.stringify(questions))
    //   console.log("different questionsList", JSON.stringify(draft.questionsList), "local", JSON.stringify(questions));
    // if (draft.name !== quiz_Name) console.log("different quiz_Name");
    // if (draft.teacherName !== teacher_Name) console.log("different teacher_Name");

    if (
      draft.course.code.letters === courseCodeLetters &&
      draft.course.code.digits === courseCodeDigits &&
      draft.course.title === courseTitle &&
      draft.major.name === fieldOfStudy &&
      draft.school.name === schoolName &&
      draft.term.season === courseTermSeason &&
      draft.term.year === courseTermYear &&
      JSON.stringify(draft.questionsList) === JSON.stringify(questions) &&
      draft.name === quiz_Name &&
      draft.teacherName === teacher_Name
    )
      return;

    // console.log("differences detected, saving");

    var quizTerm = {
      season: courseTermSeason,
      year: courseTermYear,
    };

    const courseBody = {
      code: {
        letters: courseCodeLetters,
        digits: courseCodeDigits,
      },
      title: courseTitle,
      // id: selectedCourseId
    };

    const schoolBody = {
      name: schoolName,
      // id: selectedSchoolId
    };
    const majorBody = {
      name: fieldOfStudy,
      // id: selectedFieldOfStudyId
    };

    var quizId = "";

    var params = new URLSearchParams(this.props.location.search);
    const paramQuizId = params.get("qid");
    if (!isEmpty(paramQuizId)) {
      quizId = paramQuizId;
    } else if (this.state.quizId) {
      quizId = this.state.quizId;
    }

    const quizBody = {
      quizId,
      quizCreatorId,
      courseBody,
      majorBody,
      schoolBody,
      quizTerm,
      questionsList: JSON.parse(JSON.stringify(questions)),
      quizCreatorName: auth.user.displayName,
      quizName: quiz_Name,
      teacherName: teacher_Name,
      searchableId,
    };

    if (
      (isEmpty(quizBody.courseBody) ||
        (isEmpty(quizBody.courseBody.letters) && isEmpty(quizBody.courseBody.digits) && isEmpty(quizBody.courseBody.title))) &&
      (isEmpty(quizBody.majorBody) || isEmpty(quizBody.majorBody.name)) &&
      (isEmpty(quizBody.schoolBody) || isEmpty(quizBody.schoolBody.name)) &&
      isEmpty(quizBody.questionsList) &&
      isEmpty(quizBody.teacherName) &&
      isEmpty(quizBody.quizName)
    ) {
      // console.log("isEmpty");
      return;
    }

    console.log("saving draft");

    // return;
    this.setState({ draftSaving: true });
    axios
      .post("/api/quizzes/addquizdraft", quizBody)
      .then((res) => {
        // console.log("Draft saved", quizBody);
        // this.resetState();
        this.props.getMyQuizzes();
        this.setState({ draftSaved: true, draftSaving: false });
        this.props.setQuizDraft(Object.assign({}, JSON.parse(JSON.stringify(res.data))));

        this.setState({ questions: Object.assign([], JSON.parse(JSON.stringify(res.data.questionsList))) });
      })
      .catch((err) => {
        this.setState({ draftSaving: false });
        console.log(err.response.data);
      });
  };

  // componentWillUnmount() {
  //   this.saveDraftFunc();
  // }

  saveDraftAndExit(e) {
    e.preventDefault();

    var {
      courseCodeLetters,
      courseCodeDigits,
      courseTitle,
      fieldOfStudy,
      schoolName,
      courseTermSeason,
      courseTermYear,
      questions,
      quiz_Name,
      teacher_Name,
      quizCreatorId,
      quizCreated,
      searchableId,
    } = this.state;
    const { auth } = this.props;

    if (quizCreated === true) return;

    if (isEmpty(courseCodeLetters)) courseCodeLetters = "";
    if (isEmpty(courseCodeDigits)) courseCodeDigits = "";
    if (isEmpty(courseTitle)) courseTitle = "";
    if (isEmpty(fieldOfStudy)) fieldOfStudy = "";
    if (isEmpty(schoolName)) schoolName = "";
    if (isEmpty(courseTermSeason)) courseTermSeason = "";
    if (isEmpty(courseTermYear)) courseTermYear = "";
    if (isEmpty(questions)) questions = [];
    if (isEmpty(quiz_Name)) quiz_Name = "";
    if (isEmpty(teacher_Name)) teacher_Name = "";

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

    const courseBody = {
      code: {
        letters: courseCodeLetters,
        digits: courseCodeDigits,
      },
      title: courseTitle,
      // id: selectedCourseId
    };

    const schoolBody = {
      name: schoolName,
      // id: selectedSchoolId
    };
    const majorBody = {
      name: fieldOfStudy,
      // id: selectedFieldOfStudyId
    };

    var quizId = "";

    var params = new URLSearchParams(this.props.location.search);
    const paramQuizId = params.get("qid");
    if (!isEmpty(paramQuizId)) {
      quizId = paramQuizId;
    } else if (this.state.quizId) {
      quizId = this.state.quizId;
    }

    const quizBody = {
      quizId,
      quizCreatorId,
      courseBody,
      majorBody,
      schoolBody,
      quizTerm,
      questionsList: questions,
      quizCreatorName: auth.user.displayName,
      quizName: quiz_Name,
      teacherName: teacher_Name,
      searchableId,
    };

    if (
      (isEmpty(quizBody.courseBody) ||
        (isEmpty(quizBody.courseBody.letters) && isEmpty(quizBody.courseBody.digits) && isEmpty(quizBody.courseBody.title))) &&
      (isEmpty(quizBody.majorBody) || isEmpty(quizBody.majorBody.name)) &&
      (isEmpty(quizBody.schoolBody) || isEmpty(quizBody.schoolBody.name)) &&
      isEmpty(quizBody.questionsList) &&
      isEmpty(quizBody.teacherName) &&
      isEmpty(quizBody.quizName)
    ) {
      // console.log("isEmpty");
      return;
    }

    // console.log("saving draft");

    this.setState(
      { isLoading: true },
      function () {
        axios
          .post("/api/quizzes/addquizdraft", quizBody)
          .then(
            function (res) {
              // console.log("Draft saved", quizBody);
              // this.resetState();
              this.setState({ isLoading: false });
              this.props.getMyQuizzes();
              this.props.history.push("/myquizzes");
            }.bind(this)
          )
          .catch(
            function (err) {
              console.log(err.response.data);
              this.setState({ isLoading: false });
            }.bind(this)
          );
      }.bind(this)
    );
  }

  createQuiz(e) {
    e.preventDefault();

    var {
      courseCodeLetters,
      courseCodeDigits,
      courseTitle,
      fieldOfStudy,
      schoolName,
      courseTermSeason,
      courseTermYear,
      questions,
      quiz_Name,
      teacher_Name,
      errors,
      quizId,
      quizCreatorId,
      searchableId,
    } = this.state;

    const { auth } = this.props;

    this.setState({ errors: {}, isLoading: true });

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

    const courseBody = {
      letters: courseCodeLetters,
      digits: courseCodeDigits,
      title: courseTitle,
      // id: selectedCourseId
    };

    const schoolBody = {
      name: schoolName,
      // id: selectedSchoolId
    };
    const majorBody = {
      name: fieldOfStudy,
      // id: selectedFieldOfStudyId
    };

    // var a = '';

    const quizData = {
      quizId,
      quizCreatorId,
      courseBody,
      majorBody,
      schoolBody,
      quizTerm,
      questionsList: questions,
      quizCreatorName: auth.user.displayName,
      quizName: quiz_Name,
      teacherName: teacher_Name,
      searchableId,
    };

    // console.log("question: ", quizData.questionsList[0].question);

    // return;
    axios
      .post("api/quizzes/addquiz", quizData)
      .then(
        function (res) {
          // console.log("quiz created:", res.data);
          this.setState({ quizCreated: true, isLoading: false });
          this.props.history.push("/myquizzes");
        }.bind(this)
      )
      .catch(
        function (err) {
          var connErr = {};
          connErr.connectionError = true;
          // console.log("match: ", String(err.response.data.toString()).match(new RegExp("conn", "i")));
          if (!isEmpty(String(err.response.data).match(new RegExp("conn", "i")))) this.setState({ errors: connErr });
          else this.setState({ errors: err.response.data, isLoading: false });
          // console.log("quiz add error: ", err.response.data);
        }.bind(this)
      );
  }

  onQuestionImageUpload(image, questionIndex, formRef) {
    // console.log("upload image: ", image);
    // console.log("upload questionIndex: ", questionIndex);

    // If the user is overwriting an existing image then the existing image must first be removed from the database.
    var { questions } = this.state;

    if (!isEmpty(questions[questionIndex].questionImage) && !isEmpty(questions[questionIndex].questionImage.path)) {
      // console.log("image exists");
      const deleteImageFunction = this.deleteQuestionImage(questionIndex, formRef);
      var mPromise = function () {
        deleteImageFunction
          .then(
            function (fulfilled) {
              this.onQuestionImageUpload(image, questionIndex, formRef);
            }.bind(this)
          )
          .catch(function (error) {
            console.log("promise error: ", error);
          });
      }.bind(this);
      mPromise();
      return;
    }

    var params = new URLSearchParams(this.props.location.search);
    const paramQuizId = params.get("qid");
    var quizId = "";
    if (!isEmpty(paramQuizId)) {
      quizId = paramQuizId;
    } else if (this.state.quizId) {
      quizId = this.state.quizId;
    }

    let formData = new FormData();
    formData.append("questionImage", image);
    formData.append("questionIndex", "123123123");
    formData.append("quizId", quizId);

    var { questions } = this.state;
    questions[questionIndex].questionImage = "uploading";

    this.setState(
      { questions },
      function () {
        axios
          .post("/api/quizzes/uploadimage", formData)
          .then(
            function (res) {
              var { questions } = this.state;
              questions[questionIndex].questionImage = res.data;
              this.setState(
                { questions },
                function () {
                  // console.log("question image uploaded successful: ", this.state.questions[questionIndex]);
                }.bind(this)
              );
              // formRef.reset();
            }.bind(this)
          )
          .catch(
            function (err) {
              var { questions } = this.state;
              questions[questionIndex].questionImage = { error: err.response.data };
              this.setState({ questions });
              console.log("question image upload failed: ", err.response.data);
            }.bind(this)
          );
      }.bind(this)
    );
  }

  deleteQuestionImage(questionIndex, formRef) {
    var { questions } = this.state;

    var imageName = {
      imageName: questions[questionIndex].questionImage.name,
    };

    var { questions } = this.state;
    questions[questionIndex].questionImage = null;
    this.setState({ questions });
    formRef.reset();

    return new Promise(
      function (resolve, reject) {
        return axios
          .post("/api/quizzes/deleteimage", imageName)
          .then(
            function (res) {
              // console.log("delete res: ", res.data);
              resolve("success");
            }.bind(this)
          )
          .catch(
            function (err) {
              console.log("client err: ", err.response.data);
              reject(err.response.data);
            }.bind(this)
          );
      }.bind(this)
    );
  }

  onChange(e) {
    const eventTargetName = e.target.name;
    // console.log("e target: ", eventTargetName);
    // return;
    this.setState({ [e.target.name]: e.target.value }, function () {
      if (eventTargetName === "teacher_Name") {
        this.setState({ showTeacherNamesSuggestions: true });
        if (this.state.teacher_Name.trim() === "") this.setState({ showTeacherNamesSuggestions: false });
      }
    });
  }

  questionInputOnFocus(e) {
    // return;
    var questionRef = e.target;

    try {
      if (questionRef.childNodes[0].tagName === undefined && questionRef.innerHTML.trim() !== "") {
        return;
      }

      if (questionRef.childNodes[0].tagName !== undefined) {
        questionRef.focus();
        // questionRef.innerHTML = " ";

        // console.log("focus selection: ", window.getSelection());
        // console.log("focus selection: ", questionRef.firstChild);

        var char = 1,
          sel; // character at which to place caret

        // if (document.selection) {
        //   sel = document.selection.createRange();
        //   sel.moveStart('character', char);
        //   sel.select();
        // }
        // else {
        sel = window.getSelection();
        sel.collapse(questionRef.firstChild, char);
        // sel.collapse(questionRef.firstChild, questionRef.innerHTML.length-2);
      }

      questionRef.innerHTML = "";

      //   sel.collapse(content.firstChild, char);
      // }
    } catch (err) {
      // console.log("err");
    }
  }
  questionInputOnBlur(e) {
    var questionRef = e.target;
    if (questionRef.innerHTML.trim() === "") {
      var span = document.createElement("span");
      var node = document.createTextNode("Question text here");
      span.appendChild(node);
      span.classList.add("placeholderSpan");
      // span.contentEditable = "false";
      questionRef.appendChild(span);
    }
  }

  questionOnChange(e, questionIndex) {
    var questionRef = e.target;
    // this if statement below is only applicable to a contentEditable div (and not the textarea)
    // if (e.target.innerHTML.length > 500) {

    // console.log("length before: ", e.target.innerText.length);
    // console.log("length after: ", e.target.innerText.replace(new RegExp("\n", "g"), "").length);

    if (e.target.innerText.replace(new RegExp("\n", "g"), "").length > 500) {
      // return;
      // e.target.innerHTML = e.target.innerHTML.substring(0, 500);
      try {
        var sel = window.getSelection();
        // sel.collapse(questionRef.firstChild, questionRef.innerHTML.length);
        sel.collapse(questionRef.firstChild, questionRef.innerText.length);
        e.preventDefault();
        return;
      } catch (err) {
        // console.log("err");
      }
    }
    var { questions } = this.state;
    // questions[questionIndex].question = e.target.value; // this is for textarea

    // questions[questionIndex].question = e.target.innerHTML; // this is for contentEditable div
    questions[questionIndex].question = e.target.innerText; // this is test

    // console.log("questionOnChange targetValue: ", e.target.innerText);
    // console.log("questionOnChange innerHTML: ", e.target.innerHTML);

    this.setState({ questions });

    // if (e.keyCode === 13) {
    //    // $(this).text().replace(/<div[^<]*?>/g, '').replace(/<\/div[^<]*?>/g, '<br>')
    //     // e.preventDefault();
    //     // if (window.getSelection) {
    //     //     var selection = window.getSelection(),
    //     //         range = selection.getRangeAt(0),
    //     //         br = document.createElement("br");
    //     //     range.deleteContents();
    //     //     range.insertNode(br);
    //     //     range.setStartAfter(br);
    //     //     range.setEndAfter(br);
    //     //     range.collapse(false);
    //     //     selection.removeAllRanges();
    //     //     selection.addRange(range);
    //     //     return false;
    //     // }
    // }

    this.setState(
      {
        newTimeout: setTimeout(() => {}, 500),
      },
      function () {
        setTimeout(() => {
          this.setState({ newTimeout: null });
        }, 500);
      }.bind(this)
    );
  }

  questionOnChangeKeyDown(e, questionIndex) {
    var questionRef = e.target;
    // this if statement below is only applicable to a contentEditable div (and not the textarea)

    if (
      (e.ctrlKey && e.keyCode === 73) || // ctrl+i
      (e.ctrlKey && e.keyCode === 66) || // ctrl+b
      (e.ctrlKey && e.keyCode === 85) // ctrl+u)
    ) {
      e.preventDefault();
      return;
    }

    // if (e.target.innerHTML.length >= 500) {
    if (e.target.innerText.replace(new RegExp("\n", "g"), "").length >= 500) {
      try {
        // var sel = window.getSelection();
        // sel.collapse(questionRef.firstChild, questionRef.innerHTML.length);
        if (
          e.keyCode === 8 || // backspace
          e.keyCode === 46 || // delete
          e.keyCode === 37 || // left
          e.keyCode === 38 || // up
          e.keyCode === 39 || // right
          e.keyCode === 40 || // down
          (e.ctrlKey && e.keyCode === 90) || // ctrl+z
          (e.ctrlKey && e.keyCode === 65) || // ctrl+a
          (e.ctrlKey && e.keyCode === 67) || // ctrl+c
          e.keyCode === 33 || // pgup
          e.keyCode === 34 || // pgdn
          e.keyCode === 35 || // end
          e.keyCode === 36 || // home
          (e.ctrlKey && e.keyCode === 35) || // ctrl+end
          (e.ctrlKey && e.keyCode === 36) // ctrl+home
        ) {
          // fine
          // e.preventDefault();
          // e.target.focus();
          // var sel = window.getSelection();
          // sel.collapse(questionRef.firstChild, questionRef.innerHTML.length);
          // return;
        } else {
          e.preventDefault();
          return;
        }

        // e.target.innerHTML = e.target.innerHTML.substring(0, 500);
      } catch (err) {
        // console.log("err");
      }
    }
    // var { questions } = this.state;
    // // questions[questionIndex].question = e.target.value; // this is for textarea
    // questions[questionIndex].question = e.target.innerHTML; // this is for contentEditable div
    // this.setState({ questions });

    // this.setState({
    //     newTimeout: setTimeout(() => {
    //     }, 500)
    // }, function () {
    //     setTimeout(() => {
    //         this.setState({ newTimeout: null })
    //     }, 500);
    // }.bind(this))
  }

  onPasteHandler(e, questionIndex) {
    e.preventDefault();
    // return;
    // console.log("paste: ", e.clipboardData.getData('Text'));

    // if ((e.clipboardData.getData('Text').length + e.target.innerHTML.length) > 500) {
    if (e.clipboardData.getData("Text").length + e.target.innerText.replace(new RegExp("\n", "g"), "").length > 500) {
      var { questions } = this.state;
      questions[questionIndex].notEnoughSpace = true;
      this.setState({ questions }, function () {
        setTimeout(
          function () {
            var { questions } = this.state;
            questions[questionIndex].notEnoughSpace = false;
            this.setState({ questions });
          }.bind(this),
          1200
        );
      });
      e.preventDefault();
      return;
    }

    if (e.clipboardData && e.clipboardData.getData) {
      var text = e.clipboardData.getData("text/plain");
      document.execCommand("insertHTML", false, text);
    } else if (window.clipboardData && window.clipboardData.getData) {
      var text = window.clipboardData.getData("Text");
      // insertTextAtCursor(text);
      var sel, range, html;
      if (window.getSelection) {
        sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
          range = sel.getRangeAt(0);
          range.deleteContents();
          range.insertNode(document.createTextNode(text));
        }
      } else if (document.selection && document.selection.createRange) {
        document.selection.createRange().text = text;
      }
    }
  }

  answerOnChange(e, questionIndex, answerIndex) {
    var { questions } = this.state;
    questions[questionIndex].potentialAnswers[answerIndex].potentialAnswer = e.target.value;
    this.setState({ questions });

    this.setState(
      {
        newTimeoutAnswer: setTimeout(() => {}, 500),
      },
      function () {
        setTimeout(() => {
          this.setState({ newTimeoutAnswer: null });
        }, 500);
      }.bind(this)
    );
  }

  setCorrectAnswer(questionIndex, answerIndex) {
    var { questions } = this.state;
    for (var i = 0; i < questions[questionIndex].potentialAnswers.length; i++) {
      if (i === answerIndex) {
        questions[questionIndex].potentialAnswers[i].correctAnswer = true;
      } else if (i !== answerIndex) {
        questions[questionIndex].potentialAnswers[i].correctAnswer = false;
      }
    }
    this.setState({ questions });
  }

  addQuestion(e) {
    var { questions, questionText } = this.state;

    const questionObject = {
      tempID: generateUniqueID(),
      "media": [],
      "question": "",
      "potentialAnswers": [
        {
          "potentialAnswer": "",
          "correctAnswer": false,
        },
        {
          "potentialAnswer": "",
          "correctAnswer": false,
        },
      ],
    };

    var createQuizQuestionsListOL = this.createQuizQuestionsListOL.current;
    // console.log("childNodes: ", createQuizQuestionsListOL.childNodes);
    // document.documentElement.scrollTop = document.;
    // console.log("doc: ", document.documentElement.scrollTop);
    // console.log("doc: ", document.documentElement.scrollTop);

    questions.push(questionObject);
    this.setState({ questions }, function () {
      try {
        var element = createQuizQuestionsListOL.childNodes[createQuizQuestionsListOL.childNodes.length - 1];
        // console.log("elt: ", element);
        // element.scrollTop = element.scrollHeight - element.clientHeight;
        // document.documentElement.scrollTop = document.documentElement.scrollHeight;

        // setTimeout(function () {
        window.scroll({
          behavior: "smooth",
          left: 0,
          // top: document.documentElement.scrollHeight
          top: element.offsetTop,
        });
        // }, 100);
      } catch (err) {}
    });
    // window.scrollTo(0, document.body.scrollHeight);
  }

  addAnswer(questionIndex) {
    var { questions } = this.state;
    const answerObject = {
      "potentialAnswer": "",
      "correctAnswer": false,
    };
    questions[questionIndex].potentialAnswers.push(answerObject);

    this.setState(
      { questions }
      // , function () {
      //     try {
      //         var createQuizQuestionsListOL = this.createQuizQuestionsListOL.current;

      //         // var element = createQuizQuestionsListOL.childNodes[createQuizQuestionsListOL.childNodes.length - 1];
      //         var element = createQuizQuestionsListOL.childNodes[questionIndex];
      //         window.scroll({
      //             behavior: 'smooth',
      //             left: 0,
      //             top: element.offsetTop
      //         });
      //     } catch (err) {

      //     }
      // }
    );
  }
  deleteAnswer(questionIndex, answerIndex) {
    // console.log("delete answer, q index: " + questionIndex + ", a index: " + answerIndex);
    var { questions } = this.state;
    // console.log("before delete: ", questions[questionIndex].potentialAnswers);
    questions[questionIndex].potentialAnswers.splice(answerIndex, 1);
    // console.log("after delete: ", questions[questionIndex].potentialAnswers);
    this.setState({ questions });
  }

  deleteQuestion(questionIndexToDelete) {
    this.setState({ showConfirmDeleteQuestionWindow: true, questionIndexToDelete });
  }

  confirmDeleteQuestion(questionIndex) {
    // console.log("delete answer, q index: " + questionIndex + ", a index: " + answerIndex);
    var { questions } = this.state;
    // console.log("before delete: ", questions[questionIndex].potentialAnswers);
    questions.splice(questionIndex, 1);
    // console.log("after delete: ", questions[questionIndex].potentialAnswers);
    this.setState(
      { isDeletingQuestion: true, questions, showConfirmDeleteQuestionWindow: false },
      function () {
        this.setState({ isDeletingQuestion: false });
      }.bind(this)
    );
  }

  // form functions

  moveFocus(e) {
    var sugsLetters = this.courseCodeLettersSuggestions.current;
    var sugsDigits = this.courseCodeDigitsSuggestions.current;
    var sugsSchools = this.schoolNamesSuggestions.current;
    var sugsCourseTitles = this.courseTitlesSuggestions.current;
    var sugsTeacherNames = this.teacherNamesSuggestions.current;

    if (e.target.name === "courseCodeLetters") {
      this.setState({ initialEventCaller: "courseCodeLetters" });
    } else if (e.target.name === "courseCodeDigits") {
      this.setState({ initialEventCaller: "courseCodeDigits" });
    } else if (e.target.name === "schoolName") {
      this.setState({ initialEventCaller: "schoolName" });
    } else if (e.target.name === "courseTitle") {
      this.setState({ initialEventCaller: "courseTitle" });
    } else if (e.target.name === "teacher_Name") {
      this.setState({ initialEventCaller: "teacher_Name" });
    }

    if (e.target.name === "courseCodeLetters") {
      if (sugsLetters && e.keyCode === 40) {
        e.preventDefault();
        if (sugsLetters.childNodes.length > 0) {
          sugsLetters.childNodes[0].focus();
        }
      }
      return;
    } else if (e.target.name === "courseCodeDigits") {
      // console.log("eTarget courseCodeDigits")
      if (sugsDigits && e.keyCode === 40) {
        e.preventDefault();
        if (sugsDigits.childNodes.length > 0) {
          sugsDigits.childNodes[0].focus();
        }
      }
      return;
    } else if (e.target.name === "schoolName") {
      if (sugsSchools && e.keyCode === 40) {
        e.preventDefault();
        if (sugsSchools.childNodes.length > 0) {
          sugsSchools.childNodes[0].focus();
        }
      }
      return;
    } else if (e.target.name === "courseTitle") {
      // console.log("eTarget courseTitle")
      if (sugsCourseTitles && e.keyCode === 40) {
        e.preventDefault();
        if (sugsCourseTitles.childNodes.length > 0) {
          sugsCourseTitles.childNodes[0].focus();
        }
      }
      return;
    } else if (e.target.name === "teacher_Name") {
      // console.log("eTarget courseTitle")
      if (sugsTeacherNames && e.keyCode === 40) {
        e.preventDefault();
        if (sugsTeacherNames.childNodes.length > 0) {
          sugsTeacherNames.childNodes[0].focus();
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
      e.preventDefault();
      var indexOfElt = active.getAttribute("index");
      // console.log("keydown index: ", indexOfElt);
      if (active.previousSibling) {
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
          } else if (initialEventCaller === "teacher_Name") {
            inp = this.teacherNameInput.current;
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
  selectTeacherNamesSuggestionsEnter(e) {
    var inp = this.teacherNameInput.current;
    if (e.keyCode === 13) {
      inp.value = e.target.innerHTML;
      this.setState({ teacher_Name: e.target.innerHTML });
      if (this.state.showTeacherNamesSuggestions === true) {
        this.setState({ showTeacherNamesSuggestions: false });
      }
    }
  }
  selectTeacherNamesSuggestionsClick(e) {
    var inp = this.teacherNameInput.current;
    inp.value = e.target.innerHTML;
    this.setState({ teacher_Name: e.target.innerHTML });
    if (this.state.showTeacherNamesSuggestions === true) {
      this.setState({ showTeacherNamesSuggestions: false });
    }
  }
  blurAllSuggestions(e) {
    this.setState({
      showCourseCodeLettersSuggestions: false,
      showCourseCodeDigitsSuggestions: false,
      showSchoolNamesSuggestions: false,
      showCourseTitlesSuggestions: false,
      showTeacherNamesSuggestions: false,
    });
  }
  blurAllSuggestionsEsc(e) {
    if (e.keyCode === 27) {
      this.setState({
        showCourseCodeLettersSuggestions: false,
        showCourseCodeDigitsSuggestions: false,
        showSchoolNamesSuggestions: false,
        showCourseTitlesSuggestions: false,
        showTeacherNamesSuggestions: false,
      });
    }
  }

  blurAllSuggestionsOnTab(e) {
    if (e.keyCode === 9) {
      this.setState({
        showCourseCodeLettersSuggestions: false,
        showCourseCodeDigitsSuggestions: false,
        showSchoolNamesSuggestions: false,
        showCourseTitlesSuggestions: false,
        showTeacherNamesSuggestions: false,
      });
    }
  }

  getCourseCodeLettersSuggestions(e) {
    // var { errors } = this.state;

    if (this.state.showCourseCodeLettersSuggestions === false) {
      this.setState({ showCourseCodeLettersSuggestions: true });
    }

    var eventTargetValue = e.target.value.trim();
    if (eventTargetValue === "") {
      this.setState({ [e.target.name]: "" });
      e.target.value = "";
      // errors.courseCodeLetters = '';
      return;
    }

    // var numberRegex = new RegExp('[^A-Za-z]', 'ig');
    // if (eventTargetValue.match(numberRegex)) {
    //     errors.courseCodeLetters = 'Letters only';
    //     this.setState({ errors });
    // } else {
    //     errors.courseCodeLetters = '';
    //     this.setState({ errors });
    // }

    this.setState(
      { [e.target.name]: eventTargetValue },
      function (eventTargetName) {
        var { courseCodeLetters } = this.state;
        if (courseCodeLetters.length === 1) {
          axios
            .get(`/api/courses/getcourses/${courseCodeLetters}`)
            .then(
              function (res) {
                var { courseCodeSuggestions } = this.state;
                courseCodeSuggestions.push.apply(courseCodeSuggestions, res.data);
                this.setState({ courseCodeSuggestions: this.removeDuplicates(courseCodeSuggestions, "id") });
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
  getCourseCodeDigitsSuggestions(e) {
    // var { errors, courseCodeMainError } = this.state;

    if (this.state.showCourseCodeDigitsSuggestions === false) {
      this.setState({ showCourseCodeDigitsSuggestions: true });
    }

    var eventTargetValue = e.target.value.trim();
    if (eventTargetValue === "") {
      this.setState({ [e.target.name]: "" });
      e.target.value = "";
      // errors.courseCodeDigits = '';
      return;
    }

    // var lettersRegex = new RegExp('[^0-9]', 'ig');
    // if (eventTargetValue.match(lettersRegex)) {
    //     errors.courseCodeDigits = 'Digits only';
    //     this.setState({ errors });
    // } else {
    //     errors.courseCodeDigits = '';
    //     this.setState({ errors });
    // }

    this.setState({ [e.target.name]: eventTargetValue });
  }
  getCourseTitlesSuggestions(e) {
    if (this.state.showCourseTitlesSuggestions === false) {
      this.setState({ showCourseTitlesSuggestions: true });
    }

    // var eventTargetValue = e.target.value.trim();
    var eventTargetValue = e.target.value;
    if (eventTargetValue === "") {
      this.setState({ [e.target.name]: "" });
      e.target.value = "";
      return;
    }
    // return;
    this.setState(
      { [e.target.name]: eventTargetValue },
      function () {
        this.setState({ courseTitleCountLeft: 70 - eventTargetValue.length });
      }.bind(this)
    );
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
                var { schoolNamesSuggestions } = this.state;
                schoolNamesSuggestions.push.apply(schoolNamesSuggestions, res.data);
                this.setState({ schoolNamesSuggestions: this.removeDuplicates(schoolNamesSuggestions, "id") });
              }.bind(this)
            )
            .catch(
              function (err) {
                // console.log("getschools fail: ", err);
                return console.log("getSchoolNamesSuggestions ERROR: ", err.response.data);
              }.bind(this)
            );
        }
      }.bind(this, e.target.name)
    );
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
      // return
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
  filterTeacherNamesSuggestions(teacherNamesSuggestions) {
    var { teacher_Name } = this.state;

    var returnList = teacherNamesSuggestions.filter(function (teacherSuggestion) {
      let regex = new RegExp(teacher_Name, "ig");
      return teacherSuggestion.teacherName.match(regex);
    });

    if (returnList.length >= 5) {
      returnList = returnList.slice(0, 5);
    }
    return returnList;
  }

  resetState() {
    this.setState(initialState);
  }

  removeDuplicates(originalArray, objKey) {
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
}

CreateQuiz.propTypes = {
  getMajors: PropTypes.func.isRequired,
  getTeachers: PropTypes.func.isRequired,
  setQuizDraft: PropTypes.func.isRequired,
  getMyQuizzes: PropTypes.func.isRequired,
  clearMyQuizzes: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  requests: PropTypes.object,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  requests: state.requests,
  quizzes: state.quizzes,
});

export default connect(mapStateToProps, { getMajors, getTeachers, setQuizDraft, getMyQuizzes, clearMyQuizzes })(CreateQuiz);
