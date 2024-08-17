import {Image, View} from 'react-native';
import Card from './Card';
import {SmallText, StandardText} from './TextComponents';

interface EmptyStateProps {
  title: string;
  description: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({title, description}) => {
  return (
    <Card>
      <Image
        source={require('@assets/images/empty-activity.png')}
        style={{alignSelf: 'center'}}
      />

      <View
        style={{
          flexDirection: 'column',
          alignItems: 'center',
          gap: 4,
          paddingTop: 16,
        }}>
        <StandardText>{title}</StandardText>
        <SmallText style={{textAlign: 'center', width: '85%'}}>
          {description}
        </SmallText>
      </View>
    </Card>
  );
};

export default EmptyState;
