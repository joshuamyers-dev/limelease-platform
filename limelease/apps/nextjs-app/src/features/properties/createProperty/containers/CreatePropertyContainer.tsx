import React, { createContext, useCallback, useState } from 'react';

import styled from 'styled-components';

import { Breadcrumb, Button, Card, Col, Form, FormInstance, Row, Steps } from 'antd';

import { HomeOutlined, ProjectOutlined } from '@ant-design/icons';

import DashboardContainer from '@containers/DashboardContainer';
import {
  FetchPropertiesDocument,
  Landlord,
  LeaseDetails,
  PropertyDetails,
  TenantObject,
  useCreatePropertyMutation,
  useCreateStaticMediaMutation,
} from '@graphql/generated';
import { useRouter } from 'next/router';
import { FormFinishInfo } from 'rc-field-form/lib/FormContext';
import { Heading1, Heading3 } from '../../../../components/Headings';
import { Colours } from '../../../../utils/Colours';
import { pxToRem } from '../../../../utils/Helpers';
import Files from '../components/Files';
import Overview from '../components/Overview';
import Owners from '../components/Owners';
import Tenants from '../components/Tenants';

import greenTickIcon from '@public/images/green-tick.svg';
import Image from 'next/image';

const { Step } = Steps;

interface ContextProps {
  currentStep: number;
  searchResults: Array<any>;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  setSearchResults: React.Dispatch<React.SetStateAction<Array<any>>>;
}

export const AddPropertyContext = createContext<ContextProps | null>(null);

const CreatePropertyContainer = () => {
  const [form] = Form.useForm();
  const router = useRouter();

  const [currentStep, setStep] = useState(0);
  const [searchResults, setSearchResults] = useState([]);
  const [forms, setForms] = useState<Array<FormInstance>>([form]);
  const [propertyAdded, showPropertyAdded] = useState(false);

  const [createProperty, { loading, data, error }] = useCreatePropertyMutation();

  const stepStatus = (stepNumber: number) => {
    if (currentStep === stepNumber) {
      return 'wait';
    } else if (currentStep > stepNumber) {
      return 'finish';
    }
  };

  const onFormFinish = async (name: string, info: FormFinishInfo) => {
    const nameIndex: number = parseInt(name);
    const newForms: Array<FormInstance> = [...forms];

    newForms[nameIndex] = Object.values(info.forms)[0];

    setForms(newForms);

    if (nameIndex === 3) {
      const overviewFormValues = newForms[0].getFieldsValue(true);
      const tenantsFormValues = newForms[1].getFieldsValue(true);
      const landlordsFormValues = newForms[2].getFieldsValue(true);
      const filesFormValues = newForms[3].getFieldsValue(true);

      const propertyDetails: PropertyDetails = {
        address: {
          unitNumber: parseInt(overviewFormValues.addressObject.unitNumber),
          streetNumber: parseInt(overviewFormValues.addressObject.streetNumberFrom),
          streetName: overviewFormValues.addressObject.streetName,
          streetType: overviewFormValues.addressObject.streetType,
          postcode: parseInt(overviewFormValues.addressObject.postcode),
          suburb: overviewFormValues.addressObject.suburb,
          state: overviewFormValues.addressObject.state,
        },
        bedrooms: parseInt(overviewFormValues.bedrooms),
        bathrooms: parseInt(overviewFormValues.bathrooms),
        carspaces: parseInt(overviewFormValues.carspaces),
      };

      let leaseDetails: LeaseDetails | null = null;

      if (tenantsFormValues.leaseTerm) {
        leaseDetails = {
          startDate: tenantsFormValues.leaseTerm[0].toISOString(),
          endDate: tenantsFormValues.leaseTerm[1].toISOString(),
          rentPcm: parseInt(tenantsFormValues.leasePcm),
        };
      }

      const tenants = Object.values(tenantsFormValues)
        .filter((tenant) => tenant === undefined)
        .flatMap((tenant: TenantObject) => {
          return {
            email: tenant.emailAddress,
            firstName: tenant.firstName,
            lastName: tenant.lastName,
            phoneNumber: tenant.phoneNumber,
          };
        });

      const landlords = Object.values(landlordsFormValues).flatMap((landlord) => {
        return {
          email: landlord.emailAddress,
          firstName: landlord.firstName,
          lastName: landlord.lastName,
          phoneNumber: landlord.phoneNumber,
        };
      });

      const photos = overviewFormValues.photos.map((photo, index) => {
        return {
          name: photo.name,
          type: photo.type,
          uri_path: photo?.response?.temp_path,
          url: photo?.url,
        };
      });

      const files = filesFormValues?.files?.map((file, index) => {
        return {
          url: file.response.temp_path,
          name: file.name,
          type: file.type,
        };
      });

      try {
        await createProperty({
          variables: {
            propertyDetails,
            tenants,
            leaseDetails,
            landlords,
            photos,
            files: filesFormValues ? files : [],
          },
          refetchQueries: [
            {
              query: FetchPropertiesDocument,
              variables: {
                first: 10,
              },
            },
          ],
        });

        showPropertyAdded(true);
      } catch (err) {
        console.log(err);
      }
    } else {
      setStep(currentStep + 1);
    }
  };

  const onClickViewProperty = useCallback(() => {
    router.push(`/properties/${data?.createProperty?.id}`);
  }, [data]);

  const onClickReturnHome = useCallback(() => {
    router.push('/dashboard');
  }, []);

  return (
    <DashboardContainer>
      <Breadcrumb separator="/" style={{ marginTop: '32px' }}>
        <Breadcrumb.Item href="">
          <HomeOutlined />
          <span>Properties</span>
        </Breadcrumb.Item>
        <Breadcrumb.Item href="">
          <span>Add New Property</span>
        </Breadcrumb.Item>
      </Breadcrumb>

      <StyledCard>
        {!propertyAdded && (
          <>
            <Heading3 style={{ textAlign: 'center' }}>Add A New Property</Heading3>

            <StyledSteps current={currentStep} type="navigation">
              <Step status={stepStatus(0)} title="Overview" />
              <Step status={stepStatus(1)} title="Tenants" />
              <Step status={stepStatus(2)} title="Rental Providers" />
              <Step status={stepStatus(3)} title="Files" />
            </StyledSteps>

            <AddPropertyContext.Provider value={{ currentStep, setStep, searchResults, setSearchResults }}>
              <Form.Provider onFormFinish={onFormFinish}>
                {currentStep === 0 && <Overview form={forms[0]} />}
                {currentStep === 1 && <Tenants form={forms[1]} />}
                {currentStep === 2 && <Owners form={forms[2]} />}
                {currentStep === 3 && <Files form={forms[3]} loading={loading} />}
              </Form.Provider>
            </AddPropertyContext.Provider>
          </>
        )}

        {propertyAdded && (
          <SuccessContainer>
            <Image src={greenTickIcon} layout="fixed" width={63} height={63} />
            <Heading1 style={{ marginTop: '2rem' }}>You're all done!</Heading1>
            <SuccessTextDescription>
              You can now add requests and send messages to tenants, contractors and owners regarding this property. Any notifications regarding this property
              will appear on your dashboard!
            </SuccessTextDescription>

            <Row style={{ marginTop: '2rem' }}>
              <Col span={12} style={{ textAlign: 'left' }}>
                <Button type="ghost" onClick={onClickReturnHome}>
                  Return to home
                </Button>
              </Col>

              <Col span={12} style={{ textAlign: 'right' }}>
                <Button type="primary" onClick={onClickViewProperty}>
                  View Property
                </Button>
              </Col>
            </Row>
          </SuccessContainer>
        )}
      </StyledCard>
    </DashboardContainer>
  );
};

const StyledCard = styled(Card)`
  width: 80%;
  margin: ${pxToRem(32)} auto;
`;

const StyledSteps = styled(Steps)`
  border-bottom: 1px solid ${Colours.GRAY_5};
  margin-top: 32px;
  margin-bottom: 16px;
`;

const SuccessContainer = styled.div`
  text-align: center;
  width: 90%;
  margin: 0 auto;
`;

const SuccessTextDescription = styled.div`
  font-weight: 500;
  font-size: 14px;
  line-height: 22px;
  color: ${Colours.GRAY_7};
`;

export default CreatePropertyContainer;
