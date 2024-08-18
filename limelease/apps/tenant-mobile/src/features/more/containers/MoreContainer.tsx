import Card from '@components/Card';
import {LargeText, SectionTitle, SmallText} from '@components/TextComponents';
import React, {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {openBrowser} from '@swan-io/react-native-browser';

const MoreContainer: React.FC = () => {
  const insets = useSafeAreaInsets();

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
        <Card>
          <SmallText>Profile</SmallText>
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
