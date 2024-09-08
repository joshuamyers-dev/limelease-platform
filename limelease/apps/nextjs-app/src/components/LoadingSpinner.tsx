import { Colours } from '@utils/Colours';
import { CSSProperties } from 'react';
import { RotateSpinner } from 'react-spinners-kit';
import styled from 'styled-components';

interface LoadingSpinnerProps {
  size?: number;
  containerStyle?: CSSProperties;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 24, containerStyle = {} }) => {
  return (
    <Container style={containerStyle}>
      <RotateSpinner size={size} color={Colours.LIME_5} />
    </Container>
  );
};

const Container = styled.div`
  margin: 40px;
  text-align: center;
  display: flex;
  justify-content: center;
`;

export default LoadingSpinner;
