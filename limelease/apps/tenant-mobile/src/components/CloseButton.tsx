import {Image, TouchableOpacity} from 'react-native';

const CloseButton = ({onPress}: {onPress: () => void}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      hitSlop={{top: 10, left: 10, right: 10, bottom: 10}}>
      <Image
        source={require('../../assets/images/icon-park-outline_close.png')}
      />
    </TouchableOpacity>
  );
};

export default CloseButton;
