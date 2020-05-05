import {Layout} from "antd";
import React from "react";
import styled from "styled-components";

const {Footer} = Layout;

export const FooterComponent = () => {
  return (
    <FooterWrap>
      <div>2020 © Datachain,inc.</div>
    </FooterWrap>
  );
};

const FooterWrap = styled(Footer)`
  display: flex;
  justify-content: center;
`;
