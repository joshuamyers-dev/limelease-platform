import { useCallback, useContext, useEffect } from 'react';

import { InboxOutlined } from '@ant-design/icons';
import { Button, Col, Form, FormInstance, Row, Upload } from 'antd';
import { Colours } from '../../../../utils/Colours';
import { AddPropertyContext } from '../containers/CreatePropertyContainer';
import { normFile } from '@utils/Helpers';
import useStorage from '@hooks/useLocalStorage';
import { LOCAL_STORAGE_AUTH_KEY } from '@utils/Constants';
import { Property } from '@graphql/generated';

interface FilesProps {
  form: FormInstance;
  loading: boolean;
  isUpdating: boolean;
  propertyDetails: Property;
}

const Files = ({ form, loading, isUpdating = false, propertyDetails }: FilesProps) => {
  const context = useContext(AddPropertyContext);

  const [getAuthToken] = useStorage();

  const authToken = getAuthToken(LOCAL_STORAGE_AUTH_KEY, 'local');

  useEffect(() => {
    if (propertyDetails) {
      const filesFormValues = {
        files: propertyDetails?.files?.map((file) => {
          return {
            id: file?.id,
            url: file?.staticMedia?.url,
            name: file?.fileName,
            type: file?.type,
          };
        }),
      };

      if (filesFormValues?.files && propertyDetails.files.length > 0) {
        form.setFieldsValue(filesFormValues);
      }
    }
  }, [propertyDetails]);

  const onClickBack = useCallback(() => {
    () => {
      context?.setStep(context.currentStep - 1);
    };
  }, [context]);

  return (
    <Form layout="vertical" size="large" name="3" form={form}>
      <Form.Item label="Files:" shouldUpdate>
        <Form.Item name="files" valuePropName="fileList" getValueFromEvent={normFile} noStyle>
          <Upload.Dragger
            multiple
            name="files"
            accept=".pdf,.doc,.docx,.xls,.xlsx"
            action={`${process.env.NEXT_PUBLIC_API_URL}/temp-file`}
            headers={{ Authorization: `Bearer ${authToken}` }}
            listType="text"
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
          <Button type="ghost" onClick={onClickBack}>
            Back
          </Button>
        </Col>
        <Col span={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button type="primary" htmlType="submit" loading={loading}>
            {isUpdating ? 'Update Property' : 'Create Property'}
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default Files;
