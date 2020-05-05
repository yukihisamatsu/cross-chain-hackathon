import {Layout} from "antd";
import React from "react";
import {BrowserRouter} from "react-router-dom";
import styled from "styled-components";

import {FooterComponent} from "~src/pages/commons/footer";
import {HeaderComponent} from "~src/pages/commons/header";
import {SiderComponent} from "~src/pages/commons/sider";
import {ContentSwitch} from "~src/pages/contents/content.switch";

const {Content} = Layout;

export class Root extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <MainLayout>
          <HeaderComponent />
          <Layout>
            <SiderComponent />
            <ContentLayout>
              <ContentWrap>
                <ContentSwitch />
              </ContentWrap>
            </ContentLayout>
          </Layout>
          <FooterComponent />
        </MainLayout>
      </BrowserRouter>
    );
  }
}

const MainLayout = styled(Layout)`
  height: 100%;
  min-height: 768px;
`;

const ContentLayout = styled(Layout)`
  padding: 10px 24px 0;
`;

const ContentWrap = styled(Content)`
  background: #fff;
  padding: 24px;
  margin: 0;
  overflow: scroll;
`;
