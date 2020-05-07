import React from "react";
import {RouteComponentProps} from "react-router-dom";

import {Config} from "~src/heplers/config";
import {Repositories} from "~src/repos/types";

interface Props extends RouteComponentProps {
  config: Config;
  repos: Repositories;
  setHeaderText: (headerText: string) => void;
}

export class SignUp extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    return <div>SignUp</div>;
  }
}
