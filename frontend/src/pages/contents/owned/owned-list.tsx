import React from "react";
import {RouteComponentProps} from "react-router-dom";

import {OwnedEstate} from "~models/estate";
import {User} from "~models/user";
import {EstateList} from "~pages/commons/estate/estate-list";
import {PATHS} from "~pages/routes";
import {Config} from "~src/heplers/config";
import {Repositories} from "~src/repos/types";

interface Props extends RouteComponentProps {
  config: Config;
  repos: Repositories;
  user: User;
  setHeaderText: (headerText: string) => void;
}

interface State {
  estates: OwnedEstate[];
}

export class OwnedList extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    props.setHeaderText("Mypage");

    this.state = {
      estates: []
    };
  }

  async componentDidMount() {
    const {repos, user} = this.props;
    const estates = await repos.estateRepo.getOwnedEstates(user.address);
    this.setState({estates});
  }

  render() {
    const {history} = this.props;
    const {estates} = this.state;
    return (
      <div>
        <EstateList
          estateList={estates}
          onClick={(tokenId: string) => () => {
            history.push(`${PATHS.OWNED}/${tokenId}`);
          }}
        />
      </div>
    );
  }
}
