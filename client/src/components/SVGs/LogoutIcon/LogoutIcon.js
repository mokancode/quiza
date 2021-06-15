import React, { Component } from "react";
import "./LogoutIcon.css";

export class LogoutIcon extends Component {
  render() {
    return (
      <svg
        className="navbarIcon logoutIconSVG"
        x="0px"
        y="0px"
        viewBox="0 0 595.28 706.21"
        style={{ "enableBackground": "new 0 0 595.28 706.21" }}
        xmlSpace="preserve"
      >
        <path
          className="logoutIconPath0"
          d="M35.99,593.54V52.52c0-9.66,7.83-17.49,17.49-17.49H431.5c9.66,0,17.49,7.83,17.49,17.49v146.63"
        />
        <path className="logoutIconPath0" d="M448.99,419.74v173.8c0,9.66-7.83,17.49-17.49,17.49H301.21" />
        <path
          id="top"
          className="logoutIconPath0"
          d="M284.93,690.42L48.34,631.43c-7.25-1.81-12.35-8.49-12.33-16.18l0.85-557.42
            c0.02-10.7,9.71-18.6,19.82-16.15l235.74,57.17c7.28,1.77,12.43,8.46,12.43,16.17v559.24C304.85,685.03,295.08,692.95,284.93,690.42
            z"
        />
        <path
          className="logoutIconPath1"
          d="M568.99,306.82l-80.08-46.27c-7.39-4.27-16.63,1.06-16.64,9.6l-0.01,29.65H365.81c-6.6,0-12,5.4-12,12v9.19
            c0,6.6,5.4,12,12,12h106.45l-0.01,29.64c0,8.54,9.24,13.87,16.63,9.61l80.11-46.21C576.38,321.76,576.38,311.09,568.99,306.82z"
        />
      </svg>
    );
  }
}

export default LogoutIcon;
