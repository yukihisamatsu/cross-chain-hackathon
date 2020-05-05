import DollarOutlined from "@ant-design/icons/DollarOutlined";
import UserAddOutlined from "@ant-design/icons/UserAddOutlined";
import {Layout, Menu} from "antd";
import React from "react";
import {RouteComponentProps} from "react-router-dom";

import {PATHS} from "~pages/routes";

const {Sider} = Layout;

type Props = Pick<RouteComponentProps, "history">;

export const SiderComponent = (props: Props) => {
  return (
    <Sider width={170}>
      <Menu theme={"dark"} mode="inline" style={{height: "100%"}}>
        <Menu.Item
          key="Market"
          icon={<DollarOutlined />}
          onClick={() => {
            props.history.push(PATHS.MARKET);
          }}
        >
          Market
        </Menu.Item>
        <Menu.Item
          key="OwnedEstates"
          icon={<UserAddOutlined />}
          onClick={() => {
            props.history.push(PATHS.OWNED);
          }}
        >
          Owned Estates
        </Menu.Item>
      </Menu>
    </Sider>
  );
};
