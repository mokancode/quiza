import React, { Component } from "react";
import "./FormError.css";

class FormError extends Component {
  render() {
    const { text } = this.props;

    return (
      <div className="formErrorWrapper">
        <span className="errorSpan">{text}</span>
      </div>
    );
  }
}

export default FormError;
