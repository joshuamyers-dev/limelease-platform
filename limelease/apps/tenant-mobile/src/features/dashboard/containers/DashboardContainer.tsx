import {
  ActivityIndicator,
  Image,
  ScrollView,
  StatusBar,
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
  PropertyRequestComment,
  PropertyRequestCommentEdge,
  useMeQuery,
  useMyActivityQuery,
  useMyUpcomingJobsQuery,
} from '@graphql/generated';
import {renderAddressLabel} from '@utils/Helpers';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import UpcomingJob from '../components/UpcomingJob';
import {useCallback} from 'react';
import {
  LEASE_SCREEN,
  REQUEST_REPAIR_SCREEN,
  REQUESTS_NAVIGATOR,
  VIEW_REQUEST_SCREEN,
} from '@navigators/ScreenConstants';
import EmptyState from '@components/EmptyState';
import Card from '@components/Card';
import dayjs from 'dayjs';
import {DEVICE_TIMEZONE} from '@utils/Constants';
import {useFocusEffect} from '@react-navigation/native';
import Animated, {FadeIn} from 'react-native-reanimated';

const DashboardContainer: React.FC = ({navigation}) => {
  const insets = useSafeAreaInsets();

  const {data: meData, error} = useMeQuery({fetchPolicy: 'cache-and-network'});

  const {data: upcomingJobData, refetch: refetchJob} = useMyUpcomingJobsQuery({
    fetchPolicy: 'cache-and-network',
  });

  const {data: myActivityData, refetch: refetchActivity} = useMyActivityQuery({
    variables: {
      first: 3,
    },
    fetchPolicy: 'cache-and-network',
  });

  const onPressViewLease = useCallback(() => {
    navigation.navigate(LEASE_SCREEN, {
      propertyAddress: meData?.me?.tenant?.property.address,
    });
  }, [meData?.me]);

  const onPressActivityItem = useCallback((node: PropertyRequestComment) => {
    navigation.navigate(VIEW_REQUEST_SCREEN, {
      request: node.request,
    });
  }, []);

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

  let topInsets = insets.top;

  if (topInsets <= 24) {
    topInsets = 24;
  }

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <View style={[styles.topHeader, {paddingTop: topInsets}]}>
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
        {myActivityData?.myActivity?.edges?.length === 0 &&
          !upcomingJobData?.myUpcomingJobs && (
            <View style={styles.emptyContainer}>
              <EmptyState
                title="Your notice board is empty!"
                description="You’re all up to date."
                ctaText="Request a repair"
                onPressCta={() => {
                  navigation.navigate(REQUEST_REPAIR_SCREEN);
                }}
              />
            </View>
          )}

        {upcomingJobData?.myUpcomingJobs && (
          <View style={styles.sectionContainer}>
            <SectionTitle>Upcoming jobs</SectionTitle>

            <UpcomingJob
              description={upcomingJobData?.myUpcomingJobs?.description}
              contractorName={
                upcomingJobData?.myUpcomingJobs?.contractor?.businessName
              }
              dateStart={upcomingJobData?.myUpcomingJobs?.bookingDateStart}
              dateEnd={upcomingJobData?.myUpcomingJobs?.bookingDateEnd}
              requestId={upcomingJobData?.myUpcomingJobs?.request?.id}
            />
          </View>
        )}

        {myActivityData?.myActivity?.edges?.length > 0 && (
          <View style={styles.sectionContainer}>
            <SectionTitle>Recent activity</SectionTitle>

            {myActivityData?.myActivity?.edges?.map(edge => {
              const createdDate = dayjs(edge?.node?.insertedAt)
                .tz(DEVICE_TIMEZONE)
                .fromNow();

              return (
                <Animated.View entering={FadeIn} key={edge?.node.id}>
                  <Card
                    onPress={() => onPressActivityItem(edge?.node)}
                    isTappable>
                    <ExtraSmallText>{edge?.node?.authorName}</ExtraSmallText>
                    <StandardText style={{paddingTop: 4, width: '80%'}}>
                      {edge?.node?.request.title}
                    </StandardText>
                    <SmallText numberOfLines={2} style={{marginTop: 8}}>
                      {edge?.node?.messageBody}
                    </SmallText>
                    <CaptionText style={{paddingTop: 8}}>
                      {createdDate}
                    </CaptionText>
                  </Card>
                </Animated.View>
              );
            })}
          </View>
        )}
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
    elevation: 8,
    padding: 16,
  },
  topHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 16,
  },
  emptyContainer: {
    marginHorizontal: 16,
    marginTop: 16,
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
