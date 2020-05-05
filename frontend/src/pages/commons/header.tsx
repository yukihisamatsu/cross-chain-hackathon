import {Layout} from "antd";
import React from "react";
import styled from "styled-components";

const {Header} = Layout;

interface Props {
  headerTitle: string;
}

export const HeaderComponent = (props: Props) => {
  return (
    <Header className="header">
      <HeaderTextWrap>
        <HeaderText>{props.headerTitle}</HeaderText>
      </HeaderTextWrap>
    </Header>
  );
};

const HeaderTextWrap = styled.div`
  display: flex;
  justify-content: space-between;
`;

const HeaderText = styled.div`
  color: white;
  font-size: 1.6rem;
`;
