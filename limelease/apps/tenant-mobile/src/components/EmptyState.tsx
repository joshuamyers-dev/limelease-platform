import {Image, View} from 'react-native';
import Card from './Card';
import {SmallText, StandardText} from './TextComponents';
import RoundButton, {ButtonType} from './RoundButton';

interface EmptyStateProps {
  title: string;
  description: string;
  ctaText: string;
  onPressCta: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  ctaText,
  onPressCta,
}) => {
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
        {ctaText && (
          <View style={{marginTop: 16, width: '100%'}}>
            <RoundButton
              type={ButtonType.PRIMARY}
              title={ctaText}
              onPress={onPressCta}
            />
          </View>
        )}
      </View>
    </Card>
  );
};

export default EmptyState;
