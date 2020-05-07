import React from "react";
import {RouteComponentProps} from "react-router-dom";

import {ESTATE_LIST_TYPE, EstateList} from "~pages/commons/estate/estate-list";
import {dummyOwnedEstateList} from "~pages/dummy-var";
import {PATHS} from "~pages/routes";
import {Config} from "~src/heplers/config";
import {Repositories} from "~src/repos/types";

interface Props extends RouteComponentProps {
  config: Config;
  repos: Repositories;
  setHeaderText: (headerText: string) => void;
}

export class OwnedList extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.setHeaderText("Mypage");
  }

  render() {
    const {history} = this.props;
    return (
      <div>
        <EstateList
          type={ESTATE_LIST_TYPE.OWNED}
          estateList={dummyOwnedEstateList}
          onClick={(tokenId: string) => () => {
            history.push(`${PATHS.OWNED}/${tokenId}`);
          }}
        />
      </div>
    );
  }
}
