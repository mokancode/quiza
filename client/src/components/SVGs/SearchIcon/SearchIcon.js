import React, { Component } from "react";
import "./SearchIcon.css";

export class SearchIcon extends Component {
  render() {
    return (
      <svg
        className="navbarIcon searchIconSVG"
        x="0px"
        y="0px"
        viewBox="0 0 595.28 841.89"
        style={{ "enableBackground": "new 0 0 595.28 841.89" }}
        xmlSpace="preserve"
      >
        <circle className="searchIconPath0" cx="297.64" cy="253.47" r="189" />
        <path
          className="searchIconPath1"
          d="M297.64,787.41L297.64,787.41c-39.76,0-72-32.24-72-72v-189c0-39.76,32.24-72,72-72h0c39.76,0,72,32.24,72,72
                v189C369.64,755.18,337.4,787.41,297.64,787.41z"
        />
        <path className="searchIconPath1" d="M297.64,181.47" />
        <g>
          <path
            d="M232.47,113.1c-27.14,9.91-49.84,40.81-52.36,52.32c-0.65,2.95-0.64,9.02,4.78,8.99c1.36-0.01,2.53-1.81,2.93-2.73
                c3.61-8.32,24.96-55.64,93.8-56.84c0.9-0.02,1.79-0.11,2.69-0.1c8.62,0.15,9.95-8.1-4.82-8.94
                C277.07,105.67,253.22,105.51,232.47,113.1z"
          />
          <path
            className="searchIconPath2"
            d="M239.39,137.13c-27.14,9.91-49.84,40.81-52.36,52.32c-0.65,2.95-0.64,9.02,4.78,8.99
                c1.36-0.01,2.53-1.81,2.93-2.73c3.61-8.32,24.96-55.64,93.8-56.84c0.9-0.02,1.79-0.11,2.69-0.1c8.62,0.15,9.95-8.1-4.82-8.94
                C284,129.71,260.15,129.55,239.39,137.13z"
          />
        </g>
      </svg>
    );
  }
}

export default SearchIcon;
