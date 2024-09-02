import {LayoutAnimation, PermissionsAndroid, Platform} from 'react-native';
import {Address, PropertyRequestState} from '../graphql/generated';

import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';

import {Asset} from 'react-native-image-picker';
import ImageResizer from '@bam.tech/react-native-image-resizer';
import Config from 'react-native-config';

export const requestUserPermission = async () => {
  return new Promise<FirebaseMessagingTypes.AuthorizationStatus>(
    async (resolve, reject) => {
      const authStatus = await messaging().requestPermission();

      if (Platform.OS === 'android') {
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );
      }

      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        resolve(authStatus);
      } else {
        reject(authStatus);
      }
    },
  );
};

export const registerForToken = async () => {
  const token = await messaging().getToken();
  return token;
};

export const resizeAndUploadPhotos = async (
  assets: Asset[],
  authToken: string,
) => {
  let images = await Promise.all(
    assets.map(async asset => {
      return await ImageResizer.createResizedImage(
        asset.uri,
        2000,
        2000,
        'JPEG',
        80,
      );
    }),
  );

  images = await Promise.all(
    images.map(async asset => {
      const form = new FormData();

      form.append('files', {
        uri: asset.uri,
        name: 'photo.jpg',
        type: 'image/jpeg',
      });

      const response = await fetch(`${Config.API_URL}/temp-file`, {
        method: 'POST',
        body: form,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      const responseBody = await response.json();

      return {
        ...asset,
        tempPath: responseBody.temp_path,
      };
    }),
  );

  return images;
};

export const renderAddressLabel = (
  address: Address,
  withLocality: boolean = false,
) => {
  const unitNumber = address.unitNumber ? `${address.unitNumber}/` : '';

  if (withLocality) {
    return `${unitNumber}${address.streetNumber} ${address.streetName} ${address.suburb}, ${address.state}`;
  } else {
    return `${unitNumber}${address.streetNumber} ${address.streetName}`;
  }
};

export const formatMobileNumber = (
  number: string,
  includeSpaces: boolean = false,
): string => {
  const numberWithoutCountryCode = number.startsWith('+614')
    ? number.slice(4)
    : number;
  const maybeSpaces = includeSpaces ? '$1 $2 $3' : '$1$2$3';
  const formattedNumber =
    '04' +
    numberWithoutCountryCode.replace(/(\d{2})(\d{3})(\d{3})/, maybeSpaces);

  return formattedNumber;
};

export const layoutAnimate = () => {
  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
};

export const formatStatusTitle = (title: PropertyRequestState) => {
  if (title === PropertyRequestState.AwaitingResponse) {
    return 'Awaiting Response';
  } else if (title === PropertyRequestState.AssignedToContractor) {
    return 'Awaiting Contractor';
  } else if (title === PropertyRequestState.ContractorAppointmentBooked) {
    return 'Job Accepted';
  } else if (title === PropertyRequestState.Resolved) {
    return 'Completed';
  } else if (title === PropertyRequestState.Deleted) {
    return 'Archived';
  }
};
