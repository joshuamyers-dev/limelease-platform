import {View} from 'react-native';
import {useGlobalStore} from '../../../utils/Store';
import {useEffect} from 'react';
import {
  DASHBOARD_NAVIGATOR,
  LOGIN_SCREEN,
} from '../../../navigators/ScreenConstants';

const SplashContainer = ({navigation}) => {
  const user = useGlobalStore(state => state.user);

  useEffect(() => {
    if (user) {
      navigation.navigate(DASHBOARD_NAVIGATOR);
    } else {
      navigation.navigate(LOGIN_SCREEN);
    }
  }, [user]);

  return <View style={{flex: 1}}></View>;
};

export default SplashContainer;
