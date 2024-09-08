import {
  CaptionText,
  LargeText,
  SmallText,
  StandardText,
} from '@components/TextComponents';
import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  LayoutAnimation,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import SegmentedControl from '../components/SegmentedControl';
import {PropertyRequestFilter, useMyRequestsQuery} from '@graphql/generated';
import Card from '@components/Card';
import StatusTag from '@components/StatusTag';
import dayjs from 'dayjs';
import {DEVICE_TIMEZONE} from '@utils/Constants';
import RoundButton, {ButtonType} from '@components/RoundButton';
import {
  REQUEST_REPAIR_SCREEN,
  VIEW_REQUEST_SCREEN,
} from '@navigators/ScreenConstants';
import {layoutAnimate} from '@utils/Helpers';

const RequestsContainer: React.FC = ({navigation}) => {
  const insets = useSafeAreaInsets();

  const [selectedFilter, setSelectedFilter] = useState(
    PropertyRequestFilter.New,
  );

  const {
    data: requestsData,
    fetchMore,
    loading,
  } = useMyRequestsQuery({
    variables: {
      first: 10,
      state: selectedFilter,
    },
    fetchPolicy: 'cache-and-network',
  });

  const onEndReached = useCallback(() => {
    if (requestsData?.myRequests?.pageInfo.hasNextPage) {
      fetchMore({
        variables: {
          after: requestsData?.myRequests?.pageInfo.endCursor,
        },
      });
    }
  }, [requestsData?.myRequests?.pageInfo]);

  const onPressRequestRepair = useCallback(() => {
    navigation.navigate(REQUEST_REPAIR_SCREEN);
  }, []);

  const onPressRequest = useCallback(request => {
    navigation.navigate(VIEW_REQUEST_SCREEN, {request});
  }, []);

  return (
    <View style={{flex: 1}}>
      <View style={[styles.topHeader, {paddingTop: insets.top + 30}]}>
        <LargeText style={{marginLeft: 16}}>Requests</LargeText>

        <SegmentedControl
          options={['Active', 'Inactive']}
          onChange={index => {
            layoutAnimate();
            setSelectedFilter(
              index === 0
                ? PropertyRequestFilter.New
                : PropertyRequestFilter.Archived,
            );
          }}
        />
      </View>

      <View style={styles.contentContainer}>
        {loading && <ActivityIndicator style={{marginVertical: 20}} />}
        {requestsData?.myRequests?.edges?.length === 0 && !loading && (
          <View style={{marginHorizontal: 16}}>
            <Card style={{alignItems: 'center'}}>
              <Image
                source={require('../../../../assets/images/empty-requests.png')}
              />

              <View
                style={{
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 4,
                  paddingTop: 16,
                  paddingHorizontal: 16,
                }}>
                <StandardText>Your place is squeaky clean!</StandardText>
                <SmallText style={{textAlign: 'center'}}>
                  You have no active maintenance requests.
                </SmallText>
              </View>
            </Card>
          </View>
        )}

        <FlatList
          data={requestsData?.myRequests?.edges}
          extraData={requestsData?.myRequests?.edges}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: 80, paddingHorizontal: 16}}
          renderItem={({item}) => {
            const submitted = dayjs(item?.node?.insertedAt).tz(DEVICE_TIMEZONE);

            return (
              <Card
                key={item?.node?.id}
                isTappable
                onPress={() => onPressRequest(item?.node)}>
                <StatusTag status={item?.node?.state} />
                <StandardText style={{paddingTop: 8}}>
                  {item?.node?.title}
                </StandardText>
                <CaptionText style={{paddingTop: 16}}>
                  Submitted on {submitted.format('D MMM')} -{' '}
                  {submitted.fromNow()}
                </CaptionText>
              </Card>
            );
          }}
          onEndReached={onEndReached}
        />

        <View style={styles.floatingActionContainer}>
          <RoundButton
            onPress={onPressRequestRepair}
            title="Request a repair"
            type={ButtonType.PRIMARY}
          />
        </View>
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
    flex: 1,
    paddingTop: 16,
  },
  floatingActionContainer: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    left: 16,
    zIndex: 10,
  },
});

export default RequestsContainer;
