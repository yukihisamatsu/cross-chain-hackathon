import React from "react";
import {RouteComponentProps} from "react-router-dom";

import {IssuerEstate} from "~models/estate";
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
  estates: IssuerEstate[];
}

export class IssueList extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    props.setHeaderText("Issuer");
    this.state = {estates: []};
  }

  async componentDidMount() {
    await this.getEstatesList();
  }

  async componentDidUpdate(prevProps: Readonly<Props>, _: Readonly<State>) {
    if (prevProps.user.address !== this.props.user.address) {
      await this.getEstatesList();
    }
  }

  async getEstatesList() {
    const {
      repos: {estateRepo}
    } = this.props;
    const estates = await estateRepo.getIssuerEstates();
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
            history.push(`${PATHS.ISSUE}/${tokenId}`);
          }}
        />
      </div>
    );
  }
}
