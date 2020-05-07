import React from "react";
import {RouteComponentProps} from "react-router-dom";

import {ESTATE_LIST_TYPE, EstateList} from "~pages/commons/estate/estate-list";
import {dummyMarketEstateList} from "~pages/dummy-var";
import {PATHS} from "~pages/routes";

interface Props extends Pick<RouteComponentProps, "history"> {
  setHeaderText: (headerText: string) => void;
}

export class IssueList extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.setHeaderText("");
  }

  render() {
    const {history} = this.props;
    return (
      <div>
        <EstateList
          type={ESTATE_LIST_TYPE.ISSUE}
          estateList={dummyMarketEstateList}
          onClick={(tokenId: string) => () => {
            history.push(`${PATHS.ISSUE}/${tokenId}`);
          }}
        />
      </div>
    );
  }
}
