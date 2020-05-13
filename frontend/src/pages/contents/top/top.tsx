import {Table} from "antd";
import React from "react";
import {RouteComponentProps} from "react-router-dom";

import {User} from "~models/user";
import {Config} from "~src/heplers/config";
import {Repositories} from "~src/repos/types";

const {Column} = Table;

interface Props extends RouteComponentProps {
  config: Config;
  repos: Repositories;
  user: User;
  setHeaderText: (headerText: string) => void;
}

export class Top extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    this.state = {
      user: User.default()
    };
    this.props.setHeaderText("Top");
  }

  render() {
    const {user} = this.props;
    return (
      <Table<User>
        rowKey={(o: User) => o.id}
        dataSource={[user]}
        pagination={false}
        bordered
        size={"small"}
      >
        <Column title="Name" dataIndex="name" key="name" width={200} />
        <Column title="Address" dataIndex="address" key="address" />
        <Column title="Balance" dataIndex="balance" key="balance" />
      </Table>
    );
  }
}
