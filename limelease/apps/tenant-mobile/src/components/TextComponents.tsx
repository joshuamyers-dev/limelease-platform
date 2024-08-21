import {StyleSheet, Text, TextProps} from 'react-native';
import {Colours} from '../utils/Colours';

export const textComponentStyles = StyleSheet.create({
  smallText: {
    fontFamily: 'Figtree-Regular',
    fontSize: 16,
    lineHeight: 20,
    color: Colours.GRAY_8,
  },
  xSmallText: {
    fontFamily: 'Figtree-Regular',
    fontSize: 14,
    lineHeight: 20,
    color: Colours.GRAY_8,
  },
  linkText: {
    fontFamily: 'Figtree-Bold',
    color: Colours.LIME_5,
    fontSize: 16,
    lineHeight: 20,
  },
  sectionTitle: {
    fontFamily: 'Figtree-Bold',
    fontSize: 18,
    color: Colours.NAVY,
    lineHeight: 20,
  },
  standardText: {
    fontFamily: 'Figtree-Bold',
    fontSize: 16,
    color: Colours.NAVY,
    lineHeight: 20,
  },
  boldText: {
    fontFamily: 'Figtree-Bold',
    fontSize: 24,
    color: Colours.NAVY,
    lineHeight: 20,
  },
  largeText: {
    fontFamily: 'Figtree-Bold',
    fontSize: 28,
    lineHeight: 32,
    color: Colours.NAVY,
  },
  caption: {
    fontFamily: 'Figtree-Regular',
    fontSize: 12,
    lineHeight: 16,
    color: Colours.GRAY_7,
  },
});

export const SmallText: React.FC<TextProps> = ({style, ...props}) => (
  <Text style={[textComponentStyles.smallText, style]} {...props} />
);

export const LinkText: React.FC<TextProps> = ({style, ...props}) => (
  <Text style={[textComponentStyles.linkText, style]} {...props} />
);

export const SectionTitle: React.FC<TextProps> = ({style, ...props}) => (
  <Text style={[textComponentStyles.sectionTitle, style]} {...props} />
);

export const LargeText: React.FC<TextProps> = ({style, ...props}) => (
  <Text style={[textComponentStyles.largeText, style]} {...props} />
);

export const StandardText: React.FC<TextProps> = ({style, ...props}) => (
  <Text style={[textComponentStyles.standardText, style]} {...props} />
);

export const BoldText: React.FC<TextProps> = ({style, ...props}) => (
  <Text style={[textComponentStyles.boldText, style]} {...props} />
);

export const CaptionText: React.FC<TextProps> = ({style, ...props}) => (
  <Text style={[textComponentStyles.caption, style]} {...props} />
);

export const ExtraSmallText: React.FC<TextProps> = ({style, ...props}) => (
  <Text style={[textComponentStyles.xSmallText, style]} {...props} />
);
