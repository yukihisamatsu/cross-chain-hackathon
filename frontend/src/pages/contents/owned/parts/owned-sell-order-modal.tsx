import {Modal} from "antd";
import React from "react";

import {OwnedEstate} from "~src/models/estate";

interface Props {
  estate: OwnedEstate;
  unit: number;
  perUnit: number;
  onOK: () => void;
  onCancel: () => void;
  visible: boolean;
  confirmLoading: boolean;
}

export class OwnedSellOrderModal extends React.PureComponent<Props> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    const {
      estate,
      unit,
      perUnit,
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
        <div>unit: {unit}</div>
        <div>perUnit: {perUnit}</div>
      </Modal>
    );
  }
}
