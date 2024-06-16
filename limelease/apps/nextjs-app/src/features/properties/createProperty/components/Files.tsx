import { useCallback, useContext } from 'react';

import { InboxOutlined } from '@ant-design/icons';
import { Button, Col, Form, FormInstance, Row, Upload } from 'antd';
import { Colours } from '../../../../utils/Colours';
import { AddPropertyContext } from '../containers/CreatePropertyContainer';
import { normFile } from '@utils/Helpers';

interface FilesProps {
  form: FormInstance;
  loading: boolean;
  isUpdating: boolean;
}

const Files = ({ form, loading, isUpdating = false }: FilesProps) => {
  const context = useContext(AddPropertyContext);

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
            action={`${process.env.NEXT_PUBLIC_API_URL}/temp-file`}
            // headers={{ Authorization: `Bearer ${jwt}` }}
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
