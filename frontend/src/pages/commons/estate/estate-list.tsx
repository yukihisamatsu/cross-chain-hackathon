import {Card, Tag} from "antd";
import React from "react";
import styled from "styled-components";

import {OwnedEstateStatusTagColorMap} from "~pages/consts";
import {Estate} from "~pages/types";
import {Unbox} from "~src/heplers/util-types";

export type EstateListType = Unbox<typeof ESTATE_LIST_TYPE>;
export const ESTATE_LIST_TYPE = {
  OWNED: "owned",
  MARKET: "market",
  ISSUER: "issuer"
} as const;

interface Props {
  type: EstateListType;
  estateList: Estate[];
  onClick: (tokenId: string) => React.MouseEventHandler;
}

export class EstateList extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    const {estateList, type, onClick} = this.props;
    return (
      <div>
        <EstateListWrap>
          {estateList.map(estate => {
            return (
              <EstateStyled
                key={estate.tokenId}
                hoverable
                onClick={onClick(estate.tokenId)}
                cover={<img alt={estate.name} src={estate.imagePath} />}
              >
                <EstateTextWrap>
                  <EstateTitle>{estate.name}</EstateTitle>
                  <div>ID: {estate.tokenId}</div>
                  <EstateIssuerName>{estate.issuedBy}</EstateIssuerName>
                  <EstateUnits>Units: {estate.units ?? "0"}</EstateUnits>
                  {type == ESTATE_LIST_TYPE.OWNED && estate.status && (
                    <div>
                      <Tag
                        color={
                          OwnedEstateStatusTagColorMap[estate.status] ?? "green"
                        }
                      >
                        {estate.status}
                      </Tag>
                    </div>
                  )}
                </EstateTextWrap>
              </EstateStyled>
            );
          })}
        </EstateListWrap>
      </div>
    );
  }
}

const EstateListWrap = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  word-break: break-all;
`;

const EstateStyled = styled(Card)`
  flex-basis: 240px;
  width: 240px;
  margin: 10px;
`;

const EstateTextWrap = styled.div`
  display: flex;
  flex-direction: column;
`;

const EstateTitle = styled.div`
  font-weight: 900;
  font-size: 1.1rem;
  padding: 0 0 15px;
`;

const EstateIssuerName = styled.div`
  font-size: 1.1rem;
  padding: 0 0 5px;
`;

const EstateUnits = styled.div`
  font-size: 1rem;
  padding: 0 0 5px;
`;
