import React, { Component } from "react";
import KaTeX_Item from "../quizzes/KaTeX_Item";
import { v4 as generateUniqueID } from "uuid";

class KaTeXQuestionPreview extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { question } = this.props;

    try {
      const previewText = this.setPreviewText(question);
      this.setState({ previewText });
    } catch (err) {
      // console.log("previewText error: ", err);
    }
  }

  render() {
    const { previewText } = this.state;

    return (
      <div className="previewTextDiv TakeQuizKatex">
        <span className="katex" ref={this.katexDiv}>
          {previewText}
        </span>
      </div>
    );
  }

  setPreviewText(someText) {
    if (someText === null) return;
    var componentsReg = /(\[math\].*?\[\/math\])/gu;

    // console.log("someText:", someText);

    var splitComponents = someText.split("\n");
    splitComponents = splitComponents.map(function (item, index) {
      if (index != splitComponents.length - 1) return item + " ...LBRK... ";
      else return item;
    });

    var lineBreakSplitKeepDelimiter = splitComponents.join("");

    splitComponents = lineBreakSplitKeepDelimiter;
    splitComponents = splitComponents.split(componentsReg);

    var reg = /\[math\](.*?)\[\/math\]/gu;

    splitComponents = splitComponents.filter(function (item) {
      return item != "";
    });
    splitComponents = splitComponents.map(function (item, index) {
      if (!item.match(reg)) {
        return item.split(" ");
      } else return item;
    });

    var newSplitComponents = [],
      katexIDs = [];

    for (var i = 0; i < splitComponents.length; i++) {
      if (typeof splitComponents[i] === "object") {
        // newSplitComponents.splice.apply(newSplitComponents, [newSplitComponents.length, 0].concat(splitComponents[i]));
        var splitKeepDelimiter = splitComponents[i].map(function (item) {
          return item + " ";
        });
        newSplitComponents.push.apply(newSplitComponents, splitKeepDelimiter);
        // newSplitComponents.push.apply(newSplitComponents, splitComponents[i]);
      } else {
        newSplitComponents.push(splitComponents[i]);
      }
      katexIDs.push(generateUniqueID());
    }

    // console.log("new split components: ", newSplitComponents);

    return (
      <div className="returnKatexDiv">
        {newSplitComponents.map(
          function (part, i) {
            if (newSplitComponents[i].match(reg) != null) {
              return <KaTeX_Item key={katexIDs[i]} katexText={newSplitComponents[i]} newTimeout={this.props.newTimeout} />;
            } else if (part === "...LBRK... ") {
              // Line break
              return <div key={katexIDs[i]} className="dummyFiller"></div>;
            } else {
              return (
                <p key={katexIDs[i]} className="nonKatexSpan">
                  {newSplitComponents[i].toString()}
                </p>
              );
            }
          }.bind(this)
        )}{" "}
      </div>
    );
  }
}

export default KaTeXQuestionPreview;
