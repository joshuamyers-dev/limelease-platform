import React, {useCallback, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Colours} from '../../../utils/Colours';
import CustomTextInput from '../../../components/CustomTextInput';
import RoundButton, {ButtonType} from '../../../components/RoundButton';
import CodeSentConfirmation from '../components/CodeSentConfirmation';
import {useVerifyOtpMutation} from '../../../graphql/generated';
import {CONFIRMED_OTP_SCREEN} from '../../../navigators/ScreenConstants';
import {useGlobalStore} from '../../../utils/Store';
import {updateClientHeaders} from '../../../Client';

const ConfirmOTPContainer: React.FC = ({navigation, route}) => {
  const [otp, setOtp] = React.useState('');

  const {setUserData, setToken} = useGlobalStore(state => state);

  const [verifyOtpMutation, {loading, error, data}] = useVerifyOtpMutation();

  const onPressContinue = useCallback(async () => {
    await verifyOtpMutation({
      variables: {
        number: route.params.mobileNumber,
        code: otp,
      },
    });
  }, [otp]);

  useEffect(() => {
    if (data?.userVerifyOtp) {
      setUserData(data.userVerifyOtp.user);
      setToken(data?.userVerifyOtp.token);
      updateClientHeaders(data?.userVerifyOtp.token);

      navigation.navigate(CONFIRMED_OTP_SCREEN);
    }
  }, [data?.userVerifyOtp]);

  return (
    <SafeAreaView style={styles.container}>
      <CodeSentConfirmation isVisible={false} />
      <Text style={styles.titleText}>We’ve sent you a one-time passcode</Text>

      <TextInput
        style={styles.textInput}
        placeholderTextColor={Colours.GRAY_8}
        placeholder="0000"
        keyboardType="number-pad"
        onChangeText={setOtp}
      />

      <View style={styles.bottomContainer}>
        <RoundButton
          title="Continue"
          loading={loading}
          onPress={onPressContinue}></RoundButton>
        <RoundButton title="I didn’t get the code" type={ButtonType.LINK} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 70,
    paddingHorizontal: 16,
  },
  titleText: {
    fontFamily: 'Figtree-Bold',
    color: Colours.NAVY,
    fontSize: 28,
    lineHeight: 32,
  },
  textInput: {
    fontFamily: 'Figtree-Bold',
    fontSize: 24,
    lineHeight: 28,
    color: Colours.NAVY,
    marginTop: 24,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    marginBottom: 30,
    paddingHorizontal: 16,
  },
});

export default ConfirmOTPContainer;
