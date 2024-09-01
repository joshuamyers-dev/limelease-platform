import ImageResizer from '@bam.tech/react-native-image-resizer';
import BottomSheetWrapper from '@components/BottomSheetWrapper';
import CategoryPicker from '@components/CategoryPicker';
import CloseButton from '@components/CloseButton';
import CustomTextInput from '@components/CustomTextInput';
import RoundButton, {ButtonType} from '@components/RoundButton';
import {StandardText} from '@components/TextComponents';
import {useActionSheet} from '@expo/react-native-action-sheet';
import BottomSheet from '@gorhom/bottom-sheet';
import {
  MyRequestsDocument,
  PropertyRequestUrgency,
  useCreateRequestMutation,
  useFetchRequestCategoriesQuery,
  useMeQuery,
} from '@graphql/generated';
import {VIEW_REQUEST_SCREEN} from '@navigators/ScreenConstants';
import {URGENCY_TYPES} from '@utils/Constants';
import {layoutAnimate, resizeAndUploadPhotos} from '@utils/Helpers';
import {useGlobalStore} from '@utils/Store';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Config from 'react-native-config';
import {
  Asset,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from 'react-native-reanimated';
import CategoryWheelPicker from '../components/CategoryWheelPicker';

const RequestRepairContainer: React.FC = ({navigation}) => {
  const {data: categoryData, error} = useFetchRequestCategoriesQuery({
    fetchPolicy: 'cache-first',
  });

  const {data: userData} = useMeQuery({fetchPolicy: 'cache-first'});

  const [
    createRequestMutation,
    {loading, data: createRequestData, error: createRequestError},
  ] = useCreateRequestMutation();

  const bottomSheetRef = useRef<BottomSheet>(null);
  const {showActionSheetWithOptions} = useActionSheet();

  const authToken = useGlobalStore(state => state.token);

  const [requestSubject, setRequestSubject] = useState('');
  const [requestDetails, setRequestDetails] = useState('');
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(-1);
  const [selectedUrgencyIndex, setSelectedUrgencyIndex] = useState(-1);
  const [photos, setPhotos] = useState<Response[]>([]);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const [canSubmitForm, setCanSubmitForm] = useState(false);
  const [bottomSheetOption, setBottomSheetOption] = useState<
    'category' | 'urgency'
  >('category');

  const categoryTitles = useMemo(() => {
    return categoryData?.propertyRequestCategories?.map(
      category => category?.name,
    );
  }, [categoryData?.propertyRequestCategories]);

  const formIsValid = useMemo(() => {
    if (
      requestSubject !== '' &&
      requestDetails !== '' &&
      selectedCategoryIndex !== -1 &&
      selectedUrgencyIndex !== -1
    ) {
      return true;
    } else {
      return false;
    }
  }, [
    requestSubject,
    requestDetails,
    selectedCategoryIndex,
    selectedUrgencyIndex,
  ]);

  const onPressAddPhotos = useCallback(() => {
    showActionSheetWithOptions(
      {
        options: ['Take photo', 'Select from photo library', 'Cancel'],
        cancelButtonIndex: 2,
        destructiveButtonIndex: undefined,
      },
      async (selectedIndex: number) => {
        switch (selectedIndex) {
          case 0:
            const cameraResponse = await launchCamera({
              mediaType: 'photo',
              cameraType: 'back',
              quality: 1.0,
              saveToPhotos: true,
            });

            if (cameraResponse.assets && cameraResponse.assets.length > 0) {
              const images = await resizeAndUploadPhotos(
                cameraResponse.assets,
                authToken,
              );

              layoutAnimate();
              setUploadingPhotos(false);
              setPhotos(images);
            }

            break;

          case 1:
            const pickerResponse = await launchImageLibrary({
              mediaType: 'photo',
              quality: 1.0,
              selectionLimit: 5,
            });

            if (pickerResponse.assets && pickerResponse.assets.length > 0) {
              setUploadingPhotos(true);

              const images = await resizeAndUploadPhotos(
                pickerResponse.assets,
                authToken,
              );

              layoutAnimate();
              setUploadingPhotos(false);
              setPhotos(images);
            }

            break;
        }
      },
    );
  }, []);

  const onPressSendRequest = useCallback(async () => {
    const createRequestResponse = await createRequestMutation({
      variables: {
        title: requestSubject,
        details: requestDetails,
        propertyId: userData?.me?.tenant?.property?.id,
        categoryId:
          categoryData?.propertyRequestCategories?.[selectedCategoryIndex]?.id,
        urgency: PropertyRequestUrgency.Emergency,
        photos: photos.map(photo => {
          return {
            uriPath: photo.tempPath,
            type: 'image/jpeg',
            name: photo.name,
          };
        }),
      },
      refetchQueries: [MyRequestsDocument],
    });

    navigation.pop();
    navigation.navigate(VIEW_REQUEST_SCREEN, {
      request: createRequestResponse.data?.requestCreate,
    });
  }, [
    requestSubject,
    requestDetails,
    selectedCategoryIndex,
    selectedUrgencyIndex,
    photos,
    userData?.me,
  ]);

  const onPressRemovePhoto = useCallback(
    (subject: Asset) => {
      setPhotos(photos.filter(photo => photo.uri !== subject.uri));
    },
    [photos],
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{flexGrow: 1}}
      showsVerticalScrollIndicator={false}>
      <StatusBar
        backgroundColor="white"
        barStyle={Platform.OS === 'ios' ? 'light-content' : 'dark-content'}
      />
      <BottomSheetWrapper ref={bottomSheetRef}>
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
          <StandardText>
            Select {bottomSheetOption === 'category' ? 'category' : 'urgency'}
          </StandardText>
        </View>
        {bottomSheetOption === 'category' && (
          <CategoryWheelPicker
            options={categoryTitles}
            selectedIndex={selectedCategoryIndex}
            onChangeIndex={setSelectedCategoryIndex}
          />
        )}
        {bottomSheetOption === 'urgency' && (
          <CategoryWheelPicker
            options={URGENCY_TYPES}
            selectedIndex={selectedUrgencyIndex}
            onChangeIndex={setSelectedUrgencyIndex}
          />
        )}
      </BottomSheetWrapper>

      <CustomTextInput
        placeholder="Subject of your request"
        onChangeText={setRequestSubject}
        value={requestSubject}
      />
      <CategoryPicker
        placeholder="Category"
        value={
          categoryData?.propertyRequestCategories?.[selectedCategoryIndex]
            ?.name ?? null
        }
        onPress={() => {
          setBottomSheetOption('category');
          bottomSheetRef.current?.expand();
        }}
      />
      <CustomTextInput
        placeholder="Details"
        multiline
        onChangeText={setRequestDetails}
        value={requestDetails}
      />
      <CategoryPicker
        placeholder="Urgency"
        value={URGENCY_TYPES[selectedUrgencyIndex]}
        onPress={() => {
          setBottomSheetOption('urgency');
          bottomSheetRef.current?.expand();
        }}
      />

      <View style={styles.photosContainer}>
        <StandardText style={{marginBottom: 16}}>Photos</StandardText>
        <RoundButton
          type={ButtonType.CLEAR}
          loading={uploadingPhotos}
          title="Add photos"
          iconLeft={<Image source={require('@assets/images/icon-plus.png')} />}
          onPress={onPressAddPhotos}
        />

        <ScrollView
          style={styles.photoPreviews}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{paddingRight: 16}}>
          {photos.map((photo, index) => (
            <Animated.View
              style={styles.photoContainer}
              layout={LinearTransition}
              entering={FadeIn}
              key={index}
              exiting={FadeOut}>
              <TouchableOpacity
                style={styles.closeContainer}
                hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                onPress={() => onPressRemovePhoto(photo)}>
                <Image
                  source={require('@assets/images/icon-park-outline_close.png')}
                  style={{tintColor: 'white', width: 15, height: 15}}
                />
              </TouchableOpacity>
              <Image source={{uri: photo.uri}} style={styles.photoPreview} />
            </Animated.View>
          ))}
        </ScrollView>
      </View>

      <View
        style={{
          marginVertical: 16,
        }}>
        <RoundButton
          type={ButtonType.PRIMARY}
          disabled={!formIsValid}
          loading={loading}
          title="Send request"
          onPress={onPressSendRequest}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 16,
  },
  photosContainer: {
    paddingTop: 16,
    flex: 1,
  },
  closeContainer: {
    backgroundColor: 'black',
    position: 'absolute',
    right: 8,
    top: 8,
    zIndex: 10,
    borderRadius: 60,
    padding: 2,
  },
  photoPreviews: {
    marginTop: 16,
    paddingLeft: 16,
    marginHorizontal: -16,
    flex: 1,
  },
  photoContainer: {
    marginRight: 8,
  },
  photoPreview: {
    width: 120,
    height: 120,
    borderRadius: 8,
  },
});

export default RequestRepairContainer;
