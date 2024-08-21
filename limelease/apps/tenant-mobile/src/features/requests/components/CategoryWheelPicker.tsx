import {textComponentStyles} from '@components/TextComponents';
import {Colours} from '@utils/Colours';
import WheelPicker from 'react-native-wheely';

interface CategoryWheelPickerProps {
  options: string[];
  selectedIndex: number;
  onChangeIndex: (index: number) => void;
}

const CategoryWheelPicker: React.FC<CategoryWheelPickerProps> = ({
  options,
  selectedIndex,
  onChangeIndex,
}) => {
  return (
    options?.length > 0 && (
      <WheelPicker
        selectedIndex={selectedIndex === -1 ? 0 : selectedIndex}
        options={options}
        itemTextStyle={textComponentStyles.standardText}
        onChange={onChangeIndex}
        itemStyle={{
          backgroundColor: 'white',
          borderBottomColor: Colours.GRAY_3,
          borderBottomWidth: 1,
        }}
        selectedIndicatorStyle={{
          backgroundColor: 'white',
        }}
      />
    )
  );
};

export default CategoryWheelPicker;
