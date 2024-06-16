import React, { createContext, Dispatch, useCallback, useContext, useEffect, useState } from 'react';

import styled from 'styled-components';

import { Form, Input, Col, Row, Upload, Button, Select, FormInstance } from 'antd';
import { PlusCircleFilled } from '@ant-design/icons';
import { Colours } from '../../../../utils/Colours';
import axios from 'axios';
import { debounce, formatMobileNumber } from '../../../../utils/Helpers';
import { AddPropertyContext } from '../containers/CreatePropertyContainer';
import { EMAIL_ADDRESS_FIELD_RULES, PHONE_NUMBER_FIELD_RULES } from '../helpers/Constants';

interface OwnersProps {
  form: FormInstance;
  propertyDetails: any;
}

const Owners = ({ form, propertyDetails }: OwnersProps) => {
  const context = useContext(AddPropertyContext);

  const onClickBack = () => {
    context?.setStep(context.currentStep - 1);
  };

  useEffect(() => {
    if (propertyDetails) {
      const landlordsFormValues = propertyDetails?.landlords.map((landlord) => {
        return {
          id: landlord.id,
          firstName: landlord.firstName,
          lastName: landlord.lastName,
          emailAddress: landlord.email,
          phoneNumber: formatMobileNumber(landlord.phoneNumber),
        };
      });

      form.setFieldsValue({ owners: landlordsFormValues });
    }
  }, [propertyDetails]);

  const renderTenantFormDetails = (restField: Object, name: number) => {
    return (
      <>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name={[name, 'firstName']} label="First Name:" {...restField} rules={[{ required: true, message: 'First Name is required.' }]}>
              <Input type="text" placeholder="e.g. John" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name={[name, 'lastName']} label="Last Name:" {...restField} rules={[{ required: true, message: 'Last Name is required.' }]}>
              <Input type="text" placeholder="e.g. Doelittle" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name={[name, 'phoneNumber']} label="Phone Number:" {...restField} rules={PHONE_NUMBER_FIELD_RULES}>
              <Input type="text" placeholder="e.g. 0422 000 123" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name={[name, 'emailAddress']} label="Email Address:" {...restField} rules={EMAIL_ADDRESS_FIELD_RULES}>
              <Input type="text" placeholder="e.g. john.doelittle@outlook.com" />
            </Form.Item>
          </Col>
        </Row>
      </>
    );
  };

  return (
    <Form layout="vertical" size="large" name="2" form={form} requiredMark={false}>
      {!propertyDetails && renderTenantFormDetails({}, 0)}

      <Form.List name="owners">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => renderTenantFormDetails(restField, name))}
            <Form.Item>
              <Button type="link" onClick={() => add()} icon={<PlusCircleFilled />}>
                Add another rental provider
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>

      <Row>
        <Col span={12}>
          <Button type="ghost" onClick={onClickBack}>
            Back
          </Button>
        </Col>
        <Col span={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button type="primary" htmlType="submit">
            Save & Next
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default Owners;
