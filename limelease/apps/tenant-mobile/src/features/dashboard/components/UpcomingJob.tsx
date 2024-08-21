import Card from '@components/Card';
import RoundButton, {ButtonType} from '@components/RoundButton';
import {
  BoldText,
  CaptionText,
  LargeText,
  SmallText,
  StandardText,
} from '@components/TextComponents';
import {VIEW_REQUEST_SCREEN} from '@navigators/ScreenConstants';
import {useNavigation} from '@react-navigation/native';
import {Colours} from '@utils/Colours';
import {DEVICE_TIMEZONE} from '@utils/Constants';
import dayjs from '@utils/Dayjs';

import {Maybe} from 'graphql/jsutils/Maybe';
import {useCallback} from 'react';

import {StyleSheet, View} from 'react-native';

interface UpcomingJobProps {
  description: Maybe<string>;
  contractorName: Maybe<string>;
  dateStart: Maybe<string>;
  dateEnd: Maybe<string>;
  requestId: Maybe<string>;
}

const UpcomingJob: React.FC<UpcomingJobProps> = ({
  description,
  contractorName,
  dateStart,
  dateEnd,
  requestId,
}) => {
  const navigation = useNavigation();
  const startDate = dayjs(dateStart).tz(DEVICE_TIMEZONE);
  const endDate = dayjs(dateEnd).tz(DEVICE_TIMEZONE);

  const onPressViewRequest = useCallback(() => {
    navigation.navigate(VIEW_REQUEST_SCREEN, {request: {id: requestId}});
  }, []);

  return (
    <Card
      style={{
        paddingTop: 16,
        paddingRight: 16,
        paddingLeft: 0,
        paddingBottom: 0,
        marginTop: 8,
        alignItems: 'flex-start',
      }}>
      <View style={styles.container}>
        <View style={styles.dateBox}>
          <BoldText style={{lineHeight: 0}}>{startDate.format('D')}</BoldText>
          <SmallText>{endDate.format('MMM')}</SmallText>
        </View>

        <View style={styles.detailsContainer}>
          <StandardText>{description}</StandardText>
          <SmallText>{contractorName}</SmallText>
          <View style={styles.bookedForContainer}>
            <CaptionText>Booked for</CaptionText>
            <CaptionText style={{color: Colours.GRAY_8}}>
              {startDate.format('h:mma')} - {endDate.format('h:mma')}
            </CaptionText>
          </View>
        </View>
      </View>

      {requestId && (
        <RoundButton
          type={ButtonType.LINK}
          title="View request"
          onPress={onPressViewRequest}
        />
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 1},
    shadowRadius: 2,
    backgroundColor: 'white',
    borderRadius: 8,
    paddingTop: 16,
    paddingRight: 16,
    marginTop: 8,
    alignItems: 'flex-start',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingLeft: 16,
    paddingBottom: 16,
  },
  dateBox: {
    backgroundColor: Colours.GRAY_3,
    padding: 8,
    marginRight: 16,
  },
  detailsContainer: {
    flex: 1,
    flexDirection: 'column',
    gap: 4,
  },
  bookedForContainer: {
    marginTop: 4,
    flexDirection: 'row',
    gap: 2,
  },
});

export default UpcomingJob;
