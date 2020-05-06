import {Layout} from "antd";
import React from "react";
import {BrowserRouter, Route} from "react-router-dom";
import styled from "styled-components";
import {Reset} from "styled-reset";

import {FooterComponent} from "~pages/commons/footer";
import {HeaderComponent} from "~pages/commons/header";
import {SiderComponent} from "~pages/commons/sider";
import {ContentSwitch} from "~pages/contents/content.switch";

const {Content} = Layout;

interface State {
  headerTitle: string;
}

export class Root extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = {
      headerTitle: "Home"
    };
  }

  setHeaderTitle = (headerTitle: string) => {
    this.setState({headerTitle});
  };

  render() {
    return (
      <BrowserRouter>
        <Reset />
        <Route
          render={props => {
            return (
              <MainLayout>
                <HeaderComponent headerTitle={this.state.headerTitle} />
                <Layout>
                  <SiderComponent history={props.history} />
                  <ContentLayout>
                    <ContentWrap>
                      <ContentSwitch setHeaderTitle={this.setHeaderTitle} />
                    </ContentWrap>
                  </ContentLayout>
                </Layout>
                <FooterComponent />
              </MainLayout>
            );
          }}
        />
      </BrowserRouter>
    );
  }
}

const MainLayout = styled(Layout)`
  height: 100%;
  min-height: 768px;
  font-size: 100%;
`;

const ContentLayout = styled(Layout)`
  padding: 10px 24px 0;
`;

const ContentWrap = styled(Content)`
  padding: 24px;
  margin: 0;
  overflow: scroll;
`;
