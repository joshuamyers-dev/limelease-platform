import {input} from '@pulumi/digitalocean/types';
import React, {FC} from 'react';
import {StyleSheet, TextInput, TextInputProps} from 'react-native';
import {Colours} from '../utils/Colours';

interface CustomTextInputProps extends TextInputProps {}

const CustomTextInput: FC<CustomTextInputProps> = props => {
  return (
    <TextInput
      {...props}
      style={[styles.input, props.multiline && {minHeight: 150}]}
      placeholderTextColor={Colours.GRAY_8}
    />
  );
};

const styles = StyleSheet.create({
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
  },
});

export default CustomTextInput;
