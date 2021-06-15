import React, { Component } from "react";

export class Spinner extends Component {
  render() {
    const { friendRequestsNamesListLength } = this.props;

    return (
      <div className="spinnerDiv">
        {!friendRequestsNamesListLength ? (
          <img src="/images/131.png" alt="Loading..." style={{ width: "50px", margin: "auto", display: "block" }}></img>
        ) : null}
      </div>
    );
  }
}

export default Spinner;
