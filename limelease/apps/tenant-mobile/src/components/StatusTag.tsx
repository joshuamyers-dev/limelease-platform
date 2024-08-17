import {PropertyRequestState} from '@graphql/generated';
import {Maybe} from '@types/Maybe';
import {Colours} from '@utils/Colours';
import {formatStatusTitle} from '@utils/Helpers';
import {View, Text, StyleSheet} from 'react-native';
import {useCallback} from 'react';

interface StatusTagProps {
  status: Maybe<PropertyRequestState>;
}

const StatusTag: React.FC<StatusTagProps> = ({status}) => {
  if (status === PropertyRequestState.AwaitingResponse) {
    return (
      <View style={styles.awaitingResponseTag}>
        <Text style={styles.awaitingResponseText}>
          {formatStatusTitle(status)}
        </Text>
      </View>
    );
  } else if (status === PropertyRequestState.AssignedToContractor) {
    return (
      <View style={styles.awaitingTag}>
        <Text style={styles.awaitingText}>{formatStatusTitle(status)}</Text>
      </View>
    );
  } else if (status === PropertyRequestState.ContractorAppointmentBooked) {
    return (
      <View style={styles.jobAcceptedTag}>
        <Text style={styles.jobAcceptedText}>{formatStatusTitle(status)}</Text>
      </View>
    );
  } else if (status === PropertyRequestState.Resolved) {
    return (
      <View style={styles.jobResolvedTag}>
        <Text style={styles.jobResolvedText}>{formatStatusTitle(status)}</Text>
      </View>
    );
  } else if (status === PropertyRequestState.Deleted) {
    return (
      <View style={styles.jobCancelledTag}>
        <Text style={styles.jobCancelledText}>{formatStatusTitle(status)}</Text>
      </View>
    );
  } else {
    return null;
  }
};

const styles = StyleSheet.create({
  awaitingResponseTag: {
    alignSelf: 'flex-start',
    backgroundColor: Colours.ORANGE_LIGHT,
    borderWidth: 1,
    borderColor: Colours.ORANGE_LIGHT,
    padding: 5,
    borderRadius: 3,
  },
  awaitingResponseText: {
    color: Colours.ORANGE_DARK,
    fontFamily: 'Figtree-Regular',
    fontWeight: '500',
    fontSize: 12,
  },
  awaitingTag: {
    alignSelf: 'flex-start',
    backgroundColor: Colours.ORANGE_LIGHT,
    borderWidth: 1,
    borderColor: Colours.ORANGE_LIGHT,
    padding: 5,
    borderRadius: 3,
  },
  awaitingText: {
    color: Colours.ORANGE_DARK,
    fontFamily: 'Figtree-Regular',
    fontWeight: '500',
    fontSize: 12,
  },
  jobAcceptedTag: {
    alignSelf: 'flex-start',
    backgroundColor: Colours.LIGHT_GREEN,
    borderWidth: 1,
    borderColor: Colours.LIGHT_GREEN,
    padding: 5,
    borderRadius: 3,
  },
  jobAcceptedText: {
    color: Colours.DARK_GREEN,
    fontFamily: 'Figtree-Regular',
    fontWeight: '500',
    fontSize: 12,
  },
  jobResolvedTag: {
    alignSelf: 'flex-start',
    backgroundColor: Colours.LIGHT_GREEN,
    borderWidth: 1,
    borderColor: Colours.LIGHT_GREEN,
    padding: 5,
    borderRadius: 3,
  },
  jobResolvedText: {
    color: Colours.DARK_GREEN,
    fontFamily: 'Figtree-Regular',
    fontWeight: '500',
    fontSize: 12,
  },
  jobCancelledTag: {
    alignSelf: 'flex-start',
    backgroundColor: Colours.LIGHT_RED,
    borderWidth: 1,
    borderColor: Colours.LIGHT_RED,
    padding: 5,
    borderRadius: 3,
  },
  jobCancelledText: {
    color: Colours.RED_8,
    fontFamily: 'Figtree-Regular',
    fontWeight: '500',
    fontSize: 12,
  },
});

export default StatusTag;
