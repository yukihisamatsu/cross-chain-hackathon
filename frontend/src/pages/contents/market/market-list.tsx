import React from "react";
import {RouteComponentProps} from "react-router-dom";

import {MarketEstate} from "~models/estate";
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
  estates: MarketEstate[];
}

export class MarketList extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      estates: []
    };
    props.setHeaderText("MarketPlace");
  }

  async componentDidMount() {
    const {repos} = this.props;
    const estates = await repos.estateRepo.getMarketEstates();
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
            history.push(`${PATHS.MARKET}/${tokenId}`);
          }}
        />
      </div>
    );
  }
}
