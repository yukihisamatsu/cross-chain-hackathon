import {Button, Form, InputNumber} from "antd";
import React from "react";
import styled from "styled-components";

import {OwnedEstate} from "~models/estate";

export const renderOwnedSellOrderForm = (
  estate: OwnedEstate,
  onFinish: (values: {[key: string]: string | number}) => void
) => {
  return (
    <FormStyled name="sellOrder" onFinish={onFinish}>
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
                return Promise.reject("The value inputted exceeds the units.");
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
};

const FormStyled = styled(Form)`
  display: flex;
`;

const FormInputNumberStyled = styled(InputNumber)`
  width: 200px;
  margin-right: 20px;
`;
