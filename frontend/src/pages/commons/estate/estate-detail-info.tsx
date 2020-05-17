import UserOutlined from "@ant-design/icons/UserOutlined";
import {Tag} from "antd";
import React from "react";
import styled from "styled-components";

import {OwnedEstateStatusTagColorMap} from "~pages/consts";
import {
  ESTATE_STATUS,
  EstateExtend,
  IssuerEstate,
  OwnedEstate
} from "~src/models/estate";

export const renderEstateDetailInfo = (estate: EstateExtend) => {
  return (
    <EstateInfoWrap>
      <EstateInfoImageWrap>
        <img
          width={"auto"}
          style={{
            display: "block",
            width: "100%",
            height: "auto",
            maxWidth: "500px"
          }}
          src={`/assets/img/${estate.imagePath}`}
          alt={estate.name}
        />
      </EstateInfoImageWrap>
      <EstateInfoDetailWrap>
        {isOwnedEstate(estate) && estate.status !== ESTATE_STATUS.OWNED && (
          <EstateInfoDetailStatus>
            <EstateInfoDetailStatusTag
              color={OwnedEstateStatusTagColorMap[estate.status]}
            >
              {estate.status}
            </EstateInfoDetailStatusTag>
          </EstateInfoDetailStatus>
        )}
        <EstateInfoDetailName>{estate.name}</EstateInfoDetailName>
        <EstateInfoDetailTokenId>id: {estate.tokenId}</EstateInfoDetailTokenId>
        <EstateInfoDetailIssuedBy>
          <UserOutlined /> Issued by{" "}
          <EstateInfoDetailIssuedByAddress>
            {estate.issuedBy}
          </EstateInfoDetailIssuedByAddress>
        </EstateInfoDetailIssuedBy>
        {isOwnedEstate(estate) && (
          <EstateInfoDetailUnits>
            Units: {estate.units.toString(10) ?? "0"}
          </EstateInfoDetailUnits>
        )}
        <EstateInfoDetailPlaneDividend>
          ・Planned dividend: {estate.dividendDate}
        </EstateInfoDetailPlaneDividend>
        <EstateInfoDetailExpectedYield>
          ・Expected dividend per unit: {estate.expectedYield}
        </EstateInfoDetailExpectedYield>
        {isIssuerEstate(estate) && (
          <EstateMaxNumberOfPeople>
            ・Max number of people: 3
          </EstateMaxNumberOfPeople>
        )}
        <EstateInfoDetailDescription>
          {estate.description}
        </EstateInfoDetailDescription>
      </EstateInfoDetailWrap>
    </EstateInfoWrap>
  );
};

function isOwnedEstate(e: EstateExtend): e is OwnedEstate {
  return !!e.status;
}

function isIssuerEstate(e: EstateExtend): e is IssuerEstate {
  return !!e.owners;
}

const EstateInfoWrap = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
`;

const EstateInfoImageWrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-basis: 50%;

  background-color: white;
  min-width: 360px;
  padding: 5px;
`;

const EstateInfoDetailWrap = styled.div`
  flex-basis: 50%;
  padding: 15px;
`;

const EstateInfoDetailStatus = styled.div`
  padding-bottom: 10px;
`;

const EstateInfoDetailStatusTag = styled(Tag)`
  font-size: 1rem;
  padding: 2px 10px;
`;

const EstateInfoDetailName = styled.div`
  font-size: 1.5rem;
  font-weight: 800;
  color: black;

  padding-bottom: 10px;
`;

const EstateInfoDetailTokenId = styled.div`
  font-size: 0.8rem;
  font-weight: 200;
  color: darkgray;

  padding-bottom: 20px;
`;

const EstateInfoDetailIssuedBy = styled.div`
  font-size: 0.9rem;
  font-weight: 200;
  color: darkgray;

  padding-bottom: 20px;
`;

const EstateInfoDetailIssuedByAddress = styled.span`
  color: cornflowerblue;
`;

const EstateInfoDetailUnits = styled.div`
  font-size: 0.9rem;
  font-weight: 200;
  color: black;

  padding-bottom: 20px;
`;

const EstateInfoDetailPlaneDividend = styled.div`
  font-size: 0.9rem;
  font-weight: 200;
  color: #777777;

  padding-bottom: 5px;
`;

const EstateInfoDetailExpectedYield = styled.div`
  font-size: 0.9rem;
  font-weight: 200;
  color: #777777;

  padding-bottom: 5px;
`;

const EstateMaxNumberOfPeople = styled.div`
  font-size: 0.9rem;
  font-weight: 200;
  color: #777777;

  padding-bottom: 5px;
`;

const EstateInfoDetailDescription = styled.div`
  font-size: 0.9rem;
  font-weight: 200;
  color: darkgray;
  line-height: 1.3rem;

  padding: 20px 0;
`;
