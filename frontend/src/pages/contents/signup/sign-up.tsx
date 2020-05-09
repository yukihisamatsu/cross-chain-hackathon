import {Button, Table} from "antd";
import React from "react";
import {RouteComponentProps} from "react-router-dom";

import {User} from "~models/user";
import {LocalStorageUserKey} from "~pages/consts";
import {PATHS} from "~pages/routes";
import {Config} from "~src/heplers/config";
import {Repositories} from "~src/repos/types";

const {Column} = Table;

interface Props extends RouteComponentProps {
  config: Config;
  repos: Repositories;
  user: User;
  setUser: (user: User) => void;
  setHeaderText: (headerText: string) => void;
}

interface State {
  users: User[];
}

export class SignUp extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      users: []
    };
    this.props.setHeaderText("SignUp");
  }

  async componentDidMount() {
    const {
      repos: {userRepo}
    } = this.props;
    const users = await userRepo.getUsers();
    this.setState({users});
  }

  render() {
    const {history, setUser} = this.props;
    const {users} = this.state;

    return (
      <Table<User>
        rowKey={(o: User) => o.id}
        dataSource={users}
        pagination={false}
        bordered
        size={"small"}
      >
        <Column title="Name" dataIndex="name" key="name" width={200} />
        <Column title="Address" dataIndex="address" key="address" />
        <Column
          title=""
          dataIndex=""
          key=""
          align="center"
          render={(_: string, user: User) => (
            <Button
              type={"default"}
              onClick={() => {
                localStorage.setItem(LocalStorageUserKey, JSON.stringify(user));
                setUser(user);
                history.push(PATHS.TOP);
              }}
            >
              SELECT
            </Button>
          )}
        />
      </Table>
    );
  }
}
