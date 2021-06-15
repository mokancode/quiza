import React, { Component } from "react";
import KaTeX_Item from "./KaTeX_Item";
import { v4 as generateUniqueID } from "uuid";
import isEmpty from "../../validation/is-empty";

export class TakeQuiz_Answer_Item extends Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.katexDiv = React.createRef();
  }

  componentDidMount() {
    const { answer } = this.props;
    if (answer.potentialAnswer.match(/(\[math\].*?\[\/math\])/)) {
      try {
        var previewText;
        // previewText = this.setPreviewText(this.editableDivRef.current.innerText);
        previewText = this.setPreviewText(answer.potentialAnswer);
        // console.log(`katex div has been set from render ${this.editableDivRef.current.innerText}`);
        this.setState({ previewText });
      } catch (err) {
        console.log("previewText error: ", err);
      }
    }
  }

  render() {
    const { answer } = this.props;
    const { previewText } = this.state;

    return (
      <div>
        {answer.potentialAnswer.match(/(\[math\].*?\[\/math\])/) && !isEmpty(previewText) ? (
          <div className="previewTextDiv TakeQuizKatex takeQuizAnswerKatex">
            <span className="katex takeQuizAnswerKatexSpan" ref={this.katexDiv}>
              {previewText}
            </span>
          </div>
        ) : (
          <p className="questionParagraph answerParagraph">{answer.potentialAnswer}</p>
        )}
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
            // if (i!=newSplitComponents.length-1)
            if (newSplitComponents[i].match(reg) != null) {
              // console.log("katex: ", newSplitComponents[i]);
              // console.log("printing katex");
              return <KaTeX_Item key={katexIDs[i]} katexText={newSplitComponents[i]} newTimeout={this.props.newTimeout} />;
            } else if (part === "...LBRK... ") {
              // console.log("printing line break");
              return <div key={katexIDs[i]} className="dummyFiller"></div>;
            } else {
              // console.log("printing non-katex");
              // console.log("non-katex: ", newSplitComponents[i]);
              return (
                <p key={katexIDs[i]} className="nonKatexSpan">
                  {newSplitComponents[i].toString()}
                </p>
              );
            }

            // return <span key={i} className={newSplitComponents[i].match(reg) != null ? "relevantKeywords" : "notRelevantKeywords"}>
            //     {newSplitComponents[i]}
            // </span>
          }.bind(this)
        )}
      </div>
    );
  }
}

export default TakeQuiz_Answer_Item;
