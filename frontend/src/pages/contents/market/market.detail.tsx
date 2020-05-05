import React from "react";

interface Props {
  id: string;
}

export class MarketDetail extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }
  render() {
    const {id} = this.props;
    return (
      <div>
        <div>MarketDetail</div>
        <div>id: {id}</div>
      </div>
    );
  }
}
