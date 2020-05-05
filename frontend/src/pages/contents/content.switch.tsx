import React from "react";
import {Route, RouteComponentProps, Switch} from "react-router-dom";

import {OwnedEstateDetail} from "~pages/contents/owned-estate/owned-estate.detail";
import {OwnedEstateList} from "~pages/contents/owned-estate/owned-estate.list";
import {MarketDetail} from "~src/pages/contents/market/market.detail";
import {SignUp} from "~src/pages/contents/signup/sign-up";

import {PATHS} from "../routes";
import {MarketList} from "./market/market.list";

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
        render={props => renderOwnedEstateList(props, setHeaderTitle)}
        exact={true}
      />
      <Route
        path={`${PATHS.OWNED}/:id`}
        render={props => renderOwnedEstateDetail(props)}
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
  return <MarketDetail id={rProps.match.params.id} />;
};

const renderOwnedEstateList = (
  rProps: RouteComponentProps,
  setHeaderTitle: (headerText: string) => void
) => {
  return (
    <OwnedEstateList history={rProps.history} setHeaderText={setHeaderTitle} />
  );
};

const renderOwnedEstateDetail = (rProps: RouteComponentProps<{id: string}>) => {
  return <OwnedEstateDetail id={rProps.match.params.id} />;
};

const renderSignUp = () => {
  return <SignUp />;
};
