import { Colours } from '@utils/Colours';
import { CSSProperties } from 'react';
import SyncLoader from 'react-spinners/ClipLoader';
import styled from 'styled-components';

interface LoadingSpinnerProps {
  size?: number;
  containerStyle?: CSSProperties;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 50, containerStyle = {} }) => {
  return (
    <Container style={containerStyle}>
      <SyncLoader size={size} color={Colours.LIME_8} />
    </Container>
  );
};

const Container = styled.div`
  margin: 20% auto;
  text-align: center;
`;

export default LoadingSpinner;
