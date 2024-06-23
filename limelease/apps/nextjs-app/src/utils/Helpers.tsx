import { Address, PropertyRequestState } from '@graphql/generated';

import Compress from 'compress.js';
import { IMAGE_QUALITY, MAX_IMAGE_HEIGHT, MAX_IMAGE_WIDTH } from './Constants';

export const pxToRem = (px: number) => {
  return `${px / 10}rem`;
};

export const debounce = function (func) {
  let timer;
  return function (...args) {
    const context = this;
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      func.apply(context, args);
    }, 500);
  };
};

/**
 * Converts a hex color string to an RGBA string.
 * 
 * @param hex The hex color string (e.g., "#FFFFFF" or "#FFF").
 * @param opacity The opacity value (0-1).
 * @returns The RGBA color string.
 */
export const hexToRGBA = (hex: string, opacity: number) => {
  // Remove the hash at the start if it's there
  hex = hex.replace(/^#/, '');
  
  // Parse the hex string
  let r: number, g: number, b: number;
  if (hex.length === 3) {
    // If it's a shorthand hex color
    r = parseInt(hex[0] + hex[0], 16);
    g = parseInt(hex[1] + hex[1], 16);
    b = parseInt(hex[2] + hex[2], 16);
  } else if (hex.length === 6) {
    // If it's a full hex color
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
  } else {
    throw new Error('Invalid hex color: ' + hex);
  }

  // Return the RGBA color string
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

export const renderAddressLabel = (address: Address, withLocality: boolean = false) => {
  const unitNumber = address.unitNumber ? `${address.unitNumber}/` : '';

  if (withLocality) {
    return `${unitNumber}${address.streetNumber} ${address.streetName} ${address.suburb}, ${address.state}`;
  } else {
    return `${unitNumber}${address.streetNumber} ${address.streetName}`;
  }
};

export const formatMobileNumber = (number: string, includeSpaces: boolean = false): string => {
  const numberWithoutCountryCode = number.startsWith('+614') ? number.slice(4) : number;
  const maybeSpaces = includeSpaces ? '$1 $2 $3' : '$1$2$3';
  const formattedNumber = '04' + numberWithoutCountryCode.replace(/(\d{2})(\d{3})(\d{3})/, maybeSpaces);

  return formattedNumber;
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

export const formatSnakeCase = (subject) => {
  return toProperCase(subject.replace(/_/g, ' '));
};

export const toProperCase = (subject) => {
  return subject.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

export const resizeFile = (file) => {
  return new Promise((resolve) => {
    const compress = new Compress();

    compress
      .compress([file], {
        quality: IMAGE_QUALITY,
        maxWidth: MAX_IMAGE_WIDTH,
        maxHeight: MAX_IMAGE_HEIGHT,
        resize: true,
        rotate: false,
      })
      .then((files) => {
        const file = files[0];

        return resolve(dataURLtoFile(file.data, file.alt, file.ext));
      })
      .catch((err) => {
        console.log(err);
      });
  });
};



async function dataURLtoFile(dataUrl, fileName, fileType) {
  var bs = atob(dataUrl);
  var buffer = new ArrayBuffer(bs.length);
  var ba = new Uint8Array(buffer);
  for (var i = 0; i < bs.length; i++) {
    ba[i] = bs.charCodeAt(i);
  }

  return new File([ba], fileName, { type: fileType });
}

export const normFile = (e: any) => {
  console.log('Upload event:', e);

  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};
