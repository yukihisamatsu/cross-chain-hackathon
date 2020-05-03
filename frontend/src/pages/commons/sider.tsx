import {Layout, Menu} from "antd";
import React from "react";
import {Link} from "react-router-dom";

import {PATHS} from "~src/pages/routes";

const {Sider} = Layout;

export const SiderComponent = () => {
  return (
    <Sider width={150}>
      <Menu mode="inline" style={{height: "100%"}}>
        <Menu.Item key="status">
          <Link to={PATHS.MARKET}>Market</Link>
        </Menu.Item>
      </Menu>
    </Sider>
  );
};
