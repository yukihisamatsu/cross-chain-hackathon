import {Modal} from "antd";
import React from "react";

import {OwnedEstate} from "~src/models/estate";

interface Props {
  estate: OwnedEstate;
  selectedTradeId: number;
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
      selectedTradeId,
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
        <div>{estate.tokenId}</div>
        <div>{selectedTradeId}</div>
        <div>TODO ContractMethod</div>
        <div>TODO Args</div>
      </Modal>
    );
  }
}
