import React from "react";
import {Route, RouteComponentProps, Switch} from "react-router-dom";

import {IssueDetail} from "~pages/contents/issue/issue-detail";
import {IssueList} from "~pages/contents/issue/issue-list";
import {MarketDetail} from "~pages/contents/market/market-detail";
import {OwnedDetail} from "~pages/contents/owned/owned-detail";
import {OwnedList} from "~pages/contents/owned/owned-list";
import {Config} from "~src/heplers/config";
import {SignUp} from "~src/pages/contents/signup/sign-up";
import {Repositories} from "~src/repos/types";

import {PATHS} from "../routes";
import {MarketList} from "./market/market-list";

interface Props {
  config: Config;
  repos: Repositories;
  setHeaderTitle: (headerText: string) => void;
}

export const ContentSwitch = (props: Props) => {
  const {config, repos, setHeaderTitle} = props;

  return (
    <Switch>
      <Route
        path={PATHS.MARKET}
        render={props => renderMarketList(config, repos, setHeaderTitle, props)}
        exact={true}
      />
      <Route
        path={`${PATHS.MARKET}/:id`}
        render={props =>
          renderMarketDetail(config, repos, setHeaderTitle, props)
        }
        exact={true}
      />
      <Route
        path={PATHS.OWNED}
        render={props => renderOwnedList(config, repos, setHeaderTitle, props)}
        exact={true}
      />
      <Route
        path={`${PATHS.OWNED}/:id`}
        render={props =>
          renderOwnedDetail(config, repos, setHeaderTitle, props)
        }
        exact={true}
      />
      <Route
        path={PATHS.ISSUE}
        render={props => renderIssueList(config, repos, setHeaderTitle, props)}
        exact={true}
      />
      <Route
        path={`${PATHS.ISSUE}/:id`}
        render={props =>
          renderIssueDetail(config, repos, setHeaderTitle, props)
        }
        exact={true}
      />
      <Route
        path={"/"}
        render={props => renderSignUp(config, repos, setHeaderTitle, props)}
        exact={false}
      />
    </Switch>
  );
};

const renderMarketList = (
  config: Config,
  repos: Repositories,
  setHeaderTitle: (headerText: string) => void,
  rProps: RouteComponentProps
) => {
  return (
    <MarketList
      config={config}
      repos={repos}
      setHeaderText={setHeaderTitle}
      {...rProps}
    />
  );
};

const renderMarketDetail = (
  config: Config,
  repos: Repositories,
  setHeaderTitle: (headerText: string) => void,
  rProps: RouteComponentProps<{id: string}>
) => {
  return (
    <MarketDetail
      config={config}
      repos={repos}
      setHeaderText={setHeaderTitle}
      {...rProps}
    />
  );
};

const renderOwnedList = (
  config: Config,
  repos: Repositories,
  setHeaderTitle: (headerText: string) => void,
  rProps: RouteComponentProps
) => {
  return (
    <OwnedList
      config={config}
      repos={repos}
      setHeaderText={setHeaderTitle}
      {...rProps}
    />
  );
};

const renderOwnedDetail = (
  config: Config,
  repos: Repositories,
  setHeaderTitle: (headerText: string) => void,
  rProps: RouteComponentProps<{id: string}>
) => {
  return (
    <OwnedDetail
      config={config}
      repos={repos}
      setHeaderText={setHeaderTitle}
      {...rProps}
    />
  );
};

const renderIssueList = (
  config: Config,
  repos: Repositories,
  setHeaderTitle: (headerText: string) => void,
  rProps: RouteComponentProps
) => {
  return (
    <IssueList
      config={config}
      repos={repos}
      setHeaderText={setHeaderTitle}
      {...rProps}
    />
  );
};

const renderIssueDetail = (
  config: Config,
  repos: Repositories,
  setHeaderTitle: (headerText: string) => void,
  rProps: RouteComponentProps<{id: string}>
) => {
  return (
    <IssueDetail
      config={config}
      repos={repos}
      setHeaderText={setHeaderTitle}
      {...rProps}
    />
  );
};

const renderSignUp = (
  config: Config,
  repos: Repositories,
  setHeaderTitle: (headerText: string) => void,
  rProps: RouteComponentProps
) => {
  return (
    <SignUp
      config={config}
      repos={repos}
      setHeaderText={setHeaderTitle}
      {...rProps}
    />
  );
};
