import React from 'react';

// Libraries
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import LoginContainer from '../features/login/containers/LoginContainer';
import {
  CONFIRM_OTP_SCREEN,
  CONFIRMED_OTP_SCREEN,
  DASHBOARD_NAVIGATOR,
  DASHBOARD_SCREEN,
  LEASE_SCREEN,
  LOGIN_SCREEN,
  MORE_SCREEN,
  PROFILE_SCREEN,
  REQUEST_REPAIR_SCREEN,
  REQUESTS_NAVIGATOR,
  REQUESTS_SCREEN,
  SPLASH_SCREEN,
  VIEW_REQUEST_SCREEN,
} from './ScreenConstants';
import ConfirmOTPContainer from '../features/login/containers/ConfirmOTPContainer';
import BackButton from '../components/BackButton';
import ConfirmedOTPContainer from '../features/login/containers/ConfirmedOTPContainer';
import CloseButton from '../components/CloseButton';
import DashboardContainer from '../features/dashboard/containers/DashboardContainer';
import SplashContainer from '../features/splash/containers/SplashContainer';
import {Image} from 'react-native';
import RequestsContainer from '../features/requests/containers/RequestsContainer';
import MoreContainer from '../features/more/containers/MoreContainer';
import LeaseContainer from '@features/dashboard/containers/LeaseContainer';
import {textComponentStyles} from '@components/TextComponents';
import RequestRepairContainer from '@features/requests/containers/RequestRepairContainer';
import ViewRequestContainer from '@features/requests/containers/ViewRequestContainer';
import ProfileContainer from '@features/more/containers/ProfileContainer';

const NativeStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const forFade = ({current}) => ({
  cardStyle: {
    opacity: current.progress,
  },
});

const LoginNavigator = () => {
  return (
    <NativeStack.Navigator>
      <NativeStack.Screen
        name={LOGIN_SCREEN}
        component={LoginContainer}
        options={{
          headerShown: false,
          animation: 'fade_from_bottom',
        }}
      />
      <NativeStack.Screen
        name={CONFIRM_OTP_SCREEN}
        component={ConfirmOTPContainer}
        options={({navigation, route}) => ({
          headerShown: true,
          headerTransparent: true,
          headerTitle: '',
          headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
        })}
      />
      <NativeStack.Screen
        name={CONFIRMED_OTP_SCREEN}
        component={ConfirmedOTPContainer}
        options={({navigation, route}) => ({
          headerShown: true,
          headerTransparent: true,
          headerTitle: '',
          animation: 'slide_from_bottom',
          headerLeft: () => <CloseButton onPress={() => navigation.pop()} />,
        })}
      />
    </NativeStack.Navigator>
  );
};

const DashboardNavigator = () => {
  return (
    <NativeStack.Navigator>
      <NativeStack.Group
        screenOptions={({navigation, route}) => ({
          headerTitleStyle: textComponentStyles.standardText,
          headerLeft: () => <BackButton onPress={() => navigation.pop()} />,
          headerShadowVisible: true,
          contentStyle: {
            backgroundColor: '#FAFAFA',
          },
        })}>
        <NativeStack.Screen
          name={DASHBOARD_SCREEN}
          component={DashboardContainer}
          options={{headerShown: false}}
        />
      </NativeStack.Group>
    </NativeStack.Navigator>
  );
};

const MoreNavigator = () => {
  return (
    <NativeStack.Navigator>
      <NativeStack.Group
        screenOptions={({navigation, route}) => ({
          headerTitleStyle: textComponentStyles.standardText,
          headerLeft: () => <BackButton onPress={() => navigation.pop()} />,
          headerShadowVisible: true,
          contentStyle: {
            backgroundColor: '#FAFAFA',
          },
        })}>
        <NativeStack.Screen
          name={MORE_SCREEN}
          component={MoreContainer}
          options={{headerShown: false}}
        />
        <NativeStack.Screen
          name={PROFILE_SCREEN}
          component={ProfileContainer}
          options={{title: 'Profile'}}
        />
      </NativeStack.Group>
    </NativeStack.Navigator>
  );
};

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let icon;

          if (
            route.name === DASHBOARD_SCREEN ||
            route.name == DASHBOARD_NAVIGATOR
          ) {
            icon = focused
              ? (icon = require('../../assets/images/home-icon.png'))
              : (icon = require('../../assets/images/home-icon-inactive.png'));
          } else if (route.name === REQUESTS_SCREEN) {
            icon = focused
              ? (icon = require('../../assets/images/requests-icon.png'))
              : (icon = require('../../assets/images/requests-icon-inactive.png'));
          } else if (route.name === MORE_SCREEN) {
            icon = focused
              ? (icon = require('../../assets/images/more-icon.png'))
              : (icon = require('../../assets/images/more-icon-inactive.png'));
          }

          return <Image source={icon} />;
        },
        tabBarShowLabel: false,
      })}>
      <Tab.Screen
        name={DASHBOARD_NAVIGATOR}
        component={DashboardNavigator}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name={REQUESTS_SCREEN}
        component={RequestsContainer}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name={MORE_SCREEN}
        component={MoreNavigator}
        options={{headerShown: false}}
      />
    </Tab.Navigator>
  );
};

const TransitionNavigator = () => {
  return (
    <NativeStack.Navigator>
      <NativeStack.Group
        screenOptions={({navigation, route}) => ({
          headerTitleStyle: textComponentStyles.standardText,
          headerLeft: () => <BackButton onPress={() => navigation.pop()} />,
          headerShadowVisible: true,
          contentStyle: {
            backgroundColor: '#FAFAFA',
          },
        })}>
        <NativeStack.Screen
          name={SPLASH_SCREEN}
          component={SplashContainer}
          options={{headerShown: false, animation: 'fade_from_bottom'}}
        />
        <NativeStack.Screen
          name={LOGIN_SCREEN}
          component={LoginNavigator}
          options={{headerShown: false, animation: 'fade_from_bottom'}}
        />
        <NativeStack.Screen
          name={DASHBOARD_NAVIGATOR}
          component={TabNavigator}
          options={{headerShown: false, animation: 'fade_from_bottom'}}
        />
        <NativeStack.Screen
          name={LEASE_SCREEN}
          component={LeaseContainer}
          options={({navigation, route}) => ({
            headerShown: true,
          })}
        />
        <NativeStack.Screen
          name={REQUEST_REPAIR_SCREEN}
          component={RequestRepairContainer}
          options={({navigation, route}) => ({
            headerShown: true,
            presentation: 'modal',
            headerLeft: () => <CloseButton onPress={() => navigation.pop()} />,
            headerTitle: 'New Request',
            headerShadowVisible: false,
            contentStyle: {
              backgroundColor: 'white',
            },
          })}
        />
        <NativeStack.Screen
          name={VIEW_REQUEST_SCREEN}
          component={ViewRequestContainer}
        />
      </NativeStack.Group>
    </NativeStack.Navigator>
  );
};

export default TransitionNavigator;
