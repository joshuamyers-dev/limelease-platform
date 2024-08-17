import React, {ReactNode} from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  ActivityIndicator,
  View,
} from 'react-native';
import {Colours} from '../utils/Colours';

export enum ButtonType {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  LINK = 'link',
  CLEAR = 'clear',
}

interface RoundButtonProps {
  title: string;
  type?: ButtonType;
  disabled?: boolean;
  loading: boolean;
  onPress: () => void;
  iconLeft: ReactNode;
}

const RoundButton: React.FC<RoundButtonProps> = ({
  title,
  loading = false,
  disabled = false,
  iconLeft,
  type = ButtonType.PRIMARY,
  onPress,
}) => {
  return (
    <TouchableOpacity
      disabled={disabled || loading}
      style={[
        styles.button,
        type === ButtonType.LINK && {backgroundColor: 'transparent'},
        type === ButtonType.CLEAR && {
          backgroundColor: 'transparent',
          borderColor: Colours.LIME_5,
          borderWidth: 1,
        },
        disabled && {
          backgroundColor: Colours.GRAY_7,
        },
      ]}
      onPress={onPress}>
      {loading && <ActivityIndicator color="white" />}

      {!loading && (
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
          {iconLeft}
          <Text
            style={[
              styles.buttonText,
              type == ButtonType.LINK && {color: Colours.LIME_5},
              type === ButtonType.CLEAR && {
                borderColor: Colours.LIME_5,
                color: Colours.LIME_5,
              },
            ]}>
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colours.LIME_5,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontFamily: 'Figtree-Bold',
    fontSize: 16,
  },
});

export default RoundButton;
