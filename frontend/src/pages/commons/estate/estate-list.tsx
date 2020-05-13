import UserOutlined from "@ant-design/icons/UserOutlined";
import {Card, Tag} from "antd";
import React from "react";
import styled from "styled-components";

import {ESTATE_STATUS, EstateExtend, OwnedEstate} from "~models/estate";
import {OwnedEstateStatusTagColorMap} from "~pages/consts";

interface Props {
  estateList: EstateExtend[];
  onClick: (tokenId: string) => React.MouseEventHandler;
}

export class EstateList extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    const {estateList, onClick} = this.props;
    return (
      <div>
        <EstateListWrap>
          {estateList.map(estate => {
            return (
              <EstateStyledCard
                key={estate.tokenId}
                hoverable
                onClick={onClick(estate.tokenId)}
                cover={
                  <img
                    style={{height: "266px"}}
                    alt={estate.name}
                    src={`/assets/img/${estate.imagePath}`}
                  />
                }
              >
                <EstateTextWrap>
                  <EstateTitle>{estate.name}</EstateTitle>
                  <EstateTokenId>ID: {estate.tokenId}</EstateTokenId>
                  <EstateIssuerName>
                    <UserOutlined /> Issued by {estate.issuedBy}
                  </EstateIssuerName>
                  {isOwnedEstate(estate) && (
                    <EstateUnits>
                      Units: {estate.units.toString(10) ?? "0"}
                    </EstateUnits>
                  )}

                  {isOwnedEstate(estate) &&
                    estate.status !== ESTATE_STATUS.OWNED && (
                      <div>
                        <Tag
                          color={OwnedEstateStatusTagColorMap[estate.status]}
                        >
                          {estate.status}
                        </Tag>
                      </div>
                    )}
                </EstateTextWrap>
              </EstateStyledCard>
            );
          })}
        </EstateListWrap>
      </div>
    );
  }
}

function isOwnedEstate(e: EstateExtend): e is OwnedEstate {
  return !!e.status;
}

const EstateListWrap = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  word-break: break-all;
`;

const EstateStyledCard = styled(Card)`
  flex-basis: 400px;
  margin: 10px;
`;

const EstateTextWrap = styled.div`
  display: flex;
  flex-direction: column;
`;

const EstateTitle = styled.div`
  font-weight: 900;
  font-size: 1.2rem;
  padding: 0 0 5px;
  color: black;
`;

const EstateTokenId = styled.div`
  font-size: 0.8rem;
  font-weight: 200;
  padding: 0 0 15px;
  color: darkgray;
`;

const EstateIssuerName = styled.div`
  font-size: 0.8rem;
  font-weight: 200;
  color: darkgray;

  padding-bottom: 20px;
`;

const EstateUnits = styled.div`
  font-size: 1rem;
  padding: 0 0 5px;
`;
