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
          colorPrimary: '#2E0CFF',
          colorPrimaryHover: '#2E0CFF',
          colorText: '#151D38',
          colorLink: '#2E0CFF',
          linkDecoration: 'underline',
          fontFamily: 'Figtree',
        },
        components: {
          Button: {
            colorPrimary: '#2E0CFF',
            colorPrimaryHover: '#2E0CFF',
            colorPrimaryActive: '#2E0CFF',
          },
          Input: {
            activeBorderColor: '#2E0CFF',
            addonBg: '#2E0CFF',
          },
          Card: {
            borderRadius: 10,
          },
          Form: {
            colorError: Colours.RED_7,
          },
          Checkbox: {},
          Segmented: {
            itemSelectedBg: '#F5F5F5',
            itemHoverColor: '#2E0CFF',
            itemActiveBg: '#FAFAFA',
            itemColor: '#151D38',
            itemSelectedColor: '#2E0CFF',
            trackBg: '#FAFAFA',
            borderRadius: 0,
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
        <Component {...pageProps} />
      </ApolloProvider>
    </ConfigProvider>
  );
};

export default App;
