import {Button, Form, InputNumber} from "antd";
import {FormInstance} from "antd/lib/form/util";
import React from "react";
import styled from "styled-components";

import {OwnedEstate} from "~models/estate";

interface Props {
  estate: OwnedEstate;
  onFinish: (values: {[key: string]: string | number}) => void;
}

export class OwnedSellOrderForm extends React.PureComponent<Props> {
  constructor(props: Props) {
    super(props);
  }

  formRef: React.RefObject<FormInstance> = React.createRef();

  onReset = () => {
    this.formRef.current?.resetFields();
  };

  render() {
    const {estate, onFinish} = this.props;
    return (
      <FormStyled
        name="sellOrder"
        ref={this.formRef}
        onFinish={(values: {[key: string]: string | number}) => {
          onFinish(values);
          this.onReset();
        }}
      >
        <Form.Item
          name="unit"
          rules={[
            {
              required: true,
              message: "Please input unit!"
            },
            () => ({
              validator(_, value) {
                if (value > estate.units) {
                  return Promise.reject(
                    "The value inputted exceeds the units."
                  );
                }
                return Promise.resolve();
              }
            })
          ]}
        >
          <FormInputNumberStyled placeholder="UNIT" min={1} />
        </Form.Item>
        <Form.Item
          name="perUnit"
          rules={[
            {
              required: true,
              message: "Please input per unit!"
            }
          ]}
        >
          <FormInputNumberStyled placeholder="PER UNIT" min={1} />
        </Form.Item>
        <Form.Item>
          <Button type="default" htmlType="submit">
            SELL NOW
          </Button>
        </Form.Item>
      </FormStyled>
    );
  }
}

const FormStyled = styled(Form)`
  display: flex;
`;

const FormInputNumberStyled = styled(InputNumber)`
  width: 200px;
  margin-right: 20px;
`;
