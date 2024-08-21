import {useEffect} from 'react';
import {Keyboard, Platform} from 'react-native';

import {useSharedValue} from 'react-native-reanimated';

const CONTINUE_PADDING_BOTTOM = 30;
const CONTINUE_PADDING_EXPANDED = 15;

export const BUTTON_STIFFNESS = 50;
export const BUTTON_DAMPING = 15;

const useButtonFloatingView = (paddingBottom = CONTINUE_PADDING_BOTTOM, paddingExpanded = CONTINUE_PADDING_EXPANDED) => {
  const continueButtonHeight = useSharedValue(paddingBottom);

  useEffect(() => {
    const showSubscription = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow', e => {
      const {
        endCoordinates: {height},
      } = e;

      continueButtonHeight.value = height + paddingExpanded;
    });
    const hideSubscription = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide', () => {
      continueButtonHeight.value = paddingBottom;
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return [continueButtonHeight];
};

export default useButtonFloatingView;
