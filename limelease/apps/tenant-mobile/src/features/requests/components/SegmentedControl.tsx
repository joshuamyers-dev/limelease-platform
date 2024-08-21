import {SmallText, StandardText} from '@components/TextComponents';
import {Colours} from '@utils/Colours';
import React, {useState} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  LayoutAnimation,
} from 'react-native';

interface SegmentedControlProps {
  options: string[];
  onChange: (selectedIndex: number) => void;
}

const SegmentedControl: React.FC<SegmentedControlProps> = ({
  options,
  onChange,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleOptionPress = (index: number) => {
    setSelectedIndex(index);
    onChange(index);
  };

  return (
    <View style={styles.container}>
      {options.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.option,
            index === selectedIndex && styles.selectedOption,
          ]}
          onPress={() => handleOptionPress(index)}>
          <SmallText
            style={[index === selectedIndex && styles.selectedOptionText]}>
            {option}
          </SmallText>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginTop: 16,
  },
  option: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedOption: {
    borderBottomColor: Colours.LIME_5,
    borderBottomWidth: 1,
  },
  selectedOptionText: {
    color: Colours.NAVY,
    fontFamily: 'Figtree-Bold',
  },
});

export default SegmentedControl;
