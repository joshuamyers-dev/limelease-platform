import {LayoutAnimation} from 'react-native';
import {Address, PropertyRequestState} from '../graphql/generated';

export const renderAddressLabel = (
  address: Address,
  withLocality: boolean = false,
) => {
  const unitNumber = address.unitNumber ? `${address.unitNumber}/` : '';

  if (withLocality) {
    return `${unitNumber}${address.streetNumber} ${address.streetName} ${address.suburb}, ${address.state}`;
  } else {
    return `${unitNumber}${address.streetNumber} ${address.streetName}`;
  }
};

export const formatMobileNumber = (
  number: string,
  includeSpaces: boolean = false,
): string => {
  const numberWithoutCountryCode = number.startsWith('+614')
    ? number.slice(4)
    : number;
  const maybeSpaces = includeSpaces ? '$1 $2 $3' : '$1$2$3';
  const formattedNumber =
    '04' +
    numberWithoutCountryCode.replace(/(\d{2})(\d{3})(\d{3})/, maybeSpaces);

  return formattedNumber;
};

export const layoutAnimate = () => {
  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
};

export const formatStatusTitle = (title: PropertyRequestState) => {
  if (title === PropertyRequestState.AwaitingResponse) {
    return 'Awaiting Response';
  } else if (title === PropertyRequestState.AssignedToContractor) {
    return 'Awaiting Contractor';
  } else if (title === PropertyRequestState.ContractorAppointmentBooked) {
    return 'Job Accepted';
  } else if (title === PropertyRequestState.Resolved) {
    return 'Completed';
  } else if (title === PropertyRequestState.Deleted) {
    return 'Archived';
  }
};
