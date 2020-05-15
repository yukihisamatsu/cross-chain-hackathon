import {Modal} from "antd";
import React from "react";

import {BuyOffer} from "~models/order";
import {OwnedEstate} from "~src/models/estate";

interface Props {
  estate: OwnedEstate;
  selectedBuyOffer: BuyOffer;
  onOK: () => void;
  onCancel: () => void;
  visible: boolean;
  confirmLoading: boolean;
}

export class OwnedSellBuyOfferModal extends React.PureComponent<Props> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    const {
      estate,
      selectedBuyOffer,
      onOK,
      onCancel,
      visible,
      confirmLoading
    } = this.props;
    return (
      <Modal
        title="SELL ORDER"
        centered
        visible={visible}
        confirmLoading={confirmLoading}
        onOk={onOK}
        onCancel={onCancel}
        okText={"CONFIRM"}
        cancelText={"CANCEL"}
      >
        <div>tokenId: {estate.tokenId}</div>
        <div>offerer: {selectedBuyOffer.offerer}</div>
        <div>units: {selectedBuyOffer.quantity}</div>
        <div>perUnitPrice: {selectedBuyOffer.perUnitPrice}</div>
        <div>total: {selectedBuyOffer.getTotal()}</div>
        <div>date: {selectedBuyOffer.updatedAt}</div>
      </Modal>
    );
  }
}
