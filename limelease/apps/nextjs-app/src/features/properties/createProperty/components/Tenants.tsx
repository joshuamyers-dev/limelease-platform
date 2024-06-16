import { useCallback, useContext, useEffect, useState } from 'react';

import { PlusCircleFilled } from '@ant-design/icons';
import { Alert, Button, Checkbox, Col, DatePicker, Divider, Form, FormInstance, FormListFieldData, Input, Row, Typography } from 'antd';
import { AddPropertyContext } from '../containers/CreatePropertyContainer';
import { EMAIL_ADDRESS_FIELD_RULES, EMAIL_ADDRESS_FIELD_RULES_NR, PHONE_NUMBER_FIELD_RULES, PHONE_NUMBER_FIELD_RULES_NR } from '../helpers/Constants';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { AnimatedContainer } from '@components/AnimatedContainer';
import { fadeInOutProps } from '@utils/AnimationsProps';
import dayjs from 'dayjs';
import { Tenant } from '@graphql/generated';
import { formatMobileNumber } from '@utils/Helpers';

const { RangePicker } = DatePicker;

interface TenantsProps {
  form: FormInstance;
  propertyDetails: any;
}

const Tenants = ({ form, propertyDetails }: TenantsProps) => {
  const context = useContext(AddPropertyContext);

  const [hasLease, setHasLease] = useState(false);

  useEffect(() => {
    if (propertyDetails) {
      debugger;
      const leaseDetails = propertyDetails?.lease;
      const tenantsFormValues = {
        leaseTerm: [dayjs(leaseDetails?.startDate), dayjs(leaseDetails?.endDate)],
        leasePcm: leaseDetails?.rentPcm,
        tenants: propertyDetails?.tenants?.map((tenant: Tenant) => {
          return {
            id: tenant.id,
            firstName: tenant.firstName,
            lastName: tenant.lastName,
            emailAddress: tenant.email,
            phoneNumber: formatMobileNumber(tenant.phoneNumber),
          };
        }),
      };

      if (leaseDetails) setHasLease(true);

      form.setFieldsValue(tenantsFormValues);
    }
  }, [propertyDetails]);

  const onClickBack = () => {
    context?.setStep(context.currentStep - 1);
  };

  const onChangeLeasedCheckbox = useCallback((e: CheckboxChangeEvent) => {
    setHasLease(e.target.checked);
  }, []);

  const renderTenantFormDetails = useCallback((field: FormListFieldData) => {
    return (
      <>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              {...field}
              key={field.key}
              name={[field.name, 'firstName']}
              label="First Name:"
              rules={[{ required: true, message: 'First Name is required.' }]}
            >
              <Input placeholder="e.g. John" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              {...field}
              key={field.key}
              name={[field.name, 'lastName']}
              label="Last Name:"
              rules={[{ required: true, message: 'Last Name is required.' }]}
            >
              <Input placeholder="e.g. Doe" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item {...field} key={field.key} name={[field.name, 'phoneNumber']} label="Phone Number:" rules={PHONE_NUMBER_FIELD_RULES_NR}>
              <Input placeholder="e.g. 0404 000 000" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item {...field} key={field.key} name={[field.name, 'email']} label="Email Address:" rules={EMAIL_ADDRESS_FIELD_RULES_NR}>
              <Input placeholder="e.g. john.doe@example.com" />
            </Form.Item>
          </Col>
        </Row>
      </>
    );
  }, []);

  return (
    <Form layout="vertical" size="large" name="1" form={form} requiredMark={false}>
      <Typography.Title level={5} style={{ paddingBottom: '16px' }}>
        Lease Details
      </Typography.Title>

      <Form.Item label="Does the property have a current lease?">
        <Checkbox checked={hasLease} onChange={(e) => onChangeLeasedCheckbox(e)}>
          This property is leased
        </Checkbox>
      </Form.Item>

      {hasLease && (
        <AnimatedContainer {...fadeInOutProps}>
          <Form.Item name="leaseTerm" label="Lease Term">
            <RangePicker
              picker="date"
              placeholder={['Lease Start Date', 'Lease End Date']}
              format={'DD/MM/YYYY'}
              showNow
              showWeek
              style={{ width: '100%' }}
              id={{
                start: 'startInput',
                end: 'endInput',
              }}
              onFocus={(_, info) => {
                console.log('Focus:', info.range);
              }}
              onBlur={(_, info) => {
                console.log('Blur:', info.range);
              }}
            />
          </Form.Item>

          <Form.Item name="leasePcm" label="Rent PCM">
            <Input type="text" placeholder="e.g. 500" />
          </Form.Item>

          <Divider />

          <Typography.Title level={5} style={{ paddingBottom: '16px' }}>
            Tenants
          </Typography.Title>

          <Form.List name="tenants">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field, index) => renderTenantFormDetails(field))}
                <Form.Item>
                  <Button type="link" onClick={() => add()} icon={<PlusCircleFilled />}>
                    Add another occupant
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </AnimatedContainer>
      )}

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

export default Tenants;
