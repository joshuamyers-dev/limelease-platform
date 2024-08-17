import React, {useCallback} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {Colours} from '../../../utils/Colours';
import {SafeAreaView} from 'react-native-safe-area-context';
import RoundButton, {ButtonType} from '../../../components/RoundButton';
import {
  DASHBOARD_NAVIGATOR,
  DASHBOARD_SCREEN,
} from '../../../navigators/ScreenConstants';

const ConfirmedOTPContainer: React.FC = ({navigation, route}) => {
  const onPressContinue = useCallback(() => {
    navigation.navigate(DASHBOARD_NAVIGATOR);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titleText}>Get to know your</Text>
      <Text style={styles.titleText}>OccuPie App</Text>

      <View style={styles.featuresList}>
        <View style={styles.featureRowContainer}>
          <View style={styles.iconCircle}>
            <Image
              source={require('../../../../assets/images/spanner-icon.png')}
            />
          </View>
          <View style={{flex: 1}}>
            <Text style={styles.featureTitle}>Fast Maintenance</Text>
            <Text style={styles.featureDescription}>
              Submit maintenance requests in the app for quick resolution.
            </Text>
          </View>
        </View>

        <View style={styles.featureRowContainer}>
          <View style={styles.iconCircle}>
            <Image
              source={require('../../../../assets/images/chat-icon.png')}
            />
          </View>
          <View style={{flex: 1}}>
            <Text style={styles.featureTitle}>Real-time updates</Text>
            <Text style={styles.featureDescription}>
              Get updates, reminders and announcements from property managers
              instantly.
            </Text>
          </View>
        </View>

        <View style={styles.featureRowContainer}>
          <View style={styles.iconCircle}>
            <Image
              source={require('../../../../assets/images/download-icon.png')}
            />
          </View>
          <View style={{flex: 1}}>
            <Text style={styles.featureTitle}>View and download files</Text>
            <Text style={styles.featureDescription}>
              Access any relevant documents about your lease securely.
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.bottomContainer}>
        <RoundButton
          type={ButtonType.PRIMARY}
          title="Ok, got it!"
          onPress={onPressContinue}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    marginTop: 40,
  },
  titleText: {
    fontFamily: 'Figtree-Bold',
    fontSize: 28,
    color: Colours.NAVY,
    lineHeight: 32,
  },
  featureRowContainer: {
    flexDirection: 'row',
    paddingBottom: 24,
    alignItems: 'center',
  },
  iconCircle: {
    padding: 14,
    backgroundColor: 'white',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 1,
    borderRadius: 16,
    marginRight: 16,
  },
  featuresList: {
    paddingTop: 24,
  },
  featureTitle: {
    fontFamily: 'Figtree-Bold',
    fontSize: 16,
    color: Colours.NAVY,
    lineHeight: 20,
  },
  featureDescription: {
    fontFamily: 'Figtree-Regular',
    fontSize: 16,
    color: Colours.GRAY_8,
    lineHeight: 20,
    paddingTop: 4,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 40,
    left: 16,
    right: 16,
  },
});

export default ConfirmedOTPContainer;
