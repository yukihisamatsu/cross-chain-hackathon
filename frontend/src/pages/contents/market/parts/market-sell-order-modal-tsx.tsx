import {Modal} from "antd";
import React from "react";

import {SellOrder} from "~models/order";
import {MarketEstate} from "~src/models/estate";

interface Props {
  estate: MarketEstate;
  selectedSellOrder: SellOrder;
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
      selectedSellOrder,
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
        <div>tradeId: {selectedSellOrder.tradeId}</div>
        <div>tokenId: {selectedSellOrder.tokenId}</div>
        <div>owner: {selectedSellOrder.owner}</div>
        <div>quantity: {selectedSellOrder.quantity}</div>
        <div>perUnitPrice: {selectedSellOrder.perUnitPrice}</div>
        <div>total: {selectedSellOrder.getTotal()}</div>
      </Modal>
    );
  }
}
