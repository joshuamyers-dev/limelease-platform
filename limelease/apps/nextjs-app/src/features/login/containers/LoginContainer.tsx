import { useCallback, useEffect, useState } from 'react';

import styled from 'styled-components';

import backgroundImage from '@public/images/login-background.png';

import { Form, message } from 'antd';

import { updateAuthHeaders } from '@client';
import { useUserLoginMutation } from '@graphql/generated';
import useStorage from '@hooks/useLocalStorage';
import { LOCAL_STORAGE_AUTH_KEY } from '@utils/Constants';
import Image from 'next/image';
import { useRouter } from 'next/router';
import LoginForm from '../components/LoginForm';

export interface LoginFormValues {
  email: string;
  password: string;
}

const LoginContainer = () => {
  const [form] = Form.useForm();
  const router = useRouter();
  const [get, set, remove] = useStorage();

  const [canSubmitForm, setCanSubmitForm] = useState(false);

  const [userLogin, { loading, error: loginError, data: user }] = useUserLoginMutation();

  const authToken = get(LOCAL_STORAGE_AUTH_KEY, 'local');

  const onFormSubmit = useCallback(async (values: LoginFormValues) => {
    try {
      const {
        data: { userLogin: loginSession },
      } = await userLogin({
        variables: {
          email: values.email,
          password: values.password,
        },
      });

      set(LOCAL_STORAGE_AUTH_KEY, loginSession.token, 'local');
      updateAuthHeaders(loginSession.token);
    } catch (err: any) {}
  }, []);

  const onValuesChange = useCallback(async () => {
    try {
      await form.validateFields();
    } catch (err: any) {
      if (err.errorFields.length === 0) {
        setCanSubmitForm(true);
      } else {
        setCanSubmitForm(false);
      }
    }
  }, []);

  useEffect(() => {
    if (authToken) {
      router.replace('/properties');
    }
  }, [authToken]);

  useEffect(() => {
    if (loginError && loginError?.graphQLErrors?.length > 0) {
      return message.error(loginError?.graphQLErrors[0].message);
    }
  }, [loginError]);

  return (
    <Container>
      <Image src={backgroundImage} layout="fill" />
      <FormContainer>
        <LoginForm form={form} isLoading={loading} canSubmitForm={canSubmitForm} onFormSubmit={onFormSubmit} onValuesChange={onValuesChange} />
      </FormContainer>
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: auto;
`;

const FormContainer = styled.div`
  width: 30%;
  margin: 20% auto;
  height: auto;
`;

export default LoginContainer;
