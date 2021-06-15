import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import isEmpty from "../../validation/is-empty";
import classnames from "classnames";
import { removeInfoMessage } from "../../actions/infoActions";
import "./InfoFeed.css";

export class InfoFeed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
    };
  }

  componentDidUpdate() {
    const { infoMessageFeed } = this.props.infoMsgs;
    const { message, showFeedTimerSet, showFeed } = this.state;

    // console.log("infoMessageFeed: ", infoMessageFeed);

    if (JSON.stringify(message) !== JSON.stringify(infoMessageFeed) && !isEmpty(infoMessageFeed)) {
      this.setState({ message: infoMessageFeed, showFeed: true }, function (e) {}.bind(this));
    }

    if (showFeed && !showFeedTimerSet) {
      this.setState(
        { showFeedTimerSet: true },
        function (e) {
          setTimeout(
            function (e) {
              this.setState(
                { showFeed: false, showFeedTimerSet: false },
                function (e) {
                  this.props.removeInfoMessage();

                  setTimeout(
                    function (e) {
                      this.setState({ message: null });
                    }.bind(this),
                    1000
                  );
                }.bind(this)
              );
            }.bind(this),
            10000
          );
        }.bind(this)
      );
    }
  }

  render() {
    // const { infoMessageFeed } = this.props.infoMsgs;
    const { showFeed, message } = this.state;

    return (
      <div
        className={classnames("infoFeedDiv", {
          "infoFeedDivExtend": showFeed,
        })}
      >
        {/* {!isEmpty(message) && showFeed ? */}
        {!isEmpty(message) ? (
          message.type === "text" ? (
            <p>{message.content}</p>
          ) : (
            message.content
          )
        ) : // <ol>
        //     {infoMessageFeed.map(function (infoMsg, index) {
        //         return <li>{infoMsg}</li>
        //     }.bind(this))}
        // </ol>
        null}
      </div>
    );
  }
}

InfoFeed.propTypes = {
  infoMsgs: PropTypes.object,
  removeInfoMessage: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    infoMsgs: state.infoMsgs,
  };
}

export default connect(mapStateToProps, { removeInfoMessage })(InfoFeed);
