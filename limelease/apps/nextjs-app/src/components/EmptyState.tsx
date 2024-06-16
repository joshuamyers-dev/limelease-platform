import styled from 'styled-components';

import Image from 'next/image';

import { Heading1 } from '@components/Headings';
import { Colours } from '@utils/Colours';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { cardAnimationProps } from '@utils/AnimationsProps';

interface EmptyStateProps {
  title: string;
  description: string;
  buttonCtaText: string;
  routeTo: string;
  image: any;
  includeIcon?: boolean;
}

const EmptyState: React.FC<EmptyStateProps> = ({ title, description, buttonCtaText, image, routeTo, includeIcon = false }) => {
  const router = useRouter();

  return (
    <Container {...cardAnimationProps}>
      <Image src={image} width={345} height={336} priority style={{ marginBottom: '2rem' }} />

      <Heading1>{title}</Heading1>
      <DescriptionText>{description}</DescriptionText>

      <Button type="primary" block icon={includeIcon ? <PlusOutlined /> : null} size="large" onClick={() => router.push(routeTo)}>
        {buttonCtaText}
      </Button>
    </Container>
  );
};

const Container = styled(motion.div)`
  margin: 2rem auto;
  text-align: center;
  width: 30%;
`;

const DescriptionText = styled.div`
  font-size: 20px;
  font-weight: 500;
  color: ${Colours.GRAY_7};
  margin-bottom: 2rem;
`;

export default EmptyState;
