import {Image, TouchableOpacity} from 'react-native';

const CloseButton = ({onPress}: {onPress: () => void}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Image
        source={require('../../assets/images/icon-park-outline_close.png')}
      />
    </TouchableOpacity>
  );
};

export default CloseButton;
