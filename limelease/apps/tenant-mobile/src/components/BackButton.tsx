import {Image, TouchableOpacity} from 'react-native';

const BackButton = ({onPress}: {onPress: () => void}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      hitSlop={{top: 10, left: 10, right: 10, bottom: 10}}>
      <Image source={require('../../assets/images/icon-back.png')} />
    </TouchableOpacity>
  );
};

export default BackButton;
