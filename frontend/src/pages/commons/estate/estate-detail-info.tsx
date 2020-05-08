import UserOutlined from "@ant-design/icons/UserOutlined";
import {Tag} from "antd";
import React from "react";
import styled from "styled-components";

import {
  ESTATE_LIST_TYPE,
  EstateListType
} from "~pages/commons/estate/estate-list";
import {OwnedEstateStatusTagColorMap} from "~pages/consts";
import {Estate} from "~src/models/estate";

export const renderEstateDetailInfo = (
  type: EstateListType,
  estate: Estate
) => {
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
          src={estate.imagePath}
          alt={estate.name}
        />
      </EstateInfoImageWrap>
      <EstateInfoDetailWrap>
        {type == ESTATE_LIST_TYPE.OWNED && estate.status && (
          <EstateInfoDetailStatus>
            <EstateInfoDetailStatusTag
              color={OwnedEstateStatusTagColorMap[estate.status] ?? "green"}
            >
              {estate.status}
            </EstateInfoDetailStatusTag>
          </EstateInfoDetailStatus>
        )}
        <EstateInfoDetailName>{estate.name}</EstateInfoDetailName>
        <EstateInfoDetailTokenId>id: {estate.tokenId}</EstateInfoDetailTokenId>
        <EstateInfoDetailIssuedBy>
          <UserOutlined /> Issued by{" "}
          <span style={{color: "cornflowerblue"}}>{estate.issuedBy}</span>
        </EstateInfoDetailIssuedBy>
        {type !== ESTATE_LIST_TYPE.MARKET && (
          <EstateInfoDetailUnits>
            Units: {estate.units ?? "0"}
          </EstateInfoDetailUnits>
        )}
        <EstateInfoDetailDescription>
          {estate.description}
        </EstateInfoDetailDescription>
      </EstateInfoDetailWrap>
    </EstateInfoWrap>
  );
};

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

const EstateInfoDetailUnits = styled.div`
  font-size: 0.9rem;
  font-weight: 200;
  color: black;

  padding-bottom: 20px;
`;

const EstateInfoDetailDescription = styled.div`
  font-size: 0.9rem;
  font-weight: 200;
  color: darkgray;
  line-height: 1.3rem;

  padding-bottom: 20px;
`;
