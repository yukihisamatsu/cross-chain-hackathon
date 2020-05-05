import React from "react";
import {Link} from "react-router-dom";

import {PATHS} from "~src/pages/routes";

export class MarketList extends React.Component {
  render() {
    return (
      <div>
        <div>MarketList</div>
        <Link to={`${PATHS.MARKET}/1`}>id=1</Link>
      </div>
    );
  }
}
