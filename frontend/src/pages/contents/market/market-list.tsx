import React from "react";
import {RouteComponentProps} from "react-router-dom";

import {EstateList} from "~pages/commons/estate/estate-list";
import {dummyOwnedEstateList} from "~pages/dummy-var";
import {PATHS} from "~pages/routes";

interface Props extends Pick<RouteComponentProps, "history"> {
  setHeaderText: (headerText: string) => void;
}

export class MarketList extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.setHeaderText("");
  }

  render() {
    const {history} = this.props;
    return (
      <div>
        <EstateList
          type={"market"}
          estateList={dummyOwnedEstateList}
          onClick={(tokenId: string) => () => {
            history.push(`${PATHS.MARKET}/${tokenId}`);
          }}
        />
      </div>
    );
  }
}
