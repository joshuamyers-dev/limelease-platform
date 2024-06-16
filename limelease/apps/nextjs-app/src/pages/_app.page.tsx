import '../styles/global.css';

import { ApolloProvider } from '@apollo/client';
import { AppProps } from 'next/app';

import NextNProgress from 'nextjs-progressbar';

import { useApollo } from '../client';
import useStorage from '../hooks/useLocalStorage';
import { LOCAL_STORAGE_AUTH_KEY } from '../utils/Constants';

import Head from 'next/head';

import 'react-image-lightbox/style.css';

import { Colours } from '@utils/Colours';
import { ConfigProvider } from 'antd';

import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import localeData from 'dayjs/plugin/localeData';
import weekday from 'dayjs/plugin/weekday';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import weekYear from 'dayjs/plugin/weekYear';

dayjs.extend(customParseFormat);
dayjs.extend(advancedFormat);
dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.extend(weekOfYear);
dayjs.extend(weekYear);

const App = ({ Component, pageProps }: AppProps) => {
  const [getAuthToken] = useStorage();
  const authToken = getAuthToken(LOCAL_STORAGE_AUTH_KEY, 'local');
  const apolloClient = useApollo(pageProps, authToken);

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#BAE637',
          colorPrimaryHover: '#3F6600',
          colorText: '#254000',
          colorLink: '#262626',
          linkDecoration: 'underline',
        },
        components: {
          Button: {
            colorPrimary: '#BAE637',
            colorPrimaryHover: '#3F6600',
          },
          Modal: {
            colorPrimary: '#BAE637',
            colorPrimaryHover: '#3F6600',
          },
          Input: {
            activeBorderColor: '#BAE637',
          },
          Card: {
            borderRadius: 10,
          },
          Segmented: {
            itemSelectedBg: '#254000',
            itemHoverColor: '#BAE637',
            itemSelectedColor: '#BAE637',
          },
        },
      }}
    >
      <ApolloProvider client={apolloClient}>
        <NextNProgress color={Colours.LIME_5} options={{ showSpinner: false }} />
        <Head>
          <title key="title">LimeLease</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <NextNProgress color={Colours.LIME_8} />
        <Component {...pageProps} />
      </ApolloProvider>
    </ConfigProvider>
  );
};

export default App;
