import { Rule } from 'antd/es/form';

export const REAL_ESTATE_SEARCH_API = 'https://suggest.realestate.com.au/consumer-suggest/suggestions';
export const UPLOAD_IMAGE_API_URL = `${process.env.NEXT_PUBLIC_API_URL}/temp-file`;

export const PHONE_NUMBER_FIELD_RULES: Rule[] = [
  { required: true, message: 'Phone Number is required.' },
  {
    pattern: /^04\d{8}$/,
    message: 'Phone Number must be in a valid format: "04xxxxxxxx"',
  },
];


export const PHONE_NUMBER_FIELD_RULES_NR: Rule[] = [
  { required: false, message: 'Phone Number is required.' },
  {
    pattern: /^04\d{8}$/,
    message: 'Phone Number must be in a valid format: "04xxxxxxxx"',
  },
];

export const EMAIL_ADDRESS_FIELD_RULES: Rule[] = [
  { required: true, message: 'Email Address is required.' },
  {
    type: 'email',
    message: 'Email Address must be in a valid format: jane@occupie.com.au',
  },
];

export const EMAIL_ADDRESS_FIELD_RULES_NR: Rule[] = [
  { required: false, message: 'Email Address is required.' },
  {
    type: 'email',
    message: 'Email Address must be in a valid format: jane@occupie.com.au',
  },
];

export const WEBSITE_URL_FIELD_RULES: Rule[] = [
  {
    type: 'url',
    message: 'Website URL must be in a valid format: https://occupie.com.au',
  },
];
