import {Modal} from "antd";
import React from "react";

import {OwnedEstate} from "~models/estate";

interface Props {
  estate: OwnedEstate;
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
    const {estate, onOK, onCancel, visible, confirmLoading} = this.props;
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
        <div>owner: {estate.owner}</div>
        <div>tokenId: {estate.tokenId}</div>
        <div>units: {estate.units}</div>
        <div>perUnit: {estate.perUnit}</div>
        <div>total: {estate.units * estate.perUnit}</div>
      </Modal>
    );
  }
}
