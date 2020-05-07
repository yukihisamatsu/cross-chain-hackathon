import {Modal} from "antd";
import React from "react";

import {MarketEstate} from "~src/models/estate";

interface Props {
  estate: MarketEstate;
  selectedOwner: string;
  onOK: () => void;
  onCancel: () => void;
  visible: boolean;
  confirmLoading: boolean;
}

export class MarketSellOrderModal extends React.PureComponent<Props> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    const {
      estate,
      selectedOwner,
      onOK,
      onCancel,
      visible,
      confirmLoading
    } = this.props;
    return (
      <Modal
        title="BUY ORDER"
        centered
        visible={visible}
        confirmLoading={confirmLoading}
        onOk={onOK}
        onCancel={onCancel}
        okText={"CONFIRM"}
        cancelText={"CANCEL"}
      >
        <div>tokenId: {estate.tokenId}</div>
        <div>owner: {selectedOwner}</div>
      </Modal>
    );
  }
}
