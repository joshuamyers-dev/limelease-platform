import { AnimatedContainer } from '@components/AnimatedContainer';
import { PropertyFile } from '@graphql/generated';
import { fadeInOutProps } from '@utils/AnimationsProps';
import { Colours } from '@utils/Colours';
import { dayjs } from '@utils/DayjsTimezone';
import { Empty } from 'antd';
import axios from 'axios';

import React, { useCallback } from 'react';
import styled from 'styled-components';

interface PropertyFilesProps {
  files: PropertyFile[];
}

const PropertyFiles: React.FC<PropertyFilesProps> = ({ files }) => {
  const onClickFile = useCallback(async (file: PropertyFile) => {
    if (file.staticMedia?.url) {
      const response = await axios.get(file.staticMedia.url, {
        responseType: 'blob',
      });

      const newFile = new Blob([response.data], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(newFile);

      window.open(fileURL, '_blank');
    }
  }, []);

  return (
    <AnimatedContainer {...fadeInOutProps}>
      {files?.map((file) => {
        return (
          <>
            <FileRow onClick={() => onClickFile(file)}>
              <FileName>{file.fileName}</FileName>
              <DateAdded>{dayjs(file.insertedAt).fromNow()}</DateAdded>
            </FileRow>
          </>
        );
      })}

      {files?.length === 0 && <Empty description="No files have been added yet" />}
    </AnimatedContainer>
  );
};

const SectionTitle = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: ${Colours.GRAY_8};
`;

const FileRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
`;

const FileName = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: ${Colours.LIME_10};
  padding-bottom: 16px;
  padding-top: 24px;
`;

const DateAdded = styled.div`
  font-size: 16px;
  color: ${Colours.GRAY_8};
  font-weight: 600;
`;

export default PropertyFiles;
