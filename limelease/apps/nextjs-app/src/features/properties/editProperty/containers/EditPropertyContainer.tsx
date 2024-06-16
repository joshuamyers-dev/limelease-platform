import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';

import styled from 'styled-components';

import { Breadcrumb, Button, Card, Col, Form, FormInstance, Row, Steps } from 'antd';

import { HomeOutlined } from '@ant-design/icons';

import DashboardContainer from '@containers/DashboardContainer';
import {
  FetchPropertiesDocument,
  Landlord,
  LandlordBaseFragment,
  LeaseDetails,
  Property,
  PropertyBaseFragment,
  PropertyDetails,
  useCreatePropertyMutation,
  useFetchPropertyQuery,
  useUpdatePropertyMutation,
} from '@graphql/generated';
import { useRouter } from 'next/router';
import { FormFinishInfo } from 'rc-field-form/lib/FormContext';
import { Heading1, Heading3 } from '../../../../components/Headings';
import { Colours } from '../../../../utils/Colours';
import { pxToRem, renderAddressLabel } from '../../../../utils/Helpers';
import Files from '../../createProperty/components/Files';
import Overview from '../../createProperty/components/Overview';
import Owners from '../../createProperty/components/Owners';
import Tenants from '../../createProperty/components/Tenants';

import greenTickIcon from '@public/images/green-tick.svg';
import Image from 'next/image';
import dayjs from 'dayjs';
import { Maybe } from '@types/Maybe';

const { Step } = Steps;

interface ContextProps {
  currentStep: number;
  searchResults: Array<any>;
  property: Maybe<Property>;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  setSearchResults: React.Dispatch<React.SetStateAction<Array<any>>>;
}

export const AddPropertyContext = createContext<ContextProps | null>(null);

interface EditPropertyContainerProps {
  propertyId: string;
}

const EditPropertyContainer: React.FC<EditPropertyContainerProps> = ({ propertyId }) => {
  const [form] = Form.useForm();
  const router = useRouter();

  const [currentStep, setStep] = useState(0);
  const [searchResults, setSearchResults] = useState([]);
  const [forms, setForms] = useState<Array<FormInstance>>([form, form, form, form]);
  const [propertyAdded, showPropertyAdded] = useState(false);

  const [updateProperty, { loading, data, error }] = useUpdatePropertyMutation();

  const { data: property, loading: fetchingProperty } = useFetchPropertyQuery({
    variables: {
      id: propertyId,
    },
    fetchPolicy: 'network-only',
  });

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
      const formValues = newForms[0].getFieldsValue(true);

      const propertyDetails: PropertyDetails = {
        address: {
          unitNumber: parseInt(formValues.addressObject.unitNumber),
          streetNumber: parseInt(formValues.addressObject.streetNumberFrom),
          streetName: formValues.addressObject.streetName,
          streetType: formValues.addressObject.streetType,
          postcode: parseInt(formValues.addressObject.postcode),
          suburb: formValues.addressObject.suburb,
          state: formValues.addressObject.state,
        },
        bedrooms: parseInt(formValues.bedrooms),
        bathrooms: parseInt(formValues.bathrooms),
        carspaces: parseInt(formValues.carspaces),
      };

      let leaseDetails: LeaseDetails | null = null;

      if (formValues.leasePcm) {
        leaseDetails = {
          id: property?.fetchProperty?.lease?.id,
          startDate: formValues.leaseTerm[0].toISOString(),
          endDate: formValues.leaseTerm[1].toISOString(),
          rentPcm: parseInt(formValues.leasePcm),
        };
      }

      let tenants = [];

      if (formValues.tenants.length > 0) {
        tenants = formValues.tenants
          .filter((formValue: any) => formValue[0] === undefined)
          .flatMap((tenant) => {
            return {
              id: tenant.id,
              email: tenant.email,
              firstName: tenant.firstName,
              lastName: tenant.lastName,
              phoneNumber: tenant.phoneNumber,
            };
          });
      }

      const landlords = formValues.owners.map((landlord) => {
        return {
          id: landlord?.id,
          email: landlord.emailAddress,
          firstName: landlord.firstName,
          lastName: landlord.lastName,
          phoneNumber: landlord.phoneNumber,
        };
      });

      const photos = formValues.photos.map((photo, index) => {
        return {
          id: photo?.id,
          name: photo.name,
          type: photo.type,
          uri_path: photo?.response?.temp_path,
        };
      });

      console.log(photos);

      const files = formValues?.files?.map((file, index) => {
        return {
          id: file?.id,
          url: file.response.temp_path,
          name: file.name,
          type: file.type,
        };
      });

      try {
        await updateProperty({
          variables: {
            propertyId,
            propertyDetails,
            leaseDetails,
            tenants,
            landlords,
            photos,
            files: files ? files : [],
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
    router.push(`/properties/${data?.updateProperty?.id}`);
  }, [data]);

  const onClickReturnHome = useCallback(() => {
    router.push('/dashboard');
  }, []);

  console.log(forms);

  return (
    <DashboardContainer>
      <Breadcrumb separator="/" style={{ marginTop: '32px' }}>
        <Breadcrumb.Item href="">
          <HomeOutlined />
          <span>Properties</span>
        </Breadcrumb.Item>
        <Breadcrumb.Item href={`/properties/${property?.fetchProperty?.id}`}>
          <span>{property?.fetchProperty && renderAddressLabel(property?.fetchProperty?.address)}</span>
        </Breadcrumb.Item>
        <Breadcrumb.Item href="">
          <span>Edit Property</span>
        </Breadcrumb.Item>
      </Breadcrumb>

      <StyledCard>
        {!propertyAdded && (
          <>
            <Heading3 style={{ textAlign: 'center' }}>Edit Property</Heading3>

            <StyledSteps current={currentStep} type="navigation">
              <Step status={stepStatus(0)} title="Overview" />
              <Step status={stepStatus(1)} title="Lease" />
              <Step status={stepStatus(2)} title="Rental Providers" />
              <Step status={stepStatus(3)} title="Files" />
            </StyledSteps>

            <AddPropertyContext.Provider value={{ currentStep, setStep, searchResults, setSearchResults }}>
              <Form.Provider onFormFinish={onFormFinish}>
                {currentStep === 0 && <Overview form={forms[0]} isEditing propertyDetails={property?.fetchProperty} />}
                {currentStep === 1 && <Tenants form={forms[1]} propertyDetails={property?.fetchProperty} />}
                {currentStep === 2 && <Owners form={forms[2]} propertyDetails={property?.fetchProperty} />}
                {currentStep === 3 && <Files form={forms[3]} isUpdating propertyDetails={property?.fetchProperty} loading={loading} />}
              </Form.Provider>
            </AddPropertyContext.Provider>
          </>
        )}

        {propertyAdded && (
          <SuccessContainer>
            <Image src={greenTickIcon} layout="fixed" width={63} height={63} />
            <Heading1 style={{ marginTop: '2rem' }}>You're all done!</Heading1>
            <SuccessTextDescription>
              Your property has been successfully updated. You can now view your property or return to the home page.
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

export default EditPropertyContainer;
