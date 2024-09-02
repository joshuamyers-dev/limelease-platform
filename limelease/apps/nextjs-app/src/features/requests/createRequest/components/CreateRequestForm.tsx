import { InboxOutlined } from '@ant-design/icons';
import { Heading3 } from '@components/Headings';
import { UPLOAD_IMAGE_API_URL } from '@features/properties/createProperty/helpers/Constants';
import { FetchPropertyRequestsDocument, PropertyRequestUrgency, useCreateRequestMutation, useFetchRequestCategoriesQuery } from '@graphql/generated';
import useStorage from '@hooks/useLocalStorage';
import { Maybe } from '@types/Maybe';
import { Colours } from '@utils/Colours';
import { LOCAL_STORAGE_AUTH_KEY } from '@utils/Constants';
import { normFile, resizeFile } from '@utils/Helpers';
import { Button, Col, Form, Input, Row, Select, Upload, message } from 'antd';

import { useCallback, useMemo } from 'react';
import styled from 'styled-components';

interface FormValues {
  title: string;
  details: string;
  urgency: PropertyRequestUrgency;
  photos: Array<File>;
  categoryId: string;
}

interface CreateRequestFormProps {
  propertyId: Maybe<string>;
  onCloseModal: () => void;
}

const CreateRequestForm: React.FC<CreateRequestFormProps> = ({ propertyId, onCloseModal }) => {
  const [form] = Form.useForm();

  const [createRequest, { loading, error }] = useCreateRequestMutation();
  const { data: requestCategoriesData, loading: requestCategoriesLoading } = useFetchRequestCategoriesQuery({ fetchPolicy: 'cache-first' });

  const [getAuthToken] = useStorage();
  const authToken = getAuthToken(LOCAL_STORAGE_AUTH_KEY, 'local');

  const onFormSubmit = useCallback(
    async (formValues: FormValues) => {
      if (!propertyId) return;

      try {
        await createRequest({
          variables: {
            propertyId,
            categoryId: formValues.categoryId,
            title: formValues.title,
            details: formValues.details,
            urgency: formValues.urgency,
            photos: formValues?.photos?.map((photo, index) => {
              return {
                name: photo.name,
                type: photo.type,
                uriPath: photo!.response!.temp_path,
              };
            }),
          },
          refetchQueries: [
            {
              query: FetchPropertyRequestsDocument,
              variables: {
                propertyId,
                first: 10,
              },
            },
          ],
        });

        message.success('Your request was added successfully.');
        onCloseModal();
      } catch (err: any) {
        message.error(err?.message);
      }
    },
    [propertyId]
  );

  return (
    <Container>
      <Heading3 style={{ textAlign: 'center' }}>New Request</Heading3>

      <Form form={form} layout="vertical" onFinish={onFormSubmit} requiredMark={false}>
        <Form.Item label="Subject of your request:" name="title" rules={[{ required: true, message: 'Subject request is required.' }]}>
          <Input placeholder={`e.g. "Broken window", "Leaking faucet"`} />
        </Form.Item>

        <Form.Item label="Category:" name="categoryId" rules={[{ required: true, message: 'A category must be selected.' }]}>
          <Select
            options={requestCategoriesData?.propertyRequestCategories?.map((category) => {
              return { value: category?.id, label: category?.name };
            })}
          />
        </Form.Item>

        <Form.Item label="Details:" name="details" rules={[{ required: true, message: 'Details are required.' }]}>
          <Input.TextArea placeholder="Add details for your agent to investigate and get the right help you need" />
        </Form.Item>

        <Form.Item label="Urgency:" name="urgency">
          <Select
            defaultValue={PropertyRequestUrgency.Low}
            options={[
              { value: PropertyRequestUrgency.Low, label: 'Low' },
              { value: PropertyRequestUrgency.MidHigh, label: 'Mid-High' },
              { value: PropertyRequestUrgency.Emergency, label: 'Emergency' },
            ]}
          />
        </Form.Item>

        <Form.Item label="Photos" shouldUpdate>
          <Form.Item name="photos" valuePropName="fileList" getValueFromEvent={normFile} noStyle>
            <Upload.Dragger
              multiple
              name="propertyListingPhoto"
              accept=".png,.jpg,.jpeg"
              listType="picture-card"
              action={UPLOAD_IMAGE_API_URL}
              beforeUpload={(file) => {
                return resizeFile(file);
              }}
              headers={{
                Authorization: `Bearer ${authToken}`,
              }}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined style={{ color: Colours.LIME_10 }} />
              </p>
              <p className="ant-upload-text">Click or drag files to this area to upload</p>
              <p className="ant-upload-hint">Support for a single or bulk upload.</p>
            </Upload.Dragger>
          </Form.Item>
        </Form.Item>

        <Row>
          <Col span={12}>
            <Button type="ghost" onClick={onCloseModal}>
              Cancel
            </Button>
          </Col>

          <Col span={12} style={{ textAlign: 'right' }}>
            <Button type="primary" htmlType="submit" loading={loading}>
              Save & Continue
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

const Container = styled.div``;

export default CreateRequestForm;
