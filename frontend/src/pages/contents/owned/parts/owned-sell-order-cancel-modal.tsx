import {Modal} from "antd";
import React from "react";

import {OwnedEstate} from "~models/estate";
import {SellOrder} from "~models/order";

interface Props {
  estate: OwnedEstate;
  sellOrder: SellOrder;
  onOK: () => void;
  onCancel: () => void;
  visible: boolean;
  confirmLoading: boolean;
}

export class OwnedSellOrderCancelModal extends React.PureComponent<Props> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    const {
      estate,
      sellOrder,
      onOK,
      onCancel,
      visible,
      confirmLoading
    } = this.props;
    return (
      <Modal
        title="CANCEL ORDER"
        centered
        visible={visible}
        confirmLoading={confirmLoading}
        onOk={onOK}
        onCancel={onCancel}
        okText={"CONFIRM"}
        cancelText={"CANCEL"}
      >
        <div>name: {estate.name}</div>
        <div>tokenId: {sellOrder.tokenId}</div>
        <div>tradeId: {sellOrder.tradeId}</div>
        <div>units: {sellOrder.quantity}</div>
        <div>perUnit: {sellOrder.perUnitPrice}</div>
        <div>total: {sellOrder.getTotal()}</div>
      </Modal>
    );
  }
}
