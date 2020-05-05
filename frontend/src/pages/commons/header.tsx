import {Layout} from "antd";
import React from "react";
import styled from "styled-components";

const {Header} = Layout;

export const HeaderComponent = () => {
  return (
    <Header className="header">
      <HeaderTextWrap>
        <HeaderText>Test</HeaderText>
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
  font-size: 1.5rem;
`;
