import Card from '@components/Card';
import {LargeText, SectionTitle, SmallText} from '@components/TextComponents';
import React, {useCallback, useEffect} from 'react';
import {Alert, StyleSheet, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {openBrowser} from '@swan-io/react-native-browser';
import {useGlobalStore} from '@utils/Store';
import client from '../../../Client';
import {LOGIN_SCREEN, PROFILE_SCREEN} from '@navigators/ScreenConstants';

const MoreContainer: React.FC = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const setUserData = useGlobalStore(state => state.setUserData);

  const onPressLogout = useCallback(() => {
    Alert.alert('Log out?', 'Are you sure you want to log out?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => {
          setUserData(null);
          client.clearStore();
          navigation.navigate(LOGIN_SCREEN);
        },
      },
    ]);
  }, []);

  return (
    <View style={{flex: 1, backgroundColor: '#FAFAFA'}}>
      <View
        style={[
          styles.topHeader,
          {paddingTop: insets.top + 30, paddingBottom: 25},
        ]}>
        <LargeText style={{marginLeft: 16}}>More</LargeText>
      </View>

      <View style={styles.contentContainer}>
        <SectionTitle>Account</SectionTitle>
        <Card isTappable onPress={() => navigation.navigate(PROFILE_SCREEN)}>
          <SmallText>Profile</SmallText>
        </Card>
        <Card isTappable onPress={onPressLogout}>
          <SmallText>Log out</SmallText>
        </Card>

        {/* <SectionTitle style={{paddingTop: 24}}>Notifications</SectionTitle>
        <Card>
          <SmallText>Notification preferences</SmallText>
        </Card> */}

        <SectionTitle style={{paddingTop: 24}}>App</SectionTitle>
        <Card
          isTappable
          onPress={() => openBrowser('https://occupie.com.au', {})}>
          <SmallText>About OccuPie</SmallText>
        </Card>
        <Card
          isTappable
          onPress={() => openBrowser('https://occupie.com.au/help', {})}>
          <SmallText>Help & Support</SmallText>
        </Card>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  topHeader: {
    backgroundColor: 'white',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.6,
  },
  contentContainer: {
    margin: 16,
    flex: 1,
  },
});

export default MoreContainer;
