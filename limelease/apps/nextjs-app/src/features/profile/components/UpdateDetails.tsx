import { AnimatedContainer } from '@components/AnimatedContainer';
import { useMeQuery } from '@graphql/generated';
import { cardAnimationProps } from '@utils/AnimationsProps';
import { Button, Card, Form, Input } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { useCallback } from 'react';

const UpdateDetails = () => {
  const [form] = useForm();
  const { data: meData } = useMeQuery({ fetchPolicy: 'cache-first' });

  const onFormSubmit = useCallback((values) => {}, []);

  return (
    <AnimatedContainer {...cardAnimationProps}>
      <Card>
        <Form layout="vertical" form={form} onFinish={onFormSubmit}>
          <Form.Item label="First Name">
            <Input value={meData?.me?.firstName ?? ''} />
          </Form.Item>
          <Form.Item label="Last Name">
            <Input value={meData?.me?.lastName ?? ''} />
          </Form.Item>
          <Form.Item label="Email">
            <Input type="email" value={meData?.me?.email ?? ''} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </AnimatedContainer>
  );
};

export default UpdateDetails;
