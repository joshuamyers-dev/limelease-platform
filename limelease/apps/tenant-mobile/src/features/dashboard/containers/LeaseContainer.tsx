import Card from '@components/Card';
import {
  LinkText,
  SectionTitle,
  SmallText,
  StandardText,
} from '@components/TextComponents';
import {useMyLeaseQuery} from '@graphql/generated';
import {REQUEST_REPAIR_SCREEN} from '@navigators/ScreenConstants';
import {formatMobileNumber, renderAddressLabel} from '@utils/Helpers';
import dayjs from 'dayjs';
import {useCallback, useEffect, useMemo} from 'react';
import {ActivityIndicator, Image, StyleSheet, Text, View} from 'react-native';

const LeaseContainer = ({navigation, route}) => {
  const {data: leaseData, loading} = useMyLeaseQuery({
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    if (route.params.propertyAddress) {
      navigation.setOptions({
        title: renderAddressLabel(route.params.propertyAddress, false),
      });
    }
  }, []);

  const lease = leaseData?.myLease;
  const startDate = dayjs(lease?.startDate);
  const endDate = dayjs(lease?.endDate);

  const leaseTerm = useMemo(() => {
    return endDate.diff(startDate, 'months');
  }, [lease]);

  const onPressSendRequest = useCallback(() => {
    navigation.navigate(REQUEST_REPAIR_SCREEN);
  }, []);

  return (
    <View style={styles.container}>
      {loading && <ActivityIndicator style={{marginTop: 20}} />}

      {!loading && (
        <>
          <SectionTitle>Lease</SectionTitle>

          <Card style={{gap: 4}}>
            <StandardText>
              {startDate.format('DD MMM YYYY')} -{' '}
              {endDate.format('DD MMM YYYY')}
            </StandardText>
            <SmallText>{leaseTerm} month lease</SmallText>
            <LinkText style={{paddingTop: 12}}>View contract</LinkText>
          </Card>

          <SectionTitle style={{marginTop: 24}}>
            Property Manager{lease?.property.agents?.length > 1 ? 's' : ''}
          </SectionTitle>

          {lease?.property.agents?.map(agentNode => (
            <Card style={{gap: 4}}>
              <StandardText>
                {agentNode?.agent?.user?.profile.firstName}{' '}
                {agentNode?.agent?.user?.profile.lastName}
              </StandardText>
              <SmallText>
                {formatMobileNumber(
                  agentNode?.agent?.user.profile.phoneNumber,
                  true,
                )}
              </SmallText>
              <LinkText style={{paddingTop: 12}} onPress={onPressSendRequest}>
                Send maintenance request
              </LinkText>
            </Card>
          ))}

          <SectionTitle style={{marginTop: 24}}>Files</SectionTitle>

          <Card>
            <View style={styles.fileRow}>
              <StandardText style={{flex: 1}}>Name of File</StandardText>
              <Image
                source={require('../../../../assets/images/download-icon.png')}
              />
            </View>
          </Card>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  fileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default LeaseContainer;
