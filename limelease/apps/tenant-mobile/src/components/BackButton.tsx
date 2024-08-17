import {Image, TouchableOpacity} from 'react-native';

const BackButton = ({onPress}: {onPress: () => void}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Image source={require('../../assets/images/icon-back.png')} />
    </TouchableOpacity>
  );
};

export default BackButton;
