import {Layout} from "antd";
import React from "react";
import {HashRouter, Route} from "react-router-dom";
import styled from "styled-components";
import {Reset} from "styled-reset";

import {FooterComponent} from "~pages/commons/footer";
import {HeaderComponent} from "~pages/commons/header";
import {SiderComponent} from "~pages/commons/sider";
import {ContentSwitch} from "~pages/contents/content.switch";
import {Config} from "~src/heplers/config";
import {Repositories} from "~src/repos/types";

const {Content} = Layout;

interface Props {
  config: Config;
  repos: Repositories;
}

interface State {
  headerTitle: string;
}

export class Root extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      headerTitle: ""
    };
  }

  setHeaderTitle = (headerTitle: string) => {
    this.setState({headerTitle});
  };

  render() {
    const {config, repos} = this.props;
    return (
      <HashRouter>
        <Reset />
        <Route
          render={props => {
            return (
              <MainLayout>
                <HeaderComponent headerTitle={this.state.headerTitle} />
                <Layout>
                  <SiderComponent {...props} />
                  <ContentLayout>
                    <ContentWrap>
                      <ContentSwitch
                        config={config}
                        repos={repos}
                        setHeaderTitle={this.setHeaderTitle}
                      />
                    </ContentWrap>
                  </ContentLayout>
                </Layout>
                <FooterComponent />
              </MainLayout>
            );
          }}
        />
      </HashRouter>
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
