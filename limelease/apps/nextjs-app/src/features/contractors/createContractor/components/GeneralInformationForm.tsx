import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { EMAIL_ADDRESS_FIELD_RULES, PHONE_NUMBER_FIELD_RULES, WEBSITE_URL_FIELD_RULES } from '@features/properties/createProperty/helpers/Constants';
import { Button, Col, Divider, Form, Input, Row } from 'antd';
import { FormInstance } from 'antd/lib';
import styled from 'styled-components';

export interface CreateContractorFormValues {
  areasServed: Array<string>;
  businessName: string;
  contactEmail: string;
  contactNumber: string;
  websiteUrl: string;
}

interface GeneralInformationFormProps {
  onFormComplete: (values: CreateContractorFormValues) => void;
  form: FormInstance;
  isLoading: boolean;
  onPressCancel: () => void;
}

const GeneralInformationForm: React.FC<GeneralInformationFormProps> = ({ onFormComplete, form, isLoading, onPressCancel }) => {
  return (
    <Form layout="vertical" size="large" name="createContractor" form={form} requiredMark={false} onFinish={onFormComplete}>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item name="businessName" label="Name:" rules={[{ required: true, message: 'A business name is required.' }]}>
            <Input placeholder="Jim's Cleaning" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="contactNumber" label="Contact Number:" rules={PHONE_NUMBER_FIELD_RULES}>
            <Input placeholder="0411 111 111" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="contactEmail" label="Contact Email Address:" rules={EMAIL_ADDRESS_FIELD_RULES}>
            <Input placeholder="jim@jimscleaning.com.au" />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item name="websiteUrl" label="Website URL:" rules={WEBSITE_URL_FIELD_RULES}>
        <Input placeholder="https://www.jimscleaning.com.au" />
      </Form.Item>

      <Form.List
        name="areasServed"
        initialValue={['']}
        rules={[
          {
            validator: async (_, names) => {
              if (!names || names.length < 1) {
                return Promise.reject(new Error('At least 1 area must be specified'));
              }
            },
          },
        ]}
      >
        {(fields, { add, remove }, { errors }) => (
          <>
            {fields.map((field, index) => (
              <Form.Item label={index === 0 ? 'Areas Served:' : ''} required={false} key={field.key}>
                <Form.Item
                  {...field}
                  validateTrigger={['onChange', 'onBlur']}
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                      message: 'Please add a suburb or delete this field.',
                    },
                  ]}
                  noStyle
                >
                  <Input placeholder="e.g. St Kilda " />
                </Form.Item>

                {fields.length > 0 ? (
                  <DeleteAreaContainer>
                    <MinusCircleOutlined className="dynamic-delete-button" style={{ paddingTop: 12 }} onClick={() => remove(field.name)} />
                  </DeleteAreaContainer>
                ) : null}
              </Form.Item>
            ))}
            <Form.Item>
              <Button type="link" onClick={() => add()} icon={<PlusOutlined />}>
                Add Area
              </Button>
              <Form.ErrorList errors={errors} />
            </Form.Item>

            <Divider />
          </>
        )}
      </Form.List>

      <Row>
        <Col span={12}>
          <Button type="link" onClick={onPressCancel}>
            Cancel
          </Button>
        </Col>
        <Col span={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button type="primary" size="large" htmlType="submit" loading={isLoading}>
            Add Contractor
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

const DeleteAreaContainer = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  right: 16px;
`;

export default GeneralInformationForm;
