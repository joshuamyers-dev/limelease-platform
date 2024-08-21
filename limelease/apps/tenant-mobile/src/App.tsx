import React from 'react';
import {Platform, Text, TextInput, UIManager} from 'react-native';

// Navigators
import MainStack from './navigators/MainStack';

// Packages
import {PortalProvider} from '@gorhom/portal';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {enableFreeze, enableScreens} from 'react-native-screens';

import {ApolloProvider} from '@apollo/client';
import client from './Client';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {ActionSheetProvider} from '@expo/react-native-action-sheet';

// Disable font scaling
// @ts-ignore
Text.defaultProps = Text.defaultProps || {};
// @ts-ignore
Text.defaultProps.allowFontScaling = false;
// @ts-ignore
TextInput.defaultProps = TextInput.defaultProps || {};
// @ts-ignore
TextInput.defaultProps.allowFontScaling = false;

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

enableScreens();
enableFreeze();

if (__DEV__) {
  // NativeModules.DevSettings.setIsDebuggingRemotely(true);
}

const App = () => {
  return (
    <ApolloProvider client={client}>
      <SafeAreaProvider>
        <NavigationContainer>
          <GestureHandlerRootView style={{flex: 1}}>
            <PortalProvider>
              <ActionSheetProvider>
                <MainStack />
              </ActionSheetProvider>
            </PortalProvider>
          </GestureHandlerRootView>
        </NavigationContainer>
      </SafeAreaProvider>
    </ApolloProvider>
  );
};

export default App;
