import React from "react";
import {Redirect, Route} from "react-router-dom";

import {LocalStorageUserKey} from "~pages/consts";
import {PATHS} from "~src/pages/routes";

export class Authenticated extends React.Component {
  render() {
    const userJson = localStorage.getItem(LocalStorageUserKey);
    if (userJson) {
      return <Route {...this.props} children={this.props.children} />;
    } else {
      return <Redirect to={{pathname: PATHS.SIGN_UP}} />;
    }
  }
}
