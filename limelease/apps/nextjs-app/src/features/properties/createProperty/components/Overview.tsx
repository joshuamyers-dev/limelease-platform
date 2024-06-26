import { useCallback, useContext, useEffect, useState } from 'react';

import { InboxOutlined } from '@ant-design/icons';
import useStorage from '@hooks/useLocalStorage';
import { LOCAL_STORAGE_AUTH_KEY } from '@utils/Constants';
import { Button, Col, Form, FormInstance, Input, Row, Select, Upload, message, notification } from 'antd';
import axios from 'axios';
import { Colours } from '../../../../utils/Colours';
import { debounce, hexToRGBA, normFile, renderAddressLabel, resizeFile } from '../../../../utils/Helpers';
import { AddPropertyContext } from '../containers/CreatePropertyContainer';
import { REAL_ESTATE_SEARCH_API, UPLOAD_IMAGE_API_URL } from '../helpers/Constants';

import Lottie from 'react-lottie';

import * as animationData from '@public/animations/house-building.json';
import styled from 'styled-components';
import { AnimatePresence, motion } from 'framer-motion';

const { Search } = Input;

interface OverviewProps {
  form: FormInstance;
  propertyDetails: any;
  isEditing?: Boolean;
}

import dynamic from 'next/dynamic';

const AUTO_POPULATING_INITIAL = 'Grabbing some details on this property...';

const PlayerWithNoSSR = dynamic(() => import('react-lottie').then((module) => module.default), { ssr: false });

const Overview = ({ form, isEditing = false, propertyDetails }: OverviewProps) => {
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState({});
  const [fileList, setFileList] = useState([]);
  const [autoPopulatingProperty, setAutoPopulatingProperty] = useState(false);
  const [autoPopulatingText, setAutoPopulatingText] = useState(AUTO_POPULATING_INITIAL);

  const context = useContext(AddPropertyContext);
  const [getAuthToken] = useStorage();

  const authToken = getAuthToken(LOCAL_STORAGE_AUTH_KEY, 'local');

  const onSearchAddress = useCallback(async (address: string) => {
    if (!address || address === '' || address === ' ' || address.length < 5) return;

    setLoadingSearch(true);

    try {
      const { data } = await axios.get(
        `${REAL_ESTATE_SEARCH_API}?max=50&type=address%2Csuburb%2Cpostcode%2Cstate%2Cregion&src=reax-multi-intent-search-modal&query=${address}`
      );

      setLoadingSearch(false);
      context?.setSearchResults(data._embedded.suggestions);
    } catch (err) {
      setLoadingSearch(false);
      console.log(err);
    }
  }, []);

  useEffect(() => {
    if (propertyDetails) {
      const overviewFormValues = {
        addressObject: {
          unitNumber: propertyDetails.address.unitNumber,
          streetNumberFrom: propertyDetails.address.streetNumber,
          streetName: propertyDetails.address.streetName,
          streetType: propertyDetails.address.streetType,
          postcode: propertyDetails.address.postcode,
          suburb: propertyDetails.address.suburb,
          state: propertyDetails.address.state,
        },
        bedrooms: propertyDetails.bedrooms,
        bathrooms: propertyDetails.bathrooms,
        carspaces: propertyDetails.carspaces,
        photos: propertyDetails.photos.map((photo) => {
          return {
            id: photo.id,
            url: photo.staticMedia?.url,
            staticMedia: photo.staticMedia,
          };
        }),
      };

      form.setFieldsValue(overviewFormValues);
    }
  }, [propertyDetails]);

  const onSelectAddress = useCallback(
    async (addressIndex: number) => {
      setSelectedAddress(context?.searchResults[addressIndex]);

      form.setFieldsValue({
        addressObject: context?.searchResults[addressIndex]?.source,
      });

      setAutoPopulatingProperty(true);

      try {
        const {
          data: { imageUrls, propertyFeatures },
        } = await axios.post(process.env.NEXT_PUBLIC_PROPERTY_FETCHER_LAMBDA_URL as string, {
          address: context?.searchResults[addressIndex].display.text,
        });

        const photos = imageUrls.map((url) => {
          return {
            thumbUrl: url,
            url: url,
          };
        });

        form.setFieldsValue({
          bathrooms: propertyFeatures.bath,
          bedrooms: propertyFeatures.bedrooms,
          carspaces: propertyFeatures.carSpaces,
          photos: photos,
        });

        setAutoPopulatingProperty(false);
        setAutoPopulatingText(AUTO_POPULATING_INITIAL);

        notification.success({
          message: "We've pre-filled details for this property.",
        });
      } catch (err) {
        console.log(err);
        setAutoPopulatingProperty(false);
        setAutoPopulatingText(AUTO_POPULATING_INITIAL);
        notification.info({
          message: "We couldn't pre-fill any details for this property.",
        });
      }
    },
    [context?.searchResults, form]
  );

  const searchAddress = useCallback(debounce(onSearchAddress), []);

  useEffect(() => {
    if (autoPopulatingProperty && autoPopulatingText === AUTO_POPULATING_INITIAL) {
      setTimeout(() => {
        setAutoPopulatingText('Discovering property features...');

        setTimeout(() => {
          setAutoPopulatingText("Hang tight, we're just grabbing photos of the property...");
        }, 4000);
      }, 6000);
    }
  }, [autoPopulatingProperty, autoPopulatingText]);

  return (
    <Form layout="vertical" size="large" name="0" form={form} requiredMark={false}>
      <Form.Item name="addressObject" hidden />
      <Form.Item name="uploadedPhotos" hidden />

      <AnimatePresence mode="wait">
        {autoPopulatingProperty && (
          <ContainerLoader animate={{ opacity: 1 }} initial={{ opacity: 0 }}>
            <PlayerWithNoSSR
              options={{
                loop: true,
                autoplay: true,
                animationData,
              }}
              height={250}
              width={400}
            />

            <AutoPopulaterHeader>{autoPopulatingText}</AutoPopulaterHeader>
          </ContainerLoader>
        )}
      </AnimatePresence>

      {!isEditing && (
        <Form.Item name="address" label="Address:" rules={[{ required: true, message: 'Address is a required field.' }]}>
          <Select
            value={selectedAddress?.address}
            showSearch
            filterOption={false}
            onSearch={(value) => searchAddress(value)}
            onSelect={onSelectAddress}
            placeholder="Start typing the property address..."
            loading={loadingSearch}
            notFoundContent={null}
          >
            {context?.searchResults.map((searchResult, index) => {
              return (
                <Select.Option key={index} value={index}>
                  {searchResult?.display?.text}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>
      )}

      {isEditing && propertyDetails?.address && (
        <Form.Item label="Address">
          <Input value={renderAddressLabel(propertyDetails?.address, true)} disabled />
        </Form.Item>
      )}

      <Row gutter={16}>
        <Col span={8}>
          <Form.Item
            name="bedrooms"
            label="Bedroom(s):"
            rules={[
              { required: true, message: 'Please enter the amount of bedrooms.' },
              { pattern: /^\d+$/, message: 'Please input a valid number!' },
            ]}
            shouldUpdate
          >
            <Input placeholder="e.g. 2" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="bathrooms"
            label="Bathroom(s):"
            rules={[
              { required: true, message: 'Please enter the amount of bathrooms.' },
              { pattern: /^\d+$/, message: 'Please input a valid number!' },
            ]}
            shouldUpdate
          >
            <Input placeholder="e.g. 1" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="carspaces"
            label="Garage/Carport:"
            rules={[
              { required: true, message: 'Please enter the amount of carspaces.' },
              { pattern: /^\d+$/, message: 'Please input a valid number!' },
            ]}
            shouldUpdate
          >
            <Input placeholder="e.g. 1" />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item label="Photos" name="photos" valuePropName="fileList" getValueFromEvent={normFile}>
        <Upload.Dragger
          fileList={fileList}
          multiple
          accept=".png,.jpg,.jpeg,.heif"
          name="propertyListingPhoto"
          action={UPLOAD_IMAGE_API_URL}
          beforeUpload={(file) => {
            return resizeFile(file);
          }}
          headers={{
            Authorization: `Bearer ${authToken}`,
          }}
          listType="picture"
          className="upload-list-inline"
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined style={{ color: Colours.LIME_10 }} />
          </p>
          <p className="ant-upload-text">Click or drag files to this area to upload</p>
          <p className="ant-upload-hint">Support for a single or bulk upload.</p>
        </Upload.Dragger>
      </Form.Item>

      <Row>
        <Col span={12}>
          <Button type="ghost">Cancel</Button>
        </Col>
        <Col span={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button type="primary" htmlType="submit">
            Save & Next
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

const ContainerLoader = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${hexToRGBA(Colours.NAVY, 0.8)};
  border-radius: 12px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  z-index: 100;
`;

const AutoPopulaterHeader = styled.div`
  font-size: 22px;
  color: white;
  font-weight: 600;
  margin: 80px auto;
  text-align: center;
`;

export default Overview;
