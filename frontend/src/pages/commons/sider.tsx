import DollarOutlined from "@ant-design/icons/DollarOutlined";
import ToolOutlined from "@ant-design/icons/ToolOutlined";
import UserAddOutlined from "@ant-design/icons/UserAddOutlined";
import {Layout, Menu} from "antd";
import React from "react";
import {RouteComponentProps} from "react-router-dom";

import {User} from "~models/user";
import {PATHS} from "~pages/routes";

const {Sider} = Layout;

interface Props extends RouteComponentProps {
  user: User;
}

export const SiderComponent = (props: Props) => {
  const {user} = props;
  return (
    <Sider width={170}>
      <Menu theme={"dark"} mode="inline" style={{height: "100%"}}>
        <Menu.Item
          key="MarketPlace"
          icon={<DollarOutlined />}
          onClick={() => {
            props.history.push(PATHS.MARKET);
          }}
        >
          MarketPlace
        </Menu.Item>
        <Menu.Item
          key="Mypage"
          icon={<UserAddOutlined />}
          onClick={() => {
            props.history.push(PATHS.OWNED);
          }}
        >
          Mypage
        </Menu.Item>
        {user.name === "issuer" && (
          <Menu.Item
            key="Issuer"
            icon={<ToolOutlined />}
            onClick={() => {
              props.history.push(PATHS.ISSUE);
            }}
          >
            Issuer
          </Menu.Item>
        )}
      </Menu>
    </Sider>
  );
};
