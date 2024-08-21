import {Portal} from '@gorhom/portal';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import RoundButton from './RoundButton';
import {Colours} from '@utils/Colours';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeOut,
  FadeOutUp,
  SlideInUp,
} from 'react-native-reanimated';

interface ConfirmationModalProps {
  isVisible: boolean;
  title: string;
  message: string;
  onDismiss: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isVisible,
  title,
  message,
  onDismiss,
}) => {
  if (!isVisible) return null;

  return (
    <Portal>
      <View style={styles.container}>
        <Animated.View
          style={styles.modalContainer}
          entering={FadeIn}
          exiting={FadeOut}>
          <Animated.View
            style={styles.card}
            entering={FadeInDown}
            exiting={FadeOutUp}>
            <Text style={styles.titleText}>{title}</Text>
            <Text style={styles.descText}>{message}</Text>
            <RoundButton title="Ok, got it!" onPress={onDismiss} />
          </Animated.View>
        </Animated.View>
      </View>
    </Portal>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
  },
  card: {
    padding: 24,
    borderRadius: 8,
    backgroundColor: 'white',
  },
  titleText: {
    fontFamily: 'Figtree-Bold',
    fontSize: 24,
    lineHeight: 28,
    color: Colours.NAVY,
    textAlign: 'center',
  },
  descText: {
    fontFamily: 'Figtree-Regular',
    color: Colours.GRAY_8,
    fontSize: 16,
    lineHeight: 20,
    textAlign: 'center',
    paddingTop: 16,
    marginBottom: 24,
  },
});

export default ConfirmationModal;
