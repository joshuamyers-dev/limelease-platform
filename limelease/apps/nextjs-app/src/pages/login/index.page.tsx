import LoginContainer from '@features/login/containers/LoginContainer';
import Head from 'next/head';

const LoginPage = () => {
  return (
    <>
      <Head>
        <title key="title">OccuPie &middot; Login</title>
      </Head>

      <LoginContainer />
    </>
  );
};

export default LoginPage;
