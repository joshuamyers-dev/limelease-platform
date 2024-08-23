import Card from '@components/Card';
import EmptyState from '@components/EmptyState';
import {
  LinkText,
  SectionTitle,
  SmallText,
  StandardText,
} from '@components/TextComponents';
import {File, PropertyFile, useMyLeaseQuery} from '@graphql/generated';
import {REQUEST_REPAIR_SCREEN} from '@navigators/ScreenConstants';
import {formatMobileNumber, renderAddressLabel} from '@utils/Helpers';
import FileViewer from 'react-native-file-viewer';
import {
  DocumentDirectoryPath,
  writeFile,
  exists,
} from '@dr.pogodin/react-native-fs';
import dayjs from 'dayjs';
import {useCallback, useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import axios from 'axios';

const LeaseContainer = ({navigation, route}) => {
  const {data: leaseData, loading} = useMyLeaseQuery({
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    if (route.params.propertyAddress) {
      navigation.setOptions({
        title: renderAddressLabel(route.params.propertyAddress, false),
      });
    }
  }, []);

  const [downloadingFile, setDownloadingFile] = useState('');

  const lease = leaseData?.myLease;
  const startDate = dayjs(lease?.startDate);
  const endDate = dayjs(lease?.endDate);

  const leaseTerm = useMemo(() => {
    return endDate.diff(startDate, 'months');
  }, [lease]);

  const onPressSendRequest = useCallback(() => {
    navigation.navigate(REQUEST_REPAIR_SCREEN);
  }, []);

  const onPressDownloadFile = useCallback(async (file: PropertyFile) => {
    if (!file.staticMedia?.url) {
      return;
    }

    const filePath = `${DocumentDirectoryPath}/${file.fileName}`;
    const fileExists = await exists(filePath);

    if (fileExists) {
      await FileViewer.open(filePath);
    } else {
      setDownloadingFile(file.id);

      const getFileResponse = await axios.get(file.staticMedia.url, {
        responseType: 'blob',
      });

      const reader = new FileReader();

      reader.readAsDataURL(getFileResponse.data);

      reader.onloadend = async function () {
        const base64 = reader.result;

        await writeFile(filePath, base64, 'base64');
        setDownloadingFile('');
        await FileViewer.open(filePath);
      };
    }
  }, []);

  return (
    <ScrollView style={styles.container}>
      {loading && <ActivityIndicator style={{marginTop: 20}} />}

      {!loading && (
        <>
          <SectionTitle>Lease</SectionTitle>

          <Card style={{gap: 4}}>
            <StandardText>
              {startDate.format('DD MMM YYYY')} -{' '}
              {endDate.format('DD MMM YYYY')}
            </StandardText>
            <SmallText>{leaseTerm} month lease</SmallText>
          </Card>

          <SectionTitle style={{marginTop: 24}}>
            Property Manager{lease?.property.agents?.length > 1 ? 's' : ''}
          </SectionTitle>

          {lease?.property.agents?.map(agentNode => (
            <Card style={{gap: 4}}>
              <StandardText>
                {agentNode?.agent?.user?.profile.firstName}{' '}
                {agentNode?.agent?.user?.profile.lastName}
              </StandardText>
              <SmallText selectable>
                {agentNode?.agent?.user.profile.email}
              </SmallText>
              <SmallText selectable>
                {formatMobileNumber(
                  agentNode?.agent?.user.profile.phoneNumber,
                  true,
                )}
              </SmallText>
            </Card>
          ))}

          <SectionTitle style={{marginTop: 24}}>Files</SectionTitle>

          {leaseData?.myLease?.property?.files?.map(file => (
            <Card
              onPress={() => onPressDownloadFile(file)}
              isTappable
              key={file?.id}>
              {downloadingFile === file?.id && <ActivityIndicator />}
              {downloadingFile !== file?.id && (
                <View style={styles.fileRow}>
                  <View style={{flex: 1}}>
                    <StandardText style={{width: '90%'}}>
                      {file?.fileName}
                    </StandardText>
                  </View>
                  <Image
                    source={require('../../../../assets/images/download-icon.png')}
                  />
                </View>
              )}
            </Card>
          ))}

          {leaseData?.myLease?.property?.files?.length === 0 && (
            <EmptyState
              title="No files"
              description="No files have been added yet. Check back later."
            />
          )}
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  fileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default LeaseContainer;
