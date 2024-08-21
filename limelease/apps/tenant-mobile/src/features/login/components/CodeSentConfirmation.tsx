import React from 'react';
import {View, Text, Modal, StyleSheet} from 'react-native';
import {Portal} from '@gorhom/portal';
import {Colours} from '../../../utils/Colours';
import RoundButton from '../../../components/RoundButton';

interface CodeSentConfirmationProps {
  isVisible: boolean;
}

const CodeSentConfirmation: React.FC<CodeSentConfirmationProps> = ({
  isVisible,
}) => {
  if (!isVisible) return null;

  return (
    <Portal>
      <View style={styles.container}>
        <View style={styles.modalContainer}>
          <View style={styles.card}>
            <Text style={styles.titleText}>
              Another code is on its way to you.
            </Text>
            <Text style={styles.descText}>
              Please wait a minute to enter the new code.
            </Text>
            <RoundButton title="Ok, got it!" />
          </View>
        </View>
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
    paddingTop: 4,
    marginBottom: 16,
  },
});

export default CodeSentConfirmation;
