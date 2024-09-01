import {
  Platform,
  StyleSheet,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
} from 'react-native';

interface CardProps {
  children: React.ReactNode;
  style: StyleSheet.NamedStyles<any>;
  onPress: () => void;
  isTappable: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  style,
  onPress,
  isTappable = false,
}) => {
  const Touchable =
    Platform.OS === 'ios' ? TouchableOpacity : TouchableNativeFeedback;

  return (
    <Touchable onPress={onPress} disabled={!isTappable}>
      <View style={[styles.cardContainer, style]}>{children}</View>
    </Touchable>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginTop: 8,
  },
});

export default Card;
