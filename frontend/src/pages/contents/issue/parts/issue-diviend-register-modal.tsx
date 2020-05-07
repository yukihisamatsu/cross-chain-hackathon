import {Modal} from "antd";
import React from "react";

import {IssuerEstate} from "~models/estate";

interface Props {
  estate: IssuerEstate;
  perUnit: number;
  quantity: number;
  total: number;
  onOK: () => void;
  onCancel: () => void;
  visible: boolean;
  confirmLoading: boolean;
}

export class IssueDividendRegisterModal extends React.PureComponent<Props> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    const {
      estate,
      perUnit,
      quantity,
      total,
      onOK,
      onCancel,
      visible,
      confirmLoading
    } = this.props;
    return (
      <Modal
        title="REGISTER NOW"
        centered
        visible={visible}
        confirmLoading={confirmLoading}
        onOk={onOK}
        onCancel={onCancel}
        okText={"CONFIRM"}
        cancelText={"CANCEL"}
      >
        <div>id: {estate.tokenId}</div>
        <div>perUnit: {perUnit}</div>
        <div>quantity: {quantity}</div>
        <div>total: {total}</div>
      </Modal>
    );
  }
}
