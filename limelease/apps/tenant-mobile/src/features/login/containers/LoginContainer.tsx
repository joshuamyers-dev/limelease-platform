import React, {useCallback, useState} from 'react';
import {
  Image,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import CustomTextInput from '../../../components/CustomTextInput';
import RoundButton from '../../../components/RoundButton';
import {useSendOtpMutation} from '../../../graphql/generated';
import {CONFIRM_OTP_SCREEN} from '../../../navigators/ScreenConstants';
import {Colours} from '../../../utils/Colours';

const LoginContainer = ({navigation}) => {
  const [sendCodeMutation, {loading}] = useSendOtpMutation();

  const [mobileNumber, setMobileNumber] = useState('');

  const onPressLogin = useCallback(async () => {
    await sendCodeMutation({
      variables: {
        number: mobileNumber,
      },
    });

    navigation.navigate(CONFIRM_OTP_SCREEN, {mobileNumber});
  }, [mobileNumber]);

  return (
    <View style={styles.container}>
      <Image
        source={require('../../../../assets/images/login-bg.png')}
        resizeMode="cover"
        style={styles.imageBackground}
      />
      <KeyboardAvoidingView
        style={styles.bottomCard}
        behavior="padding"
        keyboardVerticalOffset={30}>
        <Image
          source={require('../../../../assets/images/logo.png')}
          style={{width: 82, height: 48, alignSelf: 'center'}}
        />
        <Text style={styles.welcomeText}>Hey there!</Text>
        <Text style={styles.welcomeDescription}>
          Log in with your mobile number to access information about your rental
          property, lodge a maintenance request and many more.
        </Text>
        <CustomTextInput
          placeholder="Mobile Number"
          keyboardType="decimal-pad"
          onChangeText={setMobileNumber}
        />

        <View style={styles.loginContainer}>
          <RoundButton
            title="Log in"
            loading={loading}
            onPress={onPressLogin}
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageBackground: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    width: '100%',
  },
  bottomCard: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 48,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  welcomeText: {
    color: Colours.NAVY,
    fontSize: 28,
    marginBottom: 8,
    fontFamily: 'Figtree-Bold',
    textAlign: 'center',
    paddingTop: 32,
  },
  welcomeDescription: {
    color: Colours.GRAY_8,
    fontSize: 16,
    lineHeight: 20,
    marginBottom: 20,
    fontFamily: 'Figtree-Regular',
    textAlign: 'center',
  },
  loginContainer: {
    paddingVertical: 24,
  },
});

export default LoginContainer;
