import React from "react";
import {Redirect, Route} from "react-router-dom";

import {PATHS} from "~src/pages/routes";

export class Authenticated extends React.Component {
  render() {
    const isSignIn = localStorage.getItem("MNEMONIC");
    // TODO validate Mnemonic
    if (isSignIn) {
      return <Route {...this.props} />;
    } else {
      return <Redirect to={{pathname: PATHS.SIGN_UP}} />;
    }
  }
}
