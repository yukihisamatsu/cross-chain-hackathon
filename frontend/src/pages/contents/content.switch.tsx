import React from "react";
import {Route, RouteComponentProps, Switch} from "react-router-dom";

import {InventoryList} from "~src/pages/contents/inventory/inventory.list";
import {MarketDetail} from "~src/pages/contents/market/market.detail";
import {SignUp} from "~src/pages/contents/signup/sign-up";

import {PATHS} from "../routes";
import {MarketList} from "./market/market.list";

export const ContentSwitch = () => {
  return (
    <Switch>
      <Route path={PATHS.MARKET} component={renderMarketList} exact={true} />
      <Route
        path={`${PATHS.MARKET}/:id`}
        render={props => renderMarketDetail(props)}
      />
      <Route
        path={PATHS.INVENTORY}
        component={renderInventoryList}
        exact={true}
      />
      <Route path={PATHS.SIGN_UP} component={renderSignUp} exact={false} />
    </Switch>
  );
};

const renderMarketList = () => {
  return <MarketList />;
};

const renderMarketDetail = (rProps: RouteComponentProps<{id: string}>) => {
  return <MarketDetail id={rProps.match.params.id} />;
};

const renderInventoryList = () => {
  return <InventoryList />;
};

const renderSignUp = () => {
  return <SignUp />;
};
