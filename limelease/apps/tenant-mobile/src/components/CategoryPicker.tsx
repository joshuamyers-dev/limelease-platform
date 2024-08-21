import React, {FC, useRef} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from 'react-native';
import {Colours} from '../utils/Colours';
import {SmallText, StandardText} from './TextComponents';
import BottomSheet from '@gorhom/bottom-sheet';

interface CustomTextInputProps extends TextInputProps {}

const CategoryPicker: FC<CustomTextInputProps> = props => {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <View style={styles.inputContainer}>
        <View style={{flex: 1}}>
          <SmallText
            style={{
              color: props.value ? Colours.NAVY : Colours.GRAY_8,
            }}>
            {props.value ? props.value : props.placeholder}
          </SmallText>
        </View>
        <Image source={require('@assets/images/icon-down.png')} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    backgroundColor: '#ffffff',
    borderColor: Colours.GRAY_5,
    borderWidth: 1,
    padding: 16,
    marginBottom: 10,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default CategoryPicker;
