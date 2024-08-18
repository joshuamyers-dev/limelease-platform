import {Image, View} from 'react-native';
import {useGlobalStore} from '../../../utils/Store';
import {useEffect} from 'react';
import {
  DASHBOARD_NAVIGATOR,
  LOGIN_SCREEN,
} from '../../../navigators/ScreenConstants';

import Animated, {FadeInUp, FadeOutDown} from 'react-native-reanimated';
import {SCREEN_HEIGHT} from '@utils/Constants';

const SplashContainer = ({navigation}) => {
  const user = useGlobalStore(state => state.user);

  useEffect(() => {
    setTimeout(() => {
      if (user) {
        navigation.navigate(DASHBOARD_NAVIGATOR);
      } else {
        navigation.navigate(LOGIN_SCREEN);
      }
    }, 800);
  }, []);

  return (
    <View
      style={{flex: 1, alignItems: 'center', paddingTop: SCREEN_HEIGHT * 0.3}}>
      <Animated.Image
        source={require('@assets/images/logo.png')}
        entering={FadeInUp}
        exiting={FadeOutDown}
      />
    </View>
  );
};

export default SplashContainer;
