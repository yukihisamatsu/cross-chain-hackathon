import React from "react";
import styled from "styled-components";

import {renderEstateDetailDividendTable} from "~pages/commons/estate/estate-detail-dividend-table";
import {renderEstateDetailInfo} from "~pages/commons/estate/estate-detail-info";
import {
  ESTATE_LIST_TYPE,
  EstateListType
} from "~pages/commons/estate/estate-list";
import {renderEstateSellOrderTable} from "~pages/commons/estate/estate-sell-order-table";
import {dummyOwnedEstateList} from "~pages/dummy-var";

interface Props {
  type: EstateListType;
  tokenId: string;
}

export class EstateDetail extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  handleBuyOrderButtonClick = (tokenId: string) => () => {
    alert(tokenId);
  };

  render() {
    const {type, tokenId} = this.props;
    const estate = dummyOwnedEstateList.find(e => e.tokenId === tokenId);

    return estate ? (
      <EstateDetailWrap>
        {renderEstateDetailInfo(type, estate)}
        {type === ESTATE_LIST_TYPE.OWNED &&
          renderEstateDetailDividendTable(estate.dividend)}
        {type === ESTATE_LIST_TYPE.MARKET &&
          renderEstateSellOrderTable(
            estate.sellOrder,
            this.handleBuyOrderButtonClick
          )}
      </EstateDetailWrap>
    ) : (
      <div>
        <div>Id: {tokenId}</div>
        <div>estate not found</div>
      </div>
    );
  }
}

const EstateDetailWrap = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;
