import {Dimensions} from 'react-native';
import {getTimeZone} from 'react-native-localize';

export const DEVICE_TIMEZONE = getTimeZone();
export const URGENCY_TYPES = ['Low', 'Mid-High', 'Emergency'];
export const SCREEN_HEIGHT = Dimensions.get('screen').height;
