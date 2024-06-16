import { ApolloClient, HttpLink, InMemoryCache, NormalizedCacheObject, split } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { createPersistedQueryLink } from '@apollo/client/link/persisted-queries';
import { RetryLink } from '@apollo/client/link/retry';
import * as AbsintheSocket from '@absinthe/socket';
import { createAbsintheSocketLink } from '@absinthe/socket-apollo-link';
import { getMainDefinition, relayStylePagination } from '@apollo/client/utilities';
import { w3cwebsocket } from 'websocket';
import { Socket as PhoenixSocket } from 'phoenix';
import merge from 'deepmerge';
import isEqual from 'lodash/isEqual';
import { useMemo } from 'react';

import { LOCAL_STORAGE_AUTH_KEY } from '@utils/Constants';
import { sha256 } from 'crypto-hash';

export const APOLLO_STATE_PROP_NAME = '__APOLLO_STATE__';

let apolloClient: ApolloClient<NormalizedCacheObject> | undefined;

// Links
// const persistedQueriesLink = createPersistedQueryLink({ sha256 });

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => console.warn(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`));

    for (let err of graphQLErrors) {
      switch (err.message) {
        case 'unauthorized':
          deleteTokenLogout();
          break;

        case 'not_found':
          window.location = '/404';
          break;
      }
    }
  }
  if (networkError) {
    // @ts-ignore
    const statusCode = networkError.statusCode;

    console.log(JSON.stringify(networkError));

    if (statusCode === 401) {
      deleteTokenLogout();
    } else {
      console.warn(`[Network error]: ${networkError}`);
    }
  }
});

const deleteTokenLogout = () => {
  localStorage.removeItem(LOCAL_STORAGE_AUTH_KEY);
  window.location = '/login';
};

const retryLink = new RetryLink({
  attempts: {
    retryIf: (error, _operation) => {
      const statusCode = error.statusCode;
      return statusCode !== 400;
    },
  },
});

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        myGroups: relayStylePagination(),
        myContractors: relayStylePagination(),
        myProperties: relayStylePagination(['filter', 'searchKeywords']),
        myRequests: relayStylePagination(['state']),
        requestsForProperty: relayStylePagination(['state', 'propertyId']),
        jobsForContractor: relayStylePagination(['contractorId', 'state']),
        propertyRequestComments: relayStylePagination(['requestId']),
      },
    },
    Contractor: {
      fields: {
        jobs: relayStylePagination(['state']),
      },
    },
  },
});

// Create the client as a function so the token can be updated
const createApolloClient = (authToken: string | null) => {
  const httpLink = new HttpLink({
    uri: process.env.NEXT_PUBLIC_API_URL,
    headers: {
      authorization: authToken ? `Bearer ${authToken}` : '',
    },
  });

  let link = httpLink;
  let wsLink;

  // if (typeof window !== 'undefined') {
  //   const phoenixSocket = new PhoenixSocket(`ws://${process.env.NEXT_PUBLIC_WS_ADDRESS}/socket`, {
  //     params: () => {
  //       return {
  //         token: authToken,
  //       };
  //     },
  //   });

  //   const absintheSocket = AbsintheSocket.create(phoenixSocket);
  //   wsLink = createAbsintheSocketLink(absintheSocket);

  //   link = split(
  //     ({ query }) => {
  //       const definition = getMainDefinition(query);
  //       return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
  //     },
  //     wsLink,
  //     httpLink
  //   );
  // }

  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: retryLink.concat(errorLink).concat(link),
    cache,
  });
};

export const updateAuthHeaders = (authToken: string) => {
  apolloClient?.setLink(
    new HttpLink({
      uri: process.env.NEXT_PUBLIC_API_URL,
      headers: {
        authorization: `Bearer ${authToken}`,
      },
    })
  );
};

export const initializeApollo = (initialState: NormalizedCacheObject | null = null, authToken: string | null) => {
  const _apolloClient = apolloClient ?? createApolloClient(authToken);

  if (initialState) {
    const existingCache = _apolloClient.extract();

    const data = merge(initialState, existingCache, {
      arrayMerge: (destinationArray, sourceArray) => [...sourceArray, ...destinationArray.filter((d) => sourceArray.every((s) => !isEqual(d, s)))],
    });

    _apolloClient.cache.restore(data);
  }

  if (typeof window === 'undefined') return _apolloClient;

  if (!apolloClient) apolloClient = _apolloClient;

  return _apolloClient;
};

export const addApolloState = (client: ApolloClient<NormalizedCacheObject>, pageProps: any) => {
  if (pageProps?.props) {
    pageProps.props[APOLLO_STATE_PROP_NAME] = client.cache.extract();
  }

  return pageProps;
};

export const useApollo = (pageProps: any, authToken: string | null) => {
  const state = pageProps[APOLLO_STATE_PROP_NAME];
  const store = useMemo(() => initializeApollo(state, authToken), [state, authToken]);

  return store;
};
