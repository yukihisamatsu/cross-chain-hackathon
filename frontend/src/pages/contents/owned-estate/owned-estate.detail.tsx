import React from "react";

import {EstateDetail} from "~pages/commons/estate/estate-detail";
import {ESTATE_LIST_TYPE} from "~pages/commons/estate/estate-list";

interface Props {
  id: string;
}

export class OwnedEstateDetail extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }
  render() {
    const {id} = this.props;
    return (
      <div>
        <EstateDetail type={ESTATE_LIST_TYPE.OWNED} tokenId={id} />
      </div>
    );
  }
}
