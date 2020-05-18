import {Layout} from "antd";
import log from "loglevel";
import React from "react";
import {HashRouter, Route} from "react-router-dom";
import styled from "styled-components";
import {Reset} from "styled-reset";

import {User} from "~models/user";
import {FooterComponent} from "~pages/commons/footer";
import {HeaderComponent} from "~pages/commons/header";
import {SiderComponent} from "~pages/commons/sider";
import {LocalStorageUserKey} from "~pages/consts";
import {ContentSwitch} from "~pages/contents/content.switch";
import {Config} from "~src/heplers/config";
import {Repositories} from "~src/repos/types";

const {Content} = Layout;

interface Props {
  config: Config;
  repos: Repositories;
}

interface State {
  user: User;
  headerTitle: string;
}

export class Root extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      user: User.default(),
      headerTitle: ""
    };
  }

  timeOutId = 0;

  async componentDidMount() {
    const data = localStorage.getItem(LocalStorageUserKey);
    if (!data) {
      return;
    }
    const user = User.create(data);
    await this.setUser(user);
  }

  async componentDidUpdate(_: Readonly<Props>, prevState: Readonly<State>) {
    if (prevState.user.address === this.state.user.address) {
      await this.balanceOfCoinTimer();
    }
  }

  setUser = async (user: User) => {
    const {
      repos: {userRepo}
    } = this.props;
    let balance: number;
    try {
      balance = user.address ? await userRepo.balanceOf(user.address) : 0;
    } catch (e) {
      balance = user.balance;
      log.error(e);
    }
    const isWhitelisted = user.address
      ? await userRepo.isWhitelisted(user.address)
      : false;
    this.setState({user: {...user, balance, isWhitelisted}}, () => {
      this.balanceOfCoinTimer().catch(log.error);
    });
  };

  balanceOfCoinTimer = async () => {
    const {
      repos: {userRepo}
    } = this.props;
    this.timeOutId !== 0 && clearTimeout(this.timeOutId);
    const {user} = this.state;
    if (!user.address) {
      return;
    }
    this.timeOutId = window.setTimeout(async () => {
      let balance: number;
      try {
        balance = await userRepo.balanceOf(user.address);
      } catch (e) {
        balance = user.balance;
        log.error(e);
      }
      this.setState({
        user: {
          ...user,
          balance
        }
      });
      await this.balanceOfCoinTimer();
    }, 10000);
  };

  setHeaderTitle = (headerTitle: string) => {
    this.setState({headerTitle});
  };

  render() {
    const {config, repos} = this.props;
    const {user, headerTitle} = this.state;
    return (
      <HashRouter>
        <Reset />
        <Route
          render={props => {
            return (
              <MainLayout>
                <HeaderComponent
                  user={user}
                  headerTitle={headerTitle}
                  setUser={this.setUser}
                  {...props}
                />
                <Layout>
                  <SiderComponent user={user} {...props} />
                  <ContentLayout>
                    <ContentWrap>
                      <ContentSwitch
                        config={config}
                        repos={repos}
                        user={user}
                        setUser={this.setUser}
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
  max-width: 1440px;
  padding: 10px 24px 0;
`;

const ContentWrap = styled(Content)`
  padding: 24px;
  margin: 0;
  overflow: scroll;
`;
