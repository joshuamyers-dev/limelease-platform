import { Button, Card, Form, FormInstance, Input } from 'antd';
import Image from 'next/image';

import limeLeaseLogo from '@public/images/logo.svg';
import { Heading1, Heading3 } from '@components/Headings';
import { LoginFormValues } from '../containers/LoginContainer';

interface LoginFormProps {
  form: FormInstance;
  isLoading: boolean;
  canSubmitForm: boolean;
  onFormSubmit: (values: LoginFormValues) => void;
  onValuesChange: (changedValues: any, allValues: any) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ form, isLoading, canSubmitForm, onFormSubmit, onValuesChange }) => {
  return (
    <Card>
      <Image src={limeLeaseLogo} height={32} width={169} layout="fixed" priority />

      <Heading3>Welcome back &middot; Sign in to continue</Heading3>

      <Form form={form} layout="vertical" size="large" onFinish={onFormSubmit} requiredMark={false} onValuesChange={onValuesChange}>
        <Form.Item name="email" rules={[{ required: true, message: 'Please enter your email address.' }]}>
          <Input placeholder="Email" />
        </Form.Item>
        <Form.Item name="password" rules={[{ required: true, message: 'Please enter your password.' }]}>
          <Input.Password placeholder="Password" />
        </Form.Item>
        <Form.Item wrapperCol={{ span: 24, flex: 1 }}>
          <Button loading={isLoading} disabled={!canSubmitForm} type="primary" htmlType="submit" style={{ width: '100%' }}>
            Sign in
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default LoginForm;
