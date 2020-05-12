import {Button, Layout} from "antd";
import React from "react";
import {RouteComponentProps} from "react-router";
import styled from "styled-components";

import {User} from "~models/user";
import {LocalStorageUserKey} from "~pages/consts";
import {PATHS} from "~pages/routes";

const {Header} = Layout;

interface Props extends RouteComponentProps {
  user: User;
  headerTitle: string;
  setUser: (user: User) => Promise<void>;
}

export class HeaderComponent extends React.PureComponent<Props> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    const {user, headerTitle, setUser, history} = this.props;
    return (
      <HeaderStyled className="header">
        <HeaderTextWrap>
          <HeaderText>{headerTitle}</HeaderText>
        </HeaderTextWrap>
        <RightBlock>
          <UserTextWrap>
            <UserText>
              <span>{user.address}</span>
            </UserText>
            <UserText>
              <span>{user.name}</span>
            </UserText>
            <UserText>
              <span>{user.balance} DCC</span>
            </UserText>
          </UserTextWrap>
          <LogoutButton
            type={"default"}
            onClick={async () => {
              localStorage.removeItem(LocalStorageUserKey);
              await setUser(User.default());
              history.push(PATHS.SIGN_UP);
            }}
          >
            LOGOUT
          </LogoutButton>
        </RightBlock>
      </HeaderStyled>
    );
  }
}

const HeaderStyled = styled(Header)`
  display: flex;
  justify-content: space-between;
  padding-right: 30px;
`;

const HeaderTextWrap = styled.div``;

const HeaderText = styled.div`
  color: white;
  font-size: 1.6rem;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const RightBlock = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const UserTextWrap = styled.div`
  height: 100%;
  padding-right: 20px;
`;

const UserText = styled.div`
  font-size: 0.8rem;
  color: darkgray;
  text-align: right;
  height: 29%;
  line-height: 26px;
`;

const LogoutButton = styled(Button)`
  margin-top: 10px;
`;
