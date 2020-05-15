import {Button, InputNumber} from "antd";
import React from "react";
import styled from "styled-components";

import {User} from "~models/user";

export const renderDividendRegisterForm = (
  user: User,
  registeredPerUnit: number,
  registeredQuantity: number,
  registeredTotal: number,
  onChange: (v: number | undefined) => void,
  onClick: () => void
) => {
  return (
    <RegisteredFormWrap>
      <RegisteredFormTitle>
        <RegisteredFormTitleText>Register</RegisteredFormTitleText>
      </RegisteredFormTitle>
      <RegisteredFormItemListWrap>
        <RegisteredFormItemWrap>
          <RegisteredFormItemTitle>Per Unit</RegisteredFormItemTitle>
          <RegisteredFormItemInput min={1} onChange={onChange} />
        </RegisteredFormItemWrap>
        <RegisteredFormItemWrap>
          <RegisteredFormItemTitle>Total Quantity</RegisteredFormItemTitle>
          <RegisteredFormItemInput
            disabled
            min={1}
            value={registeredQuantity}
          />{" "}
        </RegisteredFormItemWrap>
        <RegisteredFormItemWrap>
          <RegisteredFormItemTitle>Total Amount</RegisteredFormItemTitle>
          <RegisteredFormItemInput
            disabled
            color={"black"}
            value={registeredTotal}
          />{" "}
        </RegisteredFormItemWrap>
        <RegisteredFormItemWrap>
          <Button
            type={"default"}
            onClick={onClick}
            disabled={registeredPerUnit <= 0 || registeredTotal > user.balance}
          >
            REGISTER NOW
          </Button>
        </RegisteredFormItemWrap>
      </RegisteredFormItemListWrap>
    </RegisteredFormWrap>
  );
};

const RegisteredFormWrap = styled.div`
  padding: 20px 0;
`;

const RegisteredFormTitle = styled.div`
  font-size: 1.1rem;
  font-weight: 800;
  color: black;

  padding: 20px 0;
`;

const RegisteredFormTitleText = styled.span`
  padding-left: 10px;
`;

const RegisteredFormItemListWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: center;
  background-color: white;

  padding: 20px 0;
`;

const RegisteredFormItemWrap = styled.div`
  padding: 5px;
`;

const RegisteredFormItemTitle = styled.div`
  font-size: 0.9rem;
  font-weight: 500;
  color: black;

  padding-bottom: 5px;
`;

const RegisteredFormItemInput = styled(InputNumber)`
  width: 100%;
`;
