import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  CaptionText,
  ExtraSmallText,
  LargeText,
  LinkText,
  SectionTitle,
  SmallText,
  StandardText,
} from '@components/TextComponents';
import {
  useMeQuery,
  useMyActivityQuery,
  useMyUpcomingJobsQuery,
} from '@graphql/generated';
import {renderAddressLabel} from '@utils/Helpers';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import UpcomingJob from '../components/UpcomingJob';
import {useCallback} from 'react';
import {LEASE_SCREEN} from '@navigators/ScreenConstants';
import EmptyState from '@components/EmptyState';
import Card from '@components/Card';
import dayjs from 'dayjs';
import {DEVICE_TIMEZONE} from '@utils/Constants';
import {useFocusEffect} from '@react-navigation/native';

const DashboardContainer: React.FC = ({navigation}) => {
  const insets = useSafeAreaInsets();

  const {data: meData, error} = useMeQuery({fetchPolicy: 'cache-and-network'});

  const {data: upcomingJobData, refetch: refetchJob} = useMyUpcomingJobsQuery({
    fetchPolicy: 'cache-and-network',
  });

  const {data: myActivityData, refetch: refetchActivity} = useMyActivityQuery({
    variables: {
      first: 5,
    },
    fetchPolicy: 'cache-and-network',
  });

  const onPressViewLease = useCallback(() => {
    navigation.navigate(LEASE_SCREEN, {
      propertyAddress: meData?.me?.tenant?.property.address,
    });
  }, [meData?.me]);

  useFocusEffect(
    useCallback(() => {
      refetchActivity();
      refetchJob();
    }, []),
  );

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

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 24}}>
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

        <View style={styles.sectionContainer}>
          <SectionTitle>Recent activity</SectionTitle>

          {!myActivityData?.myActivity && (
            <EmptyState
              title="No recent activity."
              description="Check back later."
            />
          )}

          {myActivityData?.myActivity?.edges?.map(edge => {
            const createdDate = dayjs(edge?.node?.insertedAt)
              .tz(DEVICE_TIMEZONE)
              .fromNow();

            return (
              <Card>
                <ExtraSmallText>{edge?.node?.authorName}</ExtraSmallText>
                <StandardText style={{paddingTop: 4, width: '80%'}}>
                  {edge?.node?.request.title}
                </StandardText>
                <SmallText numberOfLines={1} style={{marginTop: 8}}>
                  {edge?.node?.messageBody}
                </SmallText>
                <CaptionText style={{paddingTop: 8}}>{createdDate}</CaptionText>
              </Card>
            );
          })}
        </View>
      </ScrollView>
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
    paddingTop: 24,
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
