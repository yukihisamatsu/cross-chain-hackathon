import React from "react";
import {Route, RouteComponentProps, Switch} from "react-router-dom";

import {User} from "~models/user";
import {IssueDetail} from "~pages/contents/issue/issue-detail";
import {IssueList} from "~pages/contents/issue/issue-list";
import {MarketDetail} from "~pages/contents/market/market-detail";
import {OwnedDetail} from "~pages/contents/owned/owned-detail";
import {OwnedList} from "~pages/contents/owned/owned-list";
import {Top} from "~pages/contents/top/top";
import {Authenticated} from "~pages/high-order-components/authenticated";
import {Config} from "~src/heplers/config";
import {SignUp} from "~src/pages/contents/signup/sign-up";
import {Repositories} from "~src/repos/types";

import {PATHS} from "../routes";
import {MarketList} from "./market/market-list";

interface Props {
  config: Config;
  repos: Repositories;
  user: User;
  setUser: (user: User) => Promise<void>;
  setHeaderTitle: (headerText: string) => void;
}

export const ContentSwitch = (props: Props) => {
  const {config, repos, user, setUser, setHeaderTitle} = props;

  return (
    <Switch>
      <Route
        path={PATHS.MARKET}
        render={props =>
          renderMarketList(config, repos, user, setHeaderTitle, props)
        }
        exact={true}
      />
      <Route
        path={`${PATHS.MARKET}/:id`}
        render={props =>
          renderMarketDetail(config, repos, user, setHeaderTitle, props)
        }
        exact={true}
      />
      <Route
        path={PATHS.OWNED}
        render={props =>
          renderOwnedList(config, repos, user, setHeaderTitle, props)
        }
        exact={true}
      />
      <Route
        path={`${PATHS.OWNED}/:id`}
        render={props =>
          renderOwnedDetail(config, repos, user, setUser, setHeaderTitle, props)
        }
        exact={true}
      />
      <Route
        path={PATHS.ISSUE}
        render={props =>
          renderIssueList(config, repos, user, setHeaderTitle, props)
        }
        exact={true}
      />
      <Route
        path={`${PATHS.ISSUE}/:id`}
        render={props =>
          renderIssueDetail(config, repos, user, setHeaderTitle, props)
        }
        exact={true}
      />
      <Route
        path={PATHS.SIGN_UP}
        render={props =>
          renderSignUp(config, repos, user, setUser, setHeaderTitle, props)
        }
        exact={true}
      />
      <Route
        path={PATHS.TOP}
        render={props => renderTop(config, repos, user, setHeaderTitle, props)}
        exact={false}
      />
    </Switch>
  );
};

const renderMarketList = (
  config: Config,
  repos: Repositories,
  user: User,
  setHeaderTitle: (headerText: string) => void,
  rProps: RouteComponentProps
) => {
  return (
    <Authenticated>
      <MarketList
        config={config}
        repos={repos}
        user={user}
        setHeaderText={setHeaderTitle}
        {...rProps}
      />
    </Authenticated>
  );
};

const renderMarketDetail = (
  config: Config,
  repos: Repositories,
  user: User,
  setHeaderTitle: (headerText: string) => void,
  rProps: RouteComponentProps<{id: string}>
) => {
  return (
    <Authenticated>
      <MarketDetail
        config={config}
        repos={repos}
        user={user}
        setHeaderText={setHeaderTitle}
        {...rProps}
      />
    </Authenticated>
  );
};

const renderOwnedList = (
  config: Config,
  repos: Repositories,
  user: User,
  setHeaderTitle: (headerText: string) => void,
  rProps: RouteComponentProps
) => {
  return (
    <Authenticated>
      <OwnedList
        config={config}
        repos={repos}
        user={user}
        setHeaderText={setHeaderTitle}
        {...rProps}
      />
    </Authenticated>
  );
};

const renderOwnedDetail = (
  config: Config,
  repos: Repositories,
  user: User,
  setUser: (user: User) => Promise<void>,
  setHeaderTitle: (headerText: string) => void,
  rProps: RouteComponentProps<{id: string}>
) => {
  return (
    <Authenticated>
      <OwnedDetail
        config={config}
        repos={repos}
        user={user}
        setUser={setUser}
        setHeaderText={setHeaderTitle}
        {...rProps}
      />
    </Authenticated>
  );
};

const renderIssueList = (
  config: Config,
  repos: Repositories,
  user: User,
  setHeaderTitle: (headerText: string) => void,
  rProps: RouteComponentProps
) => {
  return (
    <Authenticated>
      <IssueList
        config={config}
        repos={repos}
        user={user}
        setHeaderText={setHeaderTitle}
        {...rProps}
      />
    </Authenticated>
  );
};

const renderIssueDetail = (
  config: Config,
  repos: Repositories,
  user: User,
  setHeaderTitle: (headerText: string) => void,
  rProps: RouteComponentProps<{id: string}>
) => {
  return (
    <Authenticated>
      <IssueDetail
        config={config}
        repos={repos}
        user={user}
        setHeaderText={setHeaderTitle}
        {...rProps}
      />
    </Authenticated>
  );
};

const renderTop = (
  config: Config,
  repos: Repositories,
  user: User,
  setHeaderTitle: (headerText: string) => void,
  rProps: RouteComponentProps
) => {
  return (
    <Authenticated>
      <Top
        config={config}
        repos={repos}
        user={user}
        setHeaderText={setHeaderTitle}
        {...rProps}
      />
    </Authenticated>
  );
};

const renderSignUp = (
  config: Config,
  repos: Repositories,
  user: User,
  setUser: (user: User) => Promise<void>,
  setHeaderTitle: (headerText: string) => void,
  rProps: RouteComponentProps
) => {
  return (
    <SignUp
      config={config}
      repos={repos}
      user={user}
      setUser={setUser}
      setHeaderText={setHeaderTitle}
      {...rProps}
    />
  );
};
