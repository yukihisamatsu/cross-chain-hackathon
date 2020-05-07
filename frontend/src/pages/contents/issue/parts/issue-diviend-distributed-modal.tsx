import {Modal} from "antd";
import React from "react";

import {IssuerDividendHistory} from "~models/dividend";

interface Props {
  history: IssuerDividendHistory;
  onOK: () => void;
  onCancel: () => void;
  visible: boolean;
  confirmLoading: boolean;
}

export class IssueDividendDistributeModal extends React.PureComponent<Props> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    const {history, onOK, onCancel, visible, confirmLoading} = this.props;
    return (
      <Modal
        title="DISTRIBUTE NOW"
        centered
        visible={visible}
        confirmLoading={confirmLoading}
        onOk={onOK}
        onCancel={onCancel}
        okText={"CONFIRM"}
        cancelText={"CANCEL"}
      >
        <div>id: {history.id}</div>
        <div>dividendDate: {history.dividendDate}</div>
        <div>total: {history.total}</div>
        <div>status: {history.status}</div>
      </Modal>
    );
  }
}
