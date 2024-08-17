import {
  ActivityIndicator,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  LargeText,
  LinkText,
  SectionTitle,
  SmallText,
  StandardText,
} from '@components/TextComponents';
import {useMeQuery, useMyUpcomingJobsQuery} from '@graphql/generated';
import {renderAddressLabel} from '@utils/Helpers';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import UpcomingJob from '../components/UpcomingJob';
import {useCallback} from 'react';
import {LEASE_SCREEN} from '@navigators/ScreenConstants';
import EmptyState from '@components/EmptyState';

const DashboardContainer: React.FC = ({navigation}) => {
  const insets = useSafeAreaInsets();

  const {data: meData, error} = useMeQuery({fetchPolicy: 'cache-and-network'});
  const {data: upcomingJobData} = useMyUpcomingJobsQuery({
    fetchPolicy: 'cache-and-network',
  });

  const onPressViewLease = useCallback(() => {
    navigation.navigate(LEASE_SCREEN, {
      propertyAddress: meData?.me?.tenant?.property.address,
    });
  }, [meData?.me]);

  if (!meData?.me) {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <>
      <View style={[styles.topHeader, {paddingTop: insets.top}]}>
        <SmallText>Hey!</SmallText>
        <LargeText>{meData?.me?.profile?.firstName}</LargeText>

        <TouchableOpacity
          style={styles.topHeaderRow}
          onPress={onPressViewLease}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 4,
            }}>
            <SmallText>of</SmallText>
            <LinkText>
              {renderAddressLabel(meData?.me?.tenant?.property?.address, false)}
            </LinkText>
          </View>
          <Image
            source={require('../../../../assets/images/icon-forward.png')}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.sectionContainer}>
        <SectionTitle>Upcoming jobs</SectionTitle>

        {!upcomingJobData?.myUpcomingJobs && (
          <EmptyState
            title="Your notice board is empty!"
            description="You’re all up to date."
          />
        )}

        {upcomingJobData?.myUpcomingJobs && (
          <UpcomingJob
            description={upcomingJobData?.myUpcomingJobs?.description}
            contractorName={
              upcomingJobData?.myUpcomingJobs?.contractor?.businessName
            }
            dateStart={upcomingJobData?.myUpcomingJobs?.bookingDateStart}
            dateEnd={upcomingJobData?.myUpcomingJobs?.bookingDateEnd}
            requestId={upcomingJobData.myUpcomingJobs.request?.id}
          />
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  topHeader: {
    backgroundColor: 'white',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.6,
    padding: 16,
  },
  topHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 16,
  },
  sectionContainer: {
    paddingVertical: 25,
    paddingHorizontal: 16,
  },
  cardContainer: {
    backgroundColor: 'white',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.6,
    padding: 16,
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 8,
  },
});

export default DashboardContainer;
