import BottomSheetWrapper from '@components/BottomSheetWrapper';
import Card from '@components/Card';
import CloseButton from '@components/CloseButton';
import EmptyState from '@components/EmptyState';
import RoundButton, {ButtonType} from '@components/RoundButton';
import StatusTag from '@components/StatusTag';
import {
  CaptionText,
  ExtraSmallText,
  SectionTitle,
  SmallText,
  StandardText,
} from '@components/TextComponents';
import VirtualizedList from '@components/VirtualizedList';
import UpcomingJob from '@features/dashboard/components/UpcomingJob';
import {BottomSheetTextInput} from '@gorhom/bottom-sheet';
import BottomSheet from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheet/BottomSheet';
import {
  FetchRequestCommentsDocument,
  MeDocument,
  useAddFcmTokenMutation,
  useAddRequestCommentMutation,
  useFetchActiveJobForRequestQuery,
  useFetchRequestCommentsQuery,
  useFetchRequestQuery,
  useMeQuery,
} from '@graphql/generated';
import {Colours} from '@utils/Colours';
import {DEVICE_TIMEZONE, SCREEN_HEIGHT} from '@utils/Constants';
import {registerForToken, requestUserPermission} from '@utils/Helpers';
import dayjs from 'dayjs';
import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  View,
} from 'react-native';
import Animated, {FadeIn, FadeOut} from 'react-native-reanimated';
import {ImageViewer, ImageWrapper} from 'react-native-reanimated-viewer';

const ViewRequestContainer = ({navigation, route}) => {
  const {request} = route.params;

  const imageRef = useRef(null);
  const bottomSheetRef = useRef<BottomSheet>(null);

  const [comment, setComment] = useState('');

  const {data: userData} = useMeQuery();

  const {data: requestData, loading: fetchingRequest} = useFetchRequestQuery({
    variables: {
      id: request.id,
    },
    fetchPolicy: 'cache-and-network',
  });

  const {data: jobData, loading: fetchingJob} =
    useFetchActiveJobForRequestQuery({
      variables: {
        requestId: request.id,
      },
      fetchPolicy: 'cache-and-network',
    });

  const {
    data: commentsData,
    loading: fetchingComments,
    fetchMore: fetchMoreComments,
  } = useFetchRequestCommentsQuery({
    variables: {
      requestId: request.id,
      first: 5,
    },
    fetchPolicy: 'cache-and-network',
  });

  const [createCommentMutation, {loading: creatingComment}] =
    useAddRequestCommentMutation();

  const [updateFcmMutation] = useAddFcmTokenMutation();

  useEffect(() => {
    navigation.setOptions({
      title: `#${request?.ticketNumber ?? ''}`,
    });
  }, []);

  useEffect(() => {
    if (userData?.me) {
      setTimeout(async () => {
        await requestUserPermission();
        const token = await registerForToken();

        if (
          userData?.me?.fcmTokens?.find(fcmToken => fcmToken === token) ===
          undefined
        ) {
          await updateFcmMutation({
            variables: {
              token,
            },
            refetchQueries: [MeDocument],
          });
        }
      }, 2000);
    }
  }, [userData?.me]);

  useEffect(() => {
    navigation.setOptions({
      title: `#${requestData?.fetchRequest?.ticketNumber}`,
    });
  }, [requestData?.fetchRequest]);

  const requestPhotos = useMemo(() => {
    return requestData?.fetchRequest?.photos?.map(photo => {
      return {
        url: photo?.staticMedia.url,
      };
    });
  }, [requestData?.fetchRequest?.photos]);

  const onEndReached = useCallback(() => {
    if (commentsData?.propertyRequestComments?.pageInfo?.hasNextPage) {
      fetchMoreComments({
        variables: {
          after: commentsData?.propertyRequestComments?.pageInfo?.endCursor,
        },
      });
    }
  }, [commentsData?.propertyRequestComments?.pageInfo]);

  const onPressAddComment = useCallback(() => {
    bottomSheetRef.current?.expand();
  }, []);

  const onPressPostComment = useCallback(async () => {
    await createCommentMutation({
      variables: {
        authorName: `${userData?.me?.profile.firstName} ${userData?.me?.profile.lastName}`,
        requestId: request.id,
        messageBody: comment,
      },
      refetchQueries: [
        {
          query: FetchRequestCommentsDocument,
          variables: {
            first: 5,
            requestId: request.id,
          },
        },
      ],
    });

    setComment('');
    bottomSheetRef.current?.close();
  }, [comment, userData?.me]);

  const authorNameIsAgent = useCallback(
    (name: string) => {
      return requestData?.fetchRequest?.property?.agents?.some(
        agent =>
          `${agent?.agent?.user.profile.firstName} ${agent?.agent?.user.profile.lastName}` ===
          name,
      );
    },
    [requestData?.fetchRequest?.property?.agents],
  );

  return (
    <View style={{flex: 1}}>
      <VirtualizedList
        style={styles.container}
        contentContainerStyle={{paddingBottom: 124}}>
        <BottomSheetWrapper ref={bottomSheetRef} height={SCREEN_HEIGHT * 0.4}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingLeft: 16,
            }}
            pointerEvents="box-none">
            <View style={{flex: 0.45}}>
              <CloseButton onPress={() => bottomSheetRef.current?.close()} />
            </View>
            <StandardText>Add comment</StandardText>
          </View>
          <View style={styles.addCommentContainer}>
            <BottomSheetTextInput
              placeholder="Start typing..."
              multiline
              style={styles.input}
              onChangeText={setComment}
            />
            <View style={{marginTop: 16}}>
              <RoundButton
                type={ButtonType.PRIMARY}
                loading={creatingComment}
                disabled={comment === ''}
                title="Post"
                onPress={onPressPostComment}
              />
            </View>
          </View>
        </BottomSheetWrapper>
        <ImageViewer
          ref={imageRef}
          data={
            requestPhotos?.map(el => ({
              key: `key-${el.url}`,
              source: {uri: el.url},
            })) ?? []
          }
        />
        <SectionTitle>Information</SectionTitle>
        <Card>
          {fetchingRequest && <ActivityIndicator />}
          <StatusTag status={request.state} />
          <StandardText style={{paddingTop: 8}}>
            {requestData?.fetchRequest?.title}
          </StandardText>
          <SmallText style={{paddingTop: 4}}>
            {requestData?.fetchRequest?.details}
          </SmallText>
          <CaptionText style={{paddingTop: 8}}>
            {requestData?.fetchRequest.category.name}
          </CaptionText>

          {requestPhotos?.length > 0 && (
            <FlatList
              data={requestPhotos}
              extraData={requestPhotos}
              nestedScrollEnabled
              showsHorizontalScrollIndicator={false}
              horizontal
              style={styles.requestPhotosContainer}
              renderItem={({item, index}) => (
                <ImageWrapper
                  key={item.url}
                  viewerRef={imageRef}
                  index={index}
                  source={{
                    uri: item.url,
                  }}>
                  <Image source={{uri: item.url}} style={styles.requestPhoto} />
                </ImageWrapper>
              )}
            />
          )}
        </Card>

        {jobData?.contractorJobActive && (
          <Animated.View entering={FadeIn} exiting={FadeOut}>
            <SectionTitle style={{paddingTop: 24}}>Active Job</SectionTitle>
            <UpcomingJob
              description={jobData?.contractorJobActive?.description}
              contractorName={
                jobData?.contractorJobActive?.contractor?.businessName
              }
              dateStart={jobData?.contractorJobActive?.bookingDateStart}
              dateEnd={jobData?.contractorJobActive?.bookingDateEnd}
            />
          </Animated.View>
        )}

        <SectionTitle style={{paddingTop: 24}}>Updates</SectionTitle>
        {fetchingComments &&
          commentsData?.propertyRequestComments?.edges?.length === 0 && (
            <ActivityIndicator />
          )}

        {commentsData?.propertyRequestComments?.edges?.length === 0 && (
          <EmptyState
            title="No updates"
            description="Check back later for updates on this request."
          />
        )}

        <FlatList
          data={commentsData?.propertyRequestComments?.edges}
          extraData={commentsData?.propertyRequestComments?.edges}
          nestedScrollEnabled
          onEndReached={onEndReached}
          keyExtractor={item => item?.node?.id}
          renderItem={({item}) => {
            const createdDate = dayjs(item?.node?.insertedAt).tz(
              DEVICE_TIMEZONE,
            );

            return (
              <Animated.View entering={FadeIn} key={item?.node?.id}>
                <Card
                  style={{
                    backgroundColor: item?.node?.systemGenerated
                      ? Colours.NAVY
                      : 'white',
                  }}>
                  <ExtraSmallText
                    style={{color: item?.node?.systemGenerated && 'white'}}>
                    {item?.node?.authorName}{' '}
                    {authorNameIsAgent(item?.node?.authorName) && (
                      <ExtraSmallText
                        style={{
                          color: item?.node?.systemGenerated
                            ? Colours.GRAY_6
                            : Colours.NAVY,
                        }}>
                        (Property Manager)
                      </ExtraSmallText>
                    )}
                  </ExtraSmallText>
                  <StandardText
                    style={{
                      paddingTop: 4,
                      width: '80%',
                      color: item?.node?.systemGenerated && 'white',
                    }}>
                    {item?.node?.messageBody}
                  </StandardText>
                  <CaptionText
                    style={{
                      paddingTop: 8,
                      color: item?.node?.systemGenerated && Colours.GRAY_6,
                    }}>
                    {createdDate.fromNow()} -{' '}
                    {createdDate.format('D MMM YYYY h:mma')}
                  </CaptionText>
                </Card>
              </Animated.View>
            );
          }}
        />
      </VirtualizedList>

      <View
        style={{
          position: 'absolute',
          backgroundColor: 'white',
          height: 100,
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          paddingHorizontal: 16,
          paddingTop: 16,
          shadowColor: 'rgba(0, 0, 0, 0.3)',
          shadowOffset: {width: 0, height: -2},
          shadowOpacity: 0.4,
          shadowRadius: 4,
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
        }}>
        <RoundButton
          type={ButtonType.CLEAR}
          title="Add comment"
          iconLeft={<Image source={require('@assets/images/icon-plus.png')} />}
          onPress={onPressAddComment}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
  },
  requestPhotosContainer: {
    paddingVertical: 16,
    marginRight: -16,
  },
  addCommentContainer: {
    margin: 16,
    paddingTop: 16,
  },
  requestPhoto: {
    borderRadius: 8,
    marginRight: 16,
    width: 120,
    height: 120,
    borderColor: Colours.GRAY_5,
    borderWidth: 1,
  },
  input: {
    backgroundColor: '#ffffff',
    borderColor: Colours.GRAY_5,
    borderWidth: 1,
    fontSize: 16,
    fontFamily: 'Figtree-Regular',
    padding: 16,
    marginBottom: 10,
    borderRadius: 8,
    color: Colours.NAVY,
    textAlignVertical: 'top',
    minHeight: 150,
    maxHeight: 150,
  },
});

export default ViewRequestContainer;
