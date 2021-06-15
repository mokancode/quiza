import React, { Component } from "react";
import EyeOpen from "../SVGs/Eyes/eyeOpen/EyeOpen";
import EyeSquint from "../SVGs/Eyes/eyeSquint/EyeSquint";
import EyeShut from "../SVGs/Eyes/eyeShut/EyeShut";
import classnames from "classnames";

export class TripleButtonSingle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stop: true,
    };

    this.changeMode = this.props.changeMode;
  }

  render() {
    const { stop } = this.state;
    const { valueNum, labelName, quizExtraClass } = this.props;

    var eyeComponent;
    if (valueNum === 1) {
      eyeComponent = <EyeOpen stop={stop} />;
    } else if (valueNum === 2) {
      eyeComponent = <EyeSquint stop={stop} />;
    } else if (valueNum === 3) {
      eyeComponent = <EyeShut stop={stop} />;
    }

    return (
      <div
        className={classnames("quizAccesibilityBtn", {
          [quizExtraClass]: quizExtraClass,
        })}
        onMouseEnter={function (e) {
          this.setState({ stop: false });
        }.bind(this)}
        onMouseLeave={function (e) {
          this.setState({ stop: true });
        }.bind(this)}
      >
        <label>
          <input
            onChange={function (e) {
              this.changeMode(e.target.value);
            }.bind(this)}
            type="radio"
            name="quizVisibility"
            value={valueNum}
          />
          {labelName}
        </label>
        {eyeComponent !== null ? eyeComponent : null}
        {/* {eyeComponent} */}
      </div>
    );
  }
}

export default TripleButtonSingle;
