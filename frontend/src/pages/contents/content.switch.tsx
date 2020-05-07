import React from "react";
import {Route, RouteComponentProps, Switch} from "react-router-dom";

import {IssueDetail} from "~pages/contents/issue/issue-detail";
import {IssueList} from "~pages/contents/issue/issue-list";
import {MarketDetail} from "~pages/contents/market/market-detail";
import {OwnedDetail} from "~pages/contents/owned/owned-detail";
import {OwnedList} from "~pages/contents/owned/owned-list";
import {SignUp} from "~src/pages/contents/signup/sign-up";

import {PATHS} from "../routes";
import {MarketList} from "./market/market-list";

interface Props {
  setHeaderTitle: (headerText: string) => void;
}

export const ContentSwitch = (props: Props) => {
  const {setHeaderTitle} = props;

  return (
    <Switch>
      <Route
        path={PATHS.MARKET}
        render={props => renderMarketList(props, setHeaderTitle)}
        exact={true}
      />
      <Route
        path={`${PATHS.MARKET}/:id`}
        render={props => renderMarketDetail(props)}
        exact={true}
      />
      <Route
        path={PATHS.OWNED}
        render={props => renderOwnedList(props, setHeaderTitle)}
        exact={true}
      />
      <Route
        path={`${PATHS.OWNED}/:id`}
        render={props => renderOwnedDetail(props)}
        exact={true}
      />
      <Route
        path={PATHS.ISSUE}
        render={props => renderIssueList(props, setHeaderTitle)}
        exact={true}
      />
      <Route
        path={`${PATHS.ISSUE}/:id`}
        render={props => renderIssueDetail(props)}
        exact={true}
      />
      <Route path={PATHS.SIGN_UP} component={renderSignUp} exact={false} />
      <Route path={"/"} component={renderSignUp} exact={false} />
    </Switch>
  );
};

const renderMarketList = (
  rProps: RouteComponentProps,
  setHeaderTitle: (headerText: string) => void
) => {
  return <MarketList history={rProps.history} setHeaderText={setHeaderTitle} />;
};

const renderMarketDetail = (rProps: RouteComponentProps<{id: string}>) => {
  return <MarketDetail {...rProps} />;
};

const renderOwnedList = (
  rProps: RouteComponentProps,
  setHeaderTitle: (headerText: string) => void
) => {
  return <OwnedList history={rProps.history} setHeaderText={setHeaderTitle} />;
};

const renderOwnedDetail = (rProps: RouteComponentProps<{id: string}>) => {
  return <OwnedDetail {...rProps} />;
};

const renderIssueList = (
  rProps: RouteComponentProps,
  setHeaderTitle: (headerText: string) => void
) => {
  return <IssueList history={rProps.history} setHeaderText={setHeaderTitle} />;
};

const renderIssueDetail = (rProps: RouteComponentProps<{id: string}>) => {
  return <IssueDetail {...rProps} />;
};

const renderSignUp = () => {
  return <SignUp />;
};
