import React, { Component } from "react";
import katex from "katex";
import "./KaTeX-Styles.css";

export class KaTeX_Item extends Component {
  constructor(props) {
    super(props);

    this.state = {
      katextText: "",
    };

    this.inputField = React.createRef();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    var { katexText } = nextProps;
    var reg = /\[math\](.*?)\[\/math\]/gu;
    katexText = reg.exec(katexText)[1];

    return {
      katexText,
    };

    return null;
  }

  componentDidMount() {
    var katexDiv = this.inputField.current;
    var { katexText } = this.state;
    try {
      // setTimeout(function () {
      katex.render(String.raw`${katexText}`, katexDiv, {
        throwOnError: true,
      });
      // }.bind(this), 1000);
    } catch (e) {
      if (e instanceof katex.ParseError) {
        var err = "Syntax error";
        katexDiv.innerHTML = err;
        // console.log("katex error 1: ", e);
      } else {
        // console.log("katex error 2: ", e);
        throw e; // other error
      }
    }
  }

  componentDidUpdate(nextProps, prevState) {
    var katexDiv = this.inputField.current;
    // var { katexText } = nextProps;
    var { katexText } = prevState;

    // var { newTimeout } = this.props;

    // katexText =  /\[math\](.*?)\[\/math\]/ug.exec(katexText);

    // var reg = /\[math\](.*?)\[\/math\]/ug;
    // katexText = reg.exec(katexText)[1];

    try {
      // console.log("nextProps: ", nextProps.newTimeout);

      // if (newTimeout === null) {

      // setTimeout(function () {
      katex.render(String.raw`${katexText}`, katexDiv, {
        // katex.render(String.raw`${katexText}`, htmlElt, {
        // katex.render(String.raw`c = \pm\sqrt{a^2 + b^2}`, katexDiv, {
        throwOnError: true,
      });
      // }.bind(this), 1000);

      // console.log("htmlElt: ", htmlElt);
      // }
    } catch (e) {
      if (e instanceof katex.ParseError) {
        // KaTeX can't parse the expression
        // var err = ("Error in LaTeX '" + katexText + "': " + e.message)
        //     .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        var err = "Syntax error";
        katexDiv.innerHTML = err;
        // console.log("katex error 1: ", e);
      } else {
        // console.log("katex error 2: ", e);
        // katexDiv.innerHTML = err;
        throw e; // other error
      }
    }
  }

  render() {
    var { katexText } = this.state;

    return (
      <div className="katexItemContainer">
        <span ref={this.inputField} className="katexItem">
          {katexText}
        </span>
      </div>
    );
  }
}

export default KaTeX_Item;
