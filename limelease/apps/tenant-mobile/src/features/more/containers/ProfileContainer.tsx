import CustomTextInput from '@components/CustomTextInput';
import RoundButton, {ButtonType} from '@components/RoundButton';
import {SectionTitle} from '@components/TextComponents';
import {useMeQuery, useUpdateProfileMutation} from '@graphql/generated';
import {formatMobileNumber} from '@utils/Helpers';
import {useCallback, useEffect, useMemo, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

const ProfileContainer = () => {
  const {data: meData} = useMeQuery();

  const [email, setEmail] = useState(meData?.me?.profile.email);
  const [firstName, setFirstName] = useState(meData?.me?.profile.firstName);
  const [lastName, setLastName] = useState(meData?.me?.profile.lastName);
  const [phoneNumber, setPhoneNumber] = useState('');

  const [updateProfileMutation, {loading: updateProfileLoading}] =
    useUpdateProfileMutation();

  useEffect(() => {
    if (meData?.me && meData.me.profile.phoneNumber) {
      setPhoneNumber(formatMobileNumber(meData.me.profile.phoneNumber));
    }
  }, [meData?.me]);

  const onPressSaveChanges = useCallback(async () => {
    if (!email || !firstName || !lastName || !phoneNumber) {
      return;
    }

    await updateProfileMutation({
      variables: {
        email,
        firstName,
        lastName,
        phoneNumber,
      },
    });
  }, [email, firstName, lastName, phoneNumber]);

  const formValuesHaveChanged = useMemo(() => {
    if (
      (meData?.me && email !== meData.me.profile.email) ||
      firstName !== meData.me.profile.firstName ||
      lastName !== meData.me.profile.lastName ||
      phoneNumber !== formatMobileNumber(meData.me.profile.phoneNumber)
    ) {
      return true;
    }
  }, [email, firstName, lastName, phoneNumber, meData?.me]);

  return (
    <View style={styles.container}>
      <SectionTitle>Email address</SectionTitle>
      <CustomTextInput
        placeholder="Email address"
        onChangeText={setEmail}
        value={email}
      />
      <SectionTitle>First name</SectionTitle>
      <CustomTextInput
        placeholder="First name"
        value={firstName}
        onChangeText={setFirstName}
      />
      <SectionTitle>Last name</SectionTitle>
      <CustomTextInput
        placeholder="Last name"
        value={lastName}
        onChangeText={setLastName}
      />
      <SectionTitle>Phone number</SectionTitle>
      <CustomTextInput
        placeholder="Phone number"
        value={phoneNumber}
        keyboardType="number-pad"
        onChangeText={setPhoneNumber}
      />

      <View style={{marginTop: 8}}>
        <RoundButton
          type={ButtonType.PRIMARY}
          loading={updateProfileLoading}
          disabled={!formValuesHaveChanged}
          title="Save changes"
          onPress={onPressSaveChanges}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flexDirection: 'column',
    gap: 8,
  },
});

export default ProfileContainer;
