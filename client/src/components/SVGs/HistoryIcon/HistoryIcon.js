import React, { Component } from "react";
import "./HistoryIcon.css";

export class HistoryIcon extends Component {
  render() {
    return (
      <svg
        className="navbarIcon historyIconSVG"
        x="0px"
        y="0px"
        viewBox="0 0 595.28 841.89"
        style={{ "enableBackground": "new 0 0 595.28 841.89" }}
        xmlSpace="preserve"
      >
        <path
          className="historyIconPath0"
          d="M506,657v54c0,23.2-18.8,42-42,42H132c-23.2,0-42-18.8-42-42V147c0-23.2,18.8-42,42-42h332
            c23.2,0,42,18.8,42,42l-2,159"
        />
        <rect x="126" y="180" className="historyIconPath0" width="243" height="3" />
        <rect x="126" y="476.25" className="historyIconPath0" width="90" height="3" />
        <rect x="126" y="324" className="historyIconPath0" width="180" height="3" />
        <rect x="126" y="621" className="historyIconPath0" width="135" height="3" />
        <circle className="historyIconPath0" cx="405" cy="486" r="162" />
        <polyline className="historyIconPath1" points="405,369 405,513 495,513 " />
      </svg>
    );
  }
}

export default HistoryIcon;
