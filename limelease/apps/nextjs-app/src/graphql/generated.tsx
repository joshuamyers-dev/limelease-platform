import { gql } from '@apollo/client';
import * as ApolloReactCommon from '@apollo/client';
import * as ApolloReactHooks from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Date: { input: any; output: any; }
  DateTime: { input: any; output: any; }
};

export type Address = {
  __typename?: 'Address';
  postcode: Scalars['Int']['output'];
  state: Scalars['String']['output'];
  streetName: Scalars['String']['output'];
  streetNumber: Scalars['Int']['output'];
  streetType: Scalars['String']['output'];
  suburb: Scalars['String']['output'];
  unitNumber?: Maybe<Scalars['Int']['output']>;
};

export type Agency = {
  __typename?: 'Agency';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type Contractor = {
  __typename?: 'Contractor';
  address?: Maybe<Address>;
  areasServed: Array<Maybe<Scalars['String']['output']>>;
  businessName: Scalars['String']['output'];
  contactEmail: Scalars['String']['output'];
  contactNumber: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  jobs?: Maybe<ContractorJobConnection>;
  websiteUrl?: Maybe<Scalars['String']['output']>;
};


export type ContractorJobsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  state?: InputMaybe<PropertyRequestFilter>;
};

export type ContractorConnection = {
  __typename?: 'ContractorConnection';
  edges?: Maybe<Array<Maybe<ContractorEdge>>>;
  pageInfo: PageInfo;
};

export type ContractorEdge = {
  __typename?: 'ContractorEdge';
  cursor?: Maybe<Scalars['String']['output']>;
  node?: Maybe<Contractor>;
};

export type ContractorJob = {
  __typename?: 'ContractorJob';
  bookingDateEnd?: Maybe<Scalars['DateTime']['output']>;
  bookingDateStart?: Maybe<Scalars['DateTime']['output']>;
  contractor?: Maybe<Contractor>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  request?: Maybe<PropertyRequest>;
  state: ContractorJobState;
};

export type ContractorJobConnection = {
  __typename?: 'ContractorJobConnection';
  edges?: Maybe<Array<Maybe<ContractorJobEdge>>>;
  pageInfo: PageInfo;
};

export type ContractorJobEdge = {
  __typename?: 'ContractorJobEdge';
  cursor?: Maybe<Scalars['String']['output']>;
  node?: Maybe<ContractorJob>;
};

export enum ContractorJobState {
  Archived = 'ARCHIVED',
  JobBooked = 'JOB_BOOKED',
  JobCancelled = 'JOB_CANCELLED',
  JobCompleted = 'JOB_COMPLETED',
  QuotedPriced = 'QUOTED_PRICED',
  QuoteBooked = 'QUOTE_BOOKED',
  Sent = 'SENT'
}

export type CreateAddress = {
  postcode: Scalars['Int']['input'];
  state: Scalars['String']['input'];
  streetName: Scalars['String']['input'];
  streetNumber: Scalars['Int']['input'];
  streetType: Scalars['String']['input'];
  suburb: Scalars['String']['input'];
  unitNumber?: InputMaybe<Scalars['Int']['input']>;
};

export type CreatePhoto = {
  id?: InputMaybe<Scalars['ID']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  uriPath?: InputMaybe<Scalars['String']['input']>;
};

export type File = {
  id?: InputMaybe<Scalars['ID']['input']>;
  name: Scalars['String']['input'];
  type: Scalars['String']['input'];
  url: Scalars['String']['input'];
};

export type Landlord = {
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  id?: InputMaybe<Scalars['ID']['input']>;
  lastName: Scalars['String']['input'];
  phoneNumber: Scalars['String']['input'];
};

export type Lease = {
  __typename?: 'Lease';
  endDate?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  isActive?: Maybe<Scalars['Boolean']['output']>;
  property: Property;
  rentPcm?: Maybe<Scalars['Float']['output']>;
  startDate?: Maybe<Scalars['DateTime']['output']>;
  tenants: Array<Maybe<Tenant>>;
};

export type LeaseDetails = {
  endDate: Scalars['DateTime']['input'];
  rentPcm: Scalars['Int']['input'];
  startDate: Scalars['DateTime']['input'];
};

export type PageInfo = {
  __typename?: 'PageInfo';
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars['String']['output']>;
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars['Boolean']['output'];
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars['Boolean']['output'];
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars['String']['output']>;
};

export type Property = {
  __typename?: 'Property';
  address: Address;
  bathrooms: Scalars['Int']['output'];
  bedrooms: Scalars['Int']['output'];
  carspaces: Scalars['Int']['output'];
  files?: Maybe<Array<Maybe<PropertyFile>>>;
  id: Scalars['ID']['output'];
  landlords: Array<PropertyLandlord>;
  lease?: Maybe<Lease>;
  notificationCount?: Maybe<PropertyNotificationCounts>;
  photos: Array<PropertyPhoto>;
  requests?: Maybe<Array<Maybe<PropertyRequest>>>;
  tenants?: Maybe<Array<Tenant>>;
};

export type PropertyConnection = {
  __typename?: 'PropertyConnection';
  edges?: Maybe<Array<Maybe<PropertyEdge>>>;
  pageInfo: PageInfo;
};

export type PropertyDetails = {
  address: CreateAddress;
  bathrooms: Scalars['Int']['input'];
  bedrooms: Scalars['Int']['input'];
  carspaces: Scalars['Int']['input'];
};

export type PropertyEdge = {
  __typename?: 'PropertyEdge';
  cursor?: Maybe<Scalars['String']['output']>;
  node?: Maybe<Property>;
};

export type PropertyFile = {
  __typename?: 'PropertyFile';
  fileName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
};

export enum PropertyFilter {
  All = 'ALL',
  Occupied = 'OCCUPIED',
  Vacant = 'VACANT'
}

export type PropertyLandlord = {
  __typename?: 'PropertyLandlord';
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastName: Scalars['String']['output'];
  phoneNumber: Scalars['String']['output'];
};

export type PropertyNotificationCounts = {
  __typename?: 'PropertyNotificationCounts';
  messagesCount: Scalars['Int']['output'];
  midHighCount: Scalars['Int']['output'];
  urgentCount: Scalars['Int']['output'];
};

export type PropertyPhoto = {
  __typename?: 'PropertyPhoto';
  id: Scalars['ID']['output'];
  order: Scalars['Int']['output'];
  staticMedia?: Maybe<StaticMedia>;
};

export type PropertyRequest = {
  __typename?: 'PropertyRequest';
  category: PropertyRequestCategory;
  comments?: Maybe<PropertyRequestCommentConnection>;
  details: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  insertedAt: Scalars['Date']['output'];
  photos?: Maybe<Array<Maybe<PropertyRequestPhoto>>>;
  property: Property;
  state: PropertyRequestState;
  tenant?: Maybe<Tenant>;
  ticketNumber: Scalars['String']['output'];
  title: Scalars['String']['output'];
  urgency: PropertyRequestUrgency;
};


export type PropertyRequestCommentsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};

export type PropertyRequestCategory = {
  __typename?: 'PropertyRequestCategory';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type PropertyRequestComment = {
  __typename?: 'PropertyRequestComment';
  authorName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  insertedAt: Scalars['DateTime']['output'];
  messageBody?: Maybe<Scalars['String']['output']>;
  systemGenerated?: Maybe<Scalars['Boolean']['output']>;
};

export type PropertyRequestCommentConnection = {
  __typename?: 'PropertyRequestCommentConnection';
  edges?: Maybe<Array<Maybe<PropertyRequestCommentEdge>>>;
  pageInfo: PageInfo;
};

export type PropertyRequestCommentEdge = {
  __typename?: 'PropertyRequestCommentEdge';
  cursor?: Maybe<Scalars['String']['output']>;
  node?: Maybe<PropertyRequestComment>;
};

export type PropertyRequestConnection = {
  __typename?: 'PropertyRequestConnection';
  edges?: Maybe<Array<Maybe<PropertyRequestEdge>>>;
  pageInfo: PageInfo;
};

export type PropertyRequestEdge = {
  __typename?: 'PropertyRequestEdge';
  cursor?: Maybe<Scalars['String']['output']>;
  node?: Maybe<PropertyRequest>;
};

export enum PropertyRequestFilter {
  All = 'ALL',
  Archived = 'ARCHIVED',
  Completed = 'COMPLETED',
  New = 'NEW'
}

export type PropertyRequestPhoto = {
  __typename?: 'PropertyRequestPhoto';
  staticMedia: StaticMedia;
};

export enum PropertyRequestState {
  AssignedToContractor = 'ASSIGNED_TO_CONTRACTOR',
  AwaitingResponse = 'AWAITING_RESPONSE',
  ContractorAppointmentBooked = 'CONTRACTOR_APPOINTMENT_BOOKED',
  Deleted = 'DELETED',
  Resolved = 'RESOLVED'
}

export enum PropertyRequestUrgency {
  Emergency = 'EMERGENCY',
  Low = 'LOW',
  MidHigh = 'MID_HIGH'
}

export type RootMutationType = {
  __typename?: 'RootMutationType';
  /** Assign a contractor to a property request. */
  contractorJobCreate: ContractorJob;
  /** Delete a contractor job. */
  contractorJobDelete: ContractorJob;
  /** Create a new contractor on behalf of your agency */
  createContractor: Contractor;
  /** Create a new property */
  createProperty: Property;
  /** Add a new comment to a property request. */
  propertyRequestCommentCreate?: Maybe<PropertyRequestComment>;
  /** Create a new property request. Expected errors: unauthorized */
  requestCreate: PropertyRequest;
  /** Update the state of multiple property requests. Expected errors: unauthorized */
  requestUpdateState: Scalars['Boolean']['output'];
  /** Update the urgency of a property request. Expected errors: unauthorized */
  requestUpdateUrgency: PropertyRequest;
  /** Create a new static media asset. */
  staticMediaCreate: StaticMedia;
  /** Update an existing property */
  updateProperty: Property;
  /** Login a user with email and password */
  userLogin: Session;
};


export type RootMutationTypeContractorJobCreateArgs = {
  bookingDateEnd: Scalars['DateTime']['input'];
  bookingDateStart: Scalars['DateTime']['input'];
  contractorId: Scalars['ID']['input'];
  contractorMessage: Scalars['String']['input'];
  description: Scalars['String']['input'];
  requestId: Scalars['ID']['input'];
};


export type RootMutationTypeContractorJobDeleteArgs = {
  id: Scalars['ID']['input'];
};


export type RootMutationTypeCreateContractorArgs = {
  address?: InputMaybe<CreateAddress>;
  areasServed: Array<InputMaybe<Scalars['String']['input']>>;
  businessName: Scalars['String']['input'];
  contactEmail: Scalars['String']['input'];
  contactNumber: Scalars['String']['input'];
  websiteUrl?: InputMaybe<Scalars['String']['input']>;
};


export type RootMutationTypeCreatePropertyArgs = {
  files?: InputMaybe<Array<InputMaybe<File>>>;
  landlords: Array<Landlord>;
  leaseDetails?: InputMaybe<LeaseDetails>;
  photos?: InputMaybe<Array<CreatePhoto>>;
  propertyDetails: PropertyDetails;
  tenants?: InputMaybe<Array<TenantObject>>;
};


export type RootMutationTypePropertyRequestCommentCreateArgs = {
  authorName: Scalars['String']['input'];
  messageBody: Scalars['String']['input'];
  requestId: Scalars['ID']['input'];
  systemGenerated?: InputMaybe<Scalars['Boolean']['input']>;
};


export type RootMutationTypeRequestCreateArgs = {
  categoryId: Scalars['ID']['input'];
  details: Scalars['String']['input'];
  photos?: InputMaybe<Array<InputMaybe<CreatePhoto>>>;
  propertyId: Scalars['ID']['input'];
  title: Scalars['String']['input'];
  urgency?: InputMaybe<PropertyRequestUrgency>;
};


export type RootMutationTypeRequestUpdateStateArgs = {
  requestIds: Array<Scalars['ID']['input']>;
  state: PropertyRequestState;
};


export type RootMutationTypeRequestUpdateUrgencyArgs = {
  requestId: Scalars['ID']['input'];
  urgency: PropertyRequestUrgency;
};


export type RootMutationTypeStaticMediaCreateArgs = {
  fileName?: InputMaybe<Scalars['String']['input']>;
  mimeType: Scalars['String']['input'];
  s3Key?: InputMaybe<Scalars['String']['input']>;
};


export type RootMutationTypeUpdatePropertyArgs = {
  files?: InputMaybe<Array<InputMaybe<File>>>;
  landlords: Array<Landlord>;
  leaseDetails?: InputMaybe<LeaseDetails>;
  photos?: InputMaybe<Array<CreatePhoto>>;
  propertyDetails: PropertyDetails;
  propertyId: Scalars['ID']['input'];
  tenants?: InputMaybe<Array<TenantObject>>;
};


export type RootMutationTypeUserLoginArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type RootQueryType = {
  __typename?: 'RootQueryType';
  /** Fetch the count of contractors a user is associated with. Expected Errors: unauthorized */
  contractorCount: Scalars['Int']['output'];
  /** Get the most recently assigned (active) job for a property request. */
  contractorJobActive?: Maybe<ContractorJob>;
  /** Fetch a single contractor. Expected Errors: not_found */
  fetchContractor: Contractor;
  /** Fetch a complete property listing. Expected errors: unauthorized, not_found */
  fetchProperty: Property;
  /** Fetch a complete property request. Expected errors: unauthorized, not_found */
  fetchRequest: PropertyRequest;
  /** Fetch a complete property request by ticket number. Expected errors: unauthorized, not_found */
  fetchRequestByTicketNumber: PropertyRequest;
  /** Get a paginated list of jobs for a contractor. */
  jobsForContractor?: Maybe<ContractorJobConnection>;
  /** Returns the current user's account */
  me?: Maybe<User>;
  /** Get a paginated list of contractors for your agency */
  myContractors?: Maybe<ContractorConnection>;
  /** Get a paginated list of properties. Expected errors: unauthorized. */
  myProperties?: Maybe<PropertyConnection>;
  /** Fetch all requests, filtered by a state. Expected errors: unauthorized */
  myRequests?: Maybe<PropertyRequestConnection>;
  /** Fetch a list of property request categories. */
  propertyRequestCategories?: Maybe<Array<Maybe<PropertyRequestCategory>>>;
  /** Fetch a paginated list of property request comments by ID */
  propertyRequestComments?: Maybe<PropertyRequestCommentConnection>;
  /** Fetch a count of property request comments by Request ID */
  propertyRequestCommentsCount: Scalars['Int']['output'];
  /** Fetch a paginated lists of requests for a particular property. Expected errors: unauthorized, not_found */
  requestsForProperty?: Maybe<PropertyRequestConnection>;
  /** Search for contractors by name */
  searchContractors?: Maybe<ContractorConnection>;
};


export type RootQueryTypeContractorJobActiveArgs = {
  requestId: Scalars['ID']['input'];
};


export type RootQueryTypeFetchContractorArgs = {
  contractorId: Scalars['ID']['input'];
};


export type RootQueryTypeFetchPropertyArgs = {
  id: Scalars['ID']['input'];
};


export type RootQueryTypeFetchRequestArgs = {
  id: Scalars['ID']['input'];
};


export type RootQueryTypeFetchRequestByTicketNumberArgs = {
  ticketNumber: Scalars['String']['input'];
};


export type RootQueryTypeJobsForContractorArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  contractorId: Scalars['ID']['input'];
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  state?: InputMaybe<PropertyRequestFilter>;
};


export type RootQueryTypeMyContractorsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  searchTerm?: InputMaybe<Scalars['String']['input']>;
};


export type RootQueryTypeMyPropertiesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<PropertyFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  searchKeywords?: InputMaybe<Scalars['String']['input']>;
};


export type RootQueryTypeMyRequestsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  state?: InputMaybe<PropertyRequestFilter>;
};


export type RootQueryTypePropertyRequestCommentsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  requestId: Scalars['ID']['input'];
};


export type RootQueryTypePropertyRequestCommentsCountArgs = {
  requestId: Scalars['ID']['input'];
};


export type RootQueryTypeRequestsForPropertyArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  propertyId: Scalars['ID']['input'];
  state?: InputMaybe<PropertyRequestFilter>;
};


export type RootQueryTypeSearchContractorsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  searchTerm: Scalars['String']['input'];
};

export type Session = {
  __typename?: 'Session';
  token: Scalars['String']['output'];
  user: User;
};

export type StaticMedia = {
  __typename?: 'StaticMedia';
  id: Scalars['ID']['output'];
  s3Key?: Maybe<Scalars['String']['output']>;
  uploadUrl?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type Tenant = {
  __typename?: 'Tenant';
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastName: Scalars['String']['output'];
  phoneNumber: Scalars['String']['output'];
};

export type TenantObject = {
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  id?: InputMaybe<Scalars['ID']['input']>;
  lastName: Scalars['String']['input'];
  phoneNumber: Scalars['String']['input'];
};

export type User = {
  __typename?: 'User';
  agency?: Maybe<Agency>;
  email: Scalars['String']['output'];
  firstName?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  lastName?: Maybe<Scalars['String']['output']>;
  password?: Maybe<Scalars['String']['output']>;
};

export type FetchContractorQueryVariables = Exact<{
  contractorId: Scalars['ID']['input'];
}>;


export type FetchContractorQuery = { __typename?: 'RootQueryType', fetchContractor: { __typename?: 'Contractor', id: string, businessName: string, websiteUrl?: string | null, contactEmail: string, contactNumber: string, areasServed: Array<string | null>, address?: { __typename?: 'Address', postcode: number, state: string, streetName: string, unitNumber?: number | null, streetNumber: number, streetType: string, suburb: string } | null } };

export type FetchContractorJobsQueryVariables = Exact<{
  contractorId: Scalars['ID']['input'];
  state?: InputMaybe<PropertyRequestFilter>;
  first: Scalars['Int']['input'];
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
}>;


export type FetchContractorJobsQuery = { __typename?: 'RootQueryType', jobsForContractor?: { __typename?: 'ContractorJobConnection', pageInfo: { __typename?: 'PageInfo', hasPreviousPage: boolean, hasNextPage: boolean, startCursor?: string | null, endCursor?: string | null }, edges?: Array<{ __typename?: 'ContractorJobEdge', node?: { __typename?: 'ContractorJob', id: string, state: ContractorJobState, description?: string | null, bookingDateStart?: any | null, bookingDateEnd?: any | null, request?: { __typename?: 'PropertyRequest', id: string, ticketNumber: string, state: PropertyRequestState, title: string, details: string, urgency: PropertyRequestUrgency, insertedAt: any, category: { __typename?: 'PropertyRequestCategory', id: string, name: string }, photos?: Array<{ __typename?: 'PropertyRequestPhoto', staticMedia: { __typename?: 'StaticMedia', url?: string | null } } | null> | null } | null, contractor?: { __typename?: 'Contractor', id: string, businessName: string, websiteUrl?: string | null, contactEmail: string, contactNumber: string, areasServed: Array<string | null>, address?: { __typename?: 'Address', postcode: number, state: string, streetName: string, unitNumber?: number | null, streetNumber: number, streetType: string, suburb: string } | null } | null } | null } | null> | null } | null };

export type CreateContractorMutationVariables = Exact<{
  address?: InputMaybe<CreateAddress>;
  areasServed: Array<InputMaybe<Scalars['String']['input']>> | InputMaybe<Scalars['String']['input']>;
  businessName: Scalars['String']['input'];
  contactEmail: Scalars['String']['input'];
  contactNumber: Scalars['String']['input'];
  websiteUrl?: InputMaybe<Scalars['String']['input']>;
}>;


export type CreateContractorMutation = { __typename?: 'RootMutationType', createContractor: { __typename?: 'Contractor', id: string, businessName: string, websiteUrl?: string | null, contactEmail: string, contactNumber: string, areasServed: Array<string | null>, address?: { __typename?: 'Address', postcode: number, state: string, streetName: string, unitNumber?: number | null, streetNumber: number, streetType: string, suburb: string } | null } };

export type CountContractorsQueryVariables = Exact<{ [key: string]: never; }>;


export type CountContractorsQuery = { __typename?: 'RootQueryType', contractorCount: number };

export type FetchContractorsQueryVariables = Exact<{
  first: Scalars['Int']['input'];
  after?: InputMaybe<Scalars['String']['input']>;
  searchTerm?: InputMaybe<Scalars['String']['input']>;
}>;


export type FetchContractorsQuery = { __typename?: 'RootQueryType', myContractors?: { __typename?: 'ContractorConnection', pageInfo: { __typename?: 'PageInfo', hasPreviousPage: boolean, hasNextPage: boolean, startCursor?: string | null, endCursor?: string | null }, edges?: Array<{ __typename?: 'ContractorEdge', node?: { __typename?: 'Contractor', id: string, businessName: string, websiteUrl?: string | null, contactEmail: string, contactNumber: string, areasServed: Array<string | null>, address?: { __typename?: 'Address', postcode: number, state: string, streetName: string, unitNumber?: number | null, streetNumber: number, streetType: string, suburb: string } | null } | null } | null> | null } | null };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'RootQueryType', me?: { __typename?: 'User', id: string, email: string, firstName?: string | null, lastName?: string | null, agency?: { __typename?: 'Agency', id: string, name: string } | null } | null };

export type UserLoginMutationVariables = Exact<{
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type UserLoginMutation = { __typename?: 'RootMutationType', userLogin: { __typename?: 'Session', token: string, user: { __typename?: 'User', id: string, email: string, firstName?: string | null, lastName?: string | null, agency?: { __typename?: 'Agency', id: string, name: string } | null } } };

export type CreatePropertyMutationVariables = Exact<{
  propertyDetails: PropertyDetails;
  leaseDetails?: InputMaybe<LeaseDetails>;
  files?: InputMaybe<Array<InputMaybe<File>> | InputMaybe<File>>;
  photos?: InputMaybe<Array<CreatePhoto> | CreatePhoto>;
  tenants?: InputMaybe<Array<TenantObject> | TenantObject>;
  landlords: Array<Landlord> | Landlord;
}>;


export type CreatePropertyMutation = { __typename?: 'RootMutationType', createProperty: { __typename?: 'Property', id: string, bathrooms: number, bedrooms: number, carspaces: number, address: { __typename?: 'Address', unitNumber?: number | null, streetName: string, streetType: string, streetNumber: number, suburb: string, postcode: number, state: string }, photos: Array<{ __typename?: 'PropertyPhoto', id: string, staticMedia?: { __typename?: 'StaticMedia', id: string, url?: string | null } | null }> } };

export type CreateStaticMediaMutationVariables = Exact<{
  s3Key?: InputMaybe<Scalars['String']['input']>;
  fileName?: InputMaybe<Scalars['String']['input']>;
  mimeType: Scalars['String']['input'];
}>;


export type CreateStaticMediaMutation = { __typename?: 'RootMutationType', staticMediaCreate: { __typename?: 'StaticMedia', id: string, s3Key?: string | null, uploadUrl?: string | null, url?: string | null } };

export type UpdatePropertyMutationVariables = Exact<{
  propertyId: Scalars['ID']['input'];
  propertyDetails: PropertyDetails;
  leaseDetails?: InputMaybe<LeaseDetails>;
  files?: InputMaybe<Array<InputMaybe<File>> | InputMaybe<File>>;
  photos?: InputMaybe<Array<CreatePhoto> | CreatePhoto>;
  tenants?: InputMaybe<Array<TenantObject> | TenantObject>;
  landlords: Array<Landlord> | Landlord;
}>;


export type UpdatePropertyMutation = { __typename?: 'RootMutationType', updateProperty: { __typename?: 'Property', id: string, bathrooms: number, bedrooms: number, carspaces: number, address: { __typename?: 'Address', unitNumber?: number | null, streetName: string, streetType: string, streetNumber: number, suburb: string, postcode: number, state: string }, photos: Array<{ __typename?: 'PropertyPhoto', id: string, staticMedia?: { __typename?: 'StaticMedia', id: string, url?: string | null } | null }> } };

export type FetchPropertyQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type FetchPropertyQuery = { __typename?: 'RootQueryType', fetchProperty: { __typename?: 'Property', id: string, bathrooms: number, bedrooms: number, carspaces: number, lease?: { __typename?: 'Lease', id: string, isActive?: boolean | null, startDate?: any | null, endDate?: any | null, rentPcm?: number | null } | null, tenants?: Array<{ __typename?: 'Tenant', id: string, email: string, firstName: string, lastName: string, phoneNumber: string }> | null, landlords: Array<{ __typename?: 'PropertyLandlord', id: string, email: string, firstName: string, lastName: string, phoneNumber: string }>, files?: Array<{ __typename?: 'PropertyFile', id: string, fileName: string } | null> | null, address: { __typename?: 'Address', unitNumber?: number | null, streetName: string, streetType: string, streetNumber: number, suburb: string, postcode: number, state: string }, photos: Array<{ __typename?: 'PropertyPhoto', id: string, staticMedia?: { __typename?: 'StaticMedia', id: string, url?: string | null } | null }> } };

export type FetchPropertyRequestsQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  propertyId: Scalars['ID']['input'];
  state?: InputMaybe<PropertyRequestFilter>;
}>;


export type FetchPropertyRequestsQuery = { __typename?: 'RootQueryType', requestsForProperty?: { __typename?: 'PropertyRequestConnection', pageInfo: { __typename?: 'PageInfo', hasPreviousPage: boolean, hasNextPage: boolean, startCursor?: string | null, endCursor?: string | null }, edges?: Array<{ __typename?: 'PropertyRequestEdge', node?: { __typename?: 'PropertyRequest', id: string, ticketNumber: string, state: PropertyRequestState, title: string, details: string, urgency: PropertyRequestUrgency, insertedAt: any, category: { __typename?: 'PropertyRequestCategory', id: string, name: string }, photos?: Array<{ __typename?: 'PropertyRequestPhoto', staticMedia: { __typename?: 'StaticMedia', url?: string | null } } | null> | null } | null } | null> | null } | null };

export type FetchPropertiesQueryVariables = Exact<{
  first: Scalars['Int']['input'];
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  filter?: InputMaybe<PropertyFilter>;
  searchKeywords?: InputMaybe<Scalars['String']['input']>;
}>;


export type FetchPropertiesQuery = { __typename?: 'RootQueryType', myProperties?: { __typename?: 'PropertyConnection', pageInfo: { __typename?: 'PageInfo', hasPreviousPage: boolean, hasNextPage: boolean, startCursor?: string | null, endCursor?: string | null }, edges?: Array<{ __typename?: 'PropertyEdge', cursor?: string | null, node?: { __typename?: 'Property', id: string, bathrooms: number, bedrooms: number, carspaces: number, notificationCount?: { __typename?: 'PropertyNotificationCounts', messagesCount: number, urgentCount: number, midHighCount: number } | null, address: { __typename?: 'Address', unitNumber?: number | null, streetName: string, streetType: string, streetNumber: number, suburb: string, postcode: number, state: string }, photos: Array<{ __typename?: 'PropertyPhoto', id: string, staticMedia?: { __typename?: 'StaticMedia', id: string, url?: string | null } | null }> } | null } | null> | null } | null };

export type AssignRequestToContractorMutationVariables = Exact<{
  contractorId: Scalars['ID']['input'];
  contractorMessage: Scalars['String']['input'];
  bookingDateStart: Scalars['DateTime']['input'];
  bookingDateEnd: Scalars['DateTime']['input'];
  description: Scalars['String']['input'];
  requestId: Scalars['ID']['input'];
}>;


export type AssignRequestToContractorMutation = { __typename?: 'RootMutationType', contractorJobCreate: { __typename?: 'ContractorJob', id: string, state: ContractorJobState, description?: string | null, bookingDateStart?: any | null, bookingDateEnd?: any | null, contractor?: { __typename?: 'Contractor', id: string, businessName: string, websiteUrl?: string | null, contactEmail: string, contactNumber: string, areasServed: Array<string | null>, address?: { __typename?: 'Address', postcode: number, state: string, streetName: string, unitNumber?: number | null, streetNumber: number, streetType: string, suburb: string } | null } | null } };

export type SearchContractorsByNameQueryVariables = Exact<{
  name: Scalars['String']['input'];
  first: Scalars['Int']['input'];
  after?: InputMaybe<Scalars['String']['input']>;
}>;


export type SearchContractorsByNameQuery = { __typename?: 'RootQueryType', searchContractors?: { __typename?: 'ContractorConnection', pageInfo: { __typename?: 'PageInfo', hasPreviousPage: boolean, hasNextPage: boolean, startCursor?: string | null, endCursor?: string | null }, edges?: Array<{ __typename?: 'ContractorEdge', node?: { __typename?: 'Contractor', id: string, businessName: string, websiteUrl?: string | null, contactEmail: string, contactNumber: string, areasServed: Array<string | null>, address?: { __typename?: 'Address', postcode: number, state: string, streetName: string, unitNumber?: number | null, streetNumber: number, streetType: string, suburb: string } | null } | null } | null> | null } | null };

export type CreateRequestMutationVariables = Exact<{
  propertyId: Scalars['ID']['input'];
  categoryId: Scalars['ID']['input'];
  title: Scalars['String']['input'];
  photos?: InputMaybe<Array<InputMaybe<CreatePhoto>> | InputMaybe<CreatePhoto>>;
  details: Scalars['String']['input'];
  urgency?: InputMaybe<PropertyRequestUrgency>;
}>;


export type CreateRequestMutation = { __typename?: 'RootMutationType', requestCreate: { __typename?: 'PropertyRequest', id: string, ticketNumber: string, state: PropertyRequestState, title: string, details: string, urgency: PropertyRequestUrgency, insertedAt: any, category: { __typename?: 'PropertyRequestCategory', id: string, name: string }, photos?: Array<{ __typename?: 'PropertyRequestPhoto', staticMedia: { __typename?: 'StaticMedia', url?: string | null } } | null> | null } };

export type FetchRequestCategoriesQueryVariables = Exact<{ [key: string]: never; }>;


export type FetchRequestCategoriesQuery = { __typename?: 'RootQueryType', propertyRequestCategories?: Array<{ __typename?: 'PropertyRequestCategory', id: string, name: string } | null> | null };

export type AddRequestCommentMutationVariables = Exact<{
  authorName: Scalars['String']['input'];
  messageBody: Scalars['String']['input'];
  requestId: Scalars['ID']['input'];
  systemGenerated?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type AddRequestCommentMutation = { __typename?: 'RootMutationType', propertyRequestCommentCreate?: { __typename?: 'PropertyRequestComment', id: string, messageBody?: string | null, systemGenerated?: boolean | null, authorName: string, insertedAt: any } | null };

export type CountRequestCommentsQueryVariables = Exact<{
  requestId: Scalars['ID']['input'];
}>;


export type CountRequestCommentsQuery = { __typename?: 'RootQueryType', propertyRequestCommentsCount: number };

export type DeleteContractorJobMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteContractorJobMutation = { __typename?: 'RootMutationType', contractorJobDelete: { __typename?: 'ContractorJob', id: string, state: ContractorJobState, description?: string | null, bookingDateStart?: any | null, bookingDateEnd?: any | null, contractor?: { __typename?: 'Contractor', id: string, businessName: string, websiteUrl?: string | null, contactEmail: string, contactNumber: string, areasServed: Array<string | null>, address?: { __typename?: 'Address', postcode: number, state: string, streetName: string, unitNumber?: number | null, streetNumber: number, streetType: string, suburb: string } | null } | null } };

export type FetchActiveJobForRequestQueryVariables = Exact<{
  requestId: Scalars['ID']['input'];
}>;


export type FetchActiveJobForRequestQuery = { __typename?: 'RootQueryType', contractorJobActive?: { __typename?: 'ContractorJob', id: string, state: ContractorJobState, description?: string | null, bookingDateStart?: any | null, bookingDateEnd?: any | null, contractor?: { __typename?: 'Contractor', id: string, businessName: string, websiteUrl?: string | null, contactEmail: string, contactNumber: string, areasServed: Array<string | null>, address?: { __typename?: 'Address', postcode: number, state: string, streetName: string, unitNumber?: number | null, streetNumber: number, streetType: string, suburb: string } | null } | null } | null };

export type FetchRequestQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type FetchRequestQuery = { __typename?: 'RootQueryType', fetchRequest: { __typename?: 'PropertyRequest', id: string, ticketNumber: string, state: PropertyRequestState, title: string, details: string, urgency: PropertyRequestUrgency, insertedAt: any, property: { __typename?: 'Property', id: string, bathrooms: number, bedrooms: number, carspaces: number, address: { __typename?: 'Address', unitNumber?: number | null, streetName: string, streetType: string, streetNumber: number, suburb: string, postcode: number, state: string }, photos: Array<{ __typename?: 'PropertyPhoto', id: string, staticMedia?: { __typename?: 'StaticMedia', id: string, url?: string | null } | null }> }, tenant?: { __typename?: 'Tenant', id: string, email: string, firstName: string, lastName: string, phoneNumber: string } | null, category: { __typename?: 'PropertyRequestCategory', id: string, name: string }, photos?: Array<{ __typename?: 'PropertyRequestPhoto', staticMedia: { __typename?: 'StaticMedia', url?: string | null } } | null> | null } };

export type FetchRequestByTicketNumberQueryVariables = Exact<{
  ticketNumber: Scalars['String']['input'];
}>;


export type FetchRequestByTicketNumberQuery = { __typename?: 'RootQueryType', fetchRequestByTicketNumber: { __typename?: 'PropertyRequest', id: string, ticketNumber: string, state: PropertyRequestState, title: string, details: string, urgency: PropertyRequestUrgency, insertedAt: any, property: { __typename?: 'Property', id: string, bathrooms: number, bedrooms: number, carspaces: number, address: { __typename?: 'Address', unitNumber?: number | null, streetName: string, streetType: string, streetNumber: number, suburb: string, postcode: number, state: string }, photos: Array<{ __typename?: 'PropertyPhoto', id: string, staticMedia?: { __typename?: 'StaticMedia', id: string, url?: string | null } | null }> }, tenant?: { __typename?: 'Tenant', id: string, email: string, firstName: string, lastName: string, phoneNumber: string } | null, category: { __typename?: 'PropertyRequestCategory', id: string, name: string }, photos?: Array<{ __typename?: 'PropertyRequestPhoto', staticMedia: { __typename?: 'StaticMedia', url?: string | null } } | null> | null } };

export type FetchRequestCommentsQueryVariables = Exact<{
  requestId: Scalars['ID']['input'];
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
}>;


export type FetchRequestCommentsQuery = { __typename?: 'RootQueryType', propertyRequestComments?: { __typename?: 'PropertyRequestCommentConnection', pageInfo: { __typename?: 'PageInfo', hasPreviousPage: boolean, hasNextPage: boolean, startCursor?: string | null, endCursor?: string | null }, edges?: Array<{ __typename?: 'PropertyRequestCommentEdge', node?: { __typename?: 'PropertyRequestComment', id: string, messageBody?: string | null, systemGenerated?: boolean | null, authorName: string, insertedAt: any } | null } | null> | null } | null };

export type UpdateRequestUrgencyMutationVariables = Exact<{
  requestId: Scalars['ID']['input'];
  urgency: PropertyRequestUrgency;
}>;


export type UpdateRequestUrgencyMutation = { __typename?: 'RootMutationType', requestUpdateUrgency: { __typename?: 'PropertyRequest', id: string, ticketNumber: string, state: PropertyRequestState, title: string, details: string, urgency: PropertyRequestUrgency, insertedAt: any, category: { __typename?: 'PropertyRequestCategory', id: string, name: string }, photos?: Array<{ __typename?: 'PropertyRequestPhoto', staticMedia: { __typename?: 'StaticMedia', url?: string | null } } | null> | null } };

export type FetchRequestsQueryVariables = Exact<{
  first: Scalars['Int']['input'];
  after?: InputMaybe<Scalars['String']['input']>;
  state?: InputMaybe<PropertyRequestFilter>;
}>;


export type FetchRequestsQuery = { __typename?: 'RootQueryType', myRequests?: { __typename?: 'PropertyRequestConnection', pageInfo: { __typename?: 'PageInfo', hasPreviousPage: boolean, hasNextPage: boolean, startCursor?: string | null, endCursor?: string | null }, edges?: Array<{ __typename?: 'PropertyRequestEdge', node?: { __typename?: 'PropertyRequest', id: string, ticketNumber: string, state: PropertyRequestState, title: string, details: string, urgency: PropertyRequestUrgency, insertedAt: any, property: { __typename?: 'Property', address: { __typename?: 'Address', postcode: number, state: string, streetName: string, unitNumber?: number | null, streetNumber: number, streetType: string, suburb: string } }, category: { __typename?: 'PropertyRequestCategory', id: string, name: string }, photos?: Array<{ __typename?: 'PropertyRequestPhoto', staticMedia: { __typename?: 'StaticMedia', url?: string | null } } | null> | null } | null } | null> | null } | null };

export type UpdateRequestStateMutationVariables = Exact<{
  requestIds: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
  state: PropertyRequestState;
}>;


export type UpdateRequestStateMutation = { __typename?: 'RootMutationType', requestUpdateState: boolean };

export type AgencyBaseFragment = { __typename?: 'Agency', id: string, name: string };

export type ContractorBaseFragment = { __typename?: 'Contractor', id: string, businessName: string, websiteUrl?: string | null, contactEmail: string, contactNumber: string, areasServed: Array<string | null>, address?: { __typename?: 'Address', postcode: number, state: string, streetName: string, unitNumber?: number | null, streetNumber: number, streetType: string, suburb: string } | null };

export type ContractorJobBaseFragment = { __typename?: 'ContractorJob', id: string, state: ContractorJobState, description?: string | null, bookingDateStart?: any | null, bookingDateEnd?: any | null, contractor?: { __typename?: 'Contractor', id: string, businessName: string, websiteUrl?: string | null, contactEmail: string, contactNumber: string, areasServed: Array<string | null>, address?: { __typename?: 'Address', postcode: number, state: string, streetName: string, unitNumber?: number | null, streetNumber: number, streetType: string, suburb: string } | null } | null };

export type FileBaseFragment = { __typename?: 'PropertyFile', id: string, fileName: string };

export type LandlordBaseFragment = { __typename?: 'PropertyLandlord', id: string, email: string, firstName: string, lastName: string, phoneNumber: string };

export type LeaseBaseFragment = { __typename?: 'Lease', id: string, isActive?: boolean | null, startDate?: any | null, endDate?: any | null, rentPcm?: number | null };

export type AddressBaseFragment = { __typename?: 'Address', postcode: number, state: string, streetName: string, unitNumber?: number | null, streetNumber: number, streetType: string, suburb: string };

export type PropertyBaseFragment = { __typename?: 'Property', id: string, bathrooms: number, bedrooms: number, carspaces: number, address: { __typename?: 'Address', unitNumber?: number | null, streetName: string, streetType: string, streetNumber: number, suburb: string, postcode: number, state: string }, photos: Array<{ __typename?: 'PropertyPhoto', id: string, staticMedia?: { __typename?: 'StaticMedia', id: string, url?: string | null } | null }> };

export type PropertyRequestCategoryBaseFragment = { __typename?: 'PropertyRequestCategory', id: string, name: string };

export type PropertyRequestCommentBaseFragment = { __typename?: 'PropertyRequestComment', id: string, messageBody?: string | null, systemGenerated?: boolean | null, authorName: string, insertedAt: any };

export type RequestBaseFragment = { __typename?: 'PropertyRequest', id: string, ticketNumber: string, state: PropertyRequestState, title: string, details: string, urgency: PropertyRequestUrgency, insertedAt: any, category: { __typename?: 'PropertyRequestCategory', id: string, name: string }, photos?: Array<{ __typename?: 'PropertyRequestPhoto', staticMedia: { __typename?: 'StaticMedia', url?: string | null } } | null> | null };

export type StaticMediaBaseFragment = { __typename?: 'StaticMedia', id: string, s3Key?: string | null, uploadUrl?: string | null, url?: string | null };

export type TenantBaseFragment = { __typename?: 'Tenant', id: string, email: string, firstName: string, lastName: string, phoneNumber: string };

export type UserBaseFragment = { __typename?: 'User', id: string, email: string, firstName?: string | null, lastName?: string | null, agency?: { __typename?: 'Agency', id: string, name: string } | null };

export const AddressBaseFragmentDoc = gql`
    fragment AddressBase on Address {
  postcode
  state
  streetName
  unitNumber
  streetNumber
  streetType
  suburb
}
    `;
export const ContractorBaseFragmentDoc = gql`
    fragment ContractorBase on Contractor {
  id
  businessName
  websiteUrl
  contactEmail
  contactNumber
  areasServed
  address {
    ...AddressBase
  }
}
    ${AddressBaseFragmentDoc}`;
export const ContractorJobBaseFragmentDoc = gql`
    fragment ContractorJobBase on ContractorJob {
  id
  state
  description
  bookingDateStart
  bookingDateEnd
  contractor {
    ...ContractorBase
  }
}
    ${ContractorBaseFragmentDoc}`;
export const FileBaseFragmentDoc = gql`
    fragment FileBase on PropertyFile {
  id
  fileName
}
    `;
export const LandlordBaseFragmentDoc = gql`
    fragment LandlordBase on PropertyLandlord {
  id
  email
  firstName
  lastName
  phoneNumber
}
    `;
export const LeaseBaseFragmentDoc = gql`
    fragment LeaseBase on Lease {
  id
  isActive
  startDate
  endDate
  rentPcm
}
    `;
export const PropertyBaseFragmentDoc = gql`
    fragment PropertyBase on Property {
  id
  address {
    unitNumber
    streetName
    streetType
    streetNumber
    suburb
    postcode
    state
  }
  bathrooms
  bedrooms
  carspaces
  photos {
    id
    staticMedia {
      id
      url
    }
  }
}
    `;
export const PropertyRequestCommentBaseFragmentDoc = gql`
    fragment PropertyRequestCommentBase on PropertyRequestComment {
  id
  messageBody
  systemGenerated
  authorName
  insertedAt
}
    `;
export const PropertyRequestCategoryBaseFragmentDoc = gql`
    fragment PropertyRequestCategoryBase on PropertyRequestCategory {
  id
  name
}
    `;
export const RequestBaseFragmentDoc = gql`
    fragment RequestBase on PropertyRequest {
  id
  ticketNumber
  category {
    ...PropertyRequestCategoryBase
  }
  state
  title
  details
  urgency
  insertedAt
  photos {
    staticMedia {
      url
    }
  }
}
    ${PropertyRequestCategoryBaseFragmentDoc}`;
export const StaticMediaBaseFragmentDoc = gql`
    fragment StaticMediaBase on StaticMedia {
  id
  s3Key
  uploadUrl
  url
}
    `;
export const TenantBaseFragmentDoc = gql`
    fragment TenantBase on Tenant {
  id
  email
  firstName
  lastName
  phoneNumber
}
    `;
export const AgencyBaseFragmentDoc = gql`
    fragment AgencyBase on Agency {
  id
  name
}
    `;
export const UserBaseFragmentDoc = gql`
    fragment UserBase on User {
  id
  email
  agency {
    ...AgencyBase
  }
  firstName
  lastName
}
    ${AgencyBaseFragmentDoc}`;
export const FetchContractorDocument = gql`
    query fetchContractor($contractorId: ID!) {
  fetchContractor(contractorId: $contractorId) {
    ...ContractorBase
  }
}
    ${ContractorBaseFragmentDoc}`;

/**
 * __useFetchContractorQuery__
 *
 * To run a query within a React component, call `useFetchContractorQuery` and pass it any options that fit your needs.
 * When your component renders, `useFetchContractorQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFetchContractorQuery({
 *   variables: {
 *      contractorId: // value for 'contractorId'
 *   },
 * });
 */
export function useFetchContractorQuery(baseOptions: ApolloReactHooks.QueryHookOptions<FetchContractorQuery, FetchContractorQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<FetchContractorQuery, FetchContractorQueryVariables>(FetchContractorDocument, options);
      }
export function useFetchContractorLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<FetchContractorQuery, FetchContractorQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<FetchContractorQuery, FetchContractorQueryVariables>(FetchContractorDocument, options);
        }
export function useFetchContractorSuspenseQuery(baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<FetchContractorQuery, FetchContractorQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<FetchContractorQuery, FetchContractorQueryVariables>(FetchContractorDocument, options);
        }
export type FetchContractorQueryHookResult = ReturnType<typeof useFetchContractorQuery>;
export type FetchContractorLazyQueryHookResult = ReturnType<typeof useFetchContractorLazyQuery>;
export type FetchContractorSuspenseQueryHookResult = ReturnType<typeof useFetchContractorSuspenseQuery>;
export type FetchContractorQueryResult = ApolloReactCommon.QueryResult<FetchContractorQuery, FetchContractorQueryVariables>;
export const FetchContractorJobsDocument = gql`
    query fetchContractorJobs($contractorId: ID!, $state: PropertyRequestFilter, $first: Int!, $after: String, $before: String, $last: Int) {
  jobsForContractor(
    contractorId: $contractorId
    state: $state
    first: $first
    after: $after
    before: $before
    last: $last
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    edges {
      node {
        ...ContractorJobBase
        request {
          ...RequestBase
        }
      }
    }
  }
}
    ${ContractorJobBaseFragmentDoc}
${RequestBaseFragmentDoc}`;

/**
 * __useFetchContractorJobsQuery__
 *
 * To run a query within a React component, call `useFetchContractorJobsQuery` and pass it any options that fit your needs.
 * When your component renders, `useFetchContractorJobsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFetchContractorJobsQuery({
 *   variables: {
 *      contractorId: // value for 'contractorId'
 *      state: // value for 'state'
 *      first: // value for 'first'
 *      after: // value for 'after'
 *      before: // value for 'before'
 *      last: // value for 'last'
 *   },
 * });
 */
export function useFetchContractorJobsQuery(baseOptions: ApolloReactHooks.QueryHookOptions<FetchContractorJobsQuery, FetchContractorJobsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<FetchContractorJobsQuery, FetchContractorJobsQueryVariables>(FetchContractorJobsDocument, options);
      }
export function useFetchContractorJobsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<FetchContractorJobsQuery, FetchContractorJobsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<FetchContractorJobsQuery, FetchContractorJobsQueryVariables>(FetchContractorJobsDocument, options);
        }
export function useFetchContractorJobsSuspenseQuery(baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<FetchContractorJobsQuery, FetchContractorJobsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<FetchContractorJobsQuery, FetchContractorJobsQueryVariables>(FetchContractorJobsDocument, options);
        }
export type FetchContractorJobsQueryHookResult = ReturnType<typeof useFetchContractorJobsQuery>;
export type FetchContractorJobsLazyQueryHookResult = ReturnType<typeof useFetchContractorJobsLazyQuery>;
export type FetchContractorJobsSuspenseQueryHookResult = ReturnType<typeof useFetchContractorJobsSuspenseQuery>;
export type FetchContractorJobsQueryResult = ApolloReactCommon.QueryResult<FetchContractorJobsQuery, FetchContractorJobsQueryVariables>;
export const CreateContractorDocument = gql`
    mutation createContractor($address: CreateAddress, $areasServed: [String]!, $businessName: String!, $contactEmail: String!, $contactNumber: String!, $websiteUrl: String) {
  createContractor(
    address: $address
    areasServed: $areasServed
    businessName: $businessName
    contactEmail: $contactEmail
    contactNumber: $contactNumber
    websiteUrl: $websiteUrl
  ) {
    ...ContractorBase
  }
}
    ${ContractorBaseFragmentDoc}`;
export type CreateContractorMutationFn = ApolloReactCommon.MutationFunction<CreateContractorMutation, CreateContractorMutationVariables>;

/**
 * __useCreateContractorMutation__
 *
 * To run a mutation, you first call `useCreateContractorMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateContractorMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createContractorMutation, { data, loading, error }] = useCreateContractorMutation({
 *   variables: {
 *      address: // value for 'address'
 *      areasServed: // value for 'areasServed'
 *      businessName: // value for 'businessName'
 *      contactEmail: // value for 'contactEmail'
 *      contactNumber: // value for 'contactNumber'
 *      websiteUrl: // value for 'websiteUrl'
 *   },
 * });
 */
export function useCreateContractorMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateContractorMutation, CreateContractorMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateContractorMutation, CreateContractorMutationVariables>(CreateContractorDocument, options);
      }
export type CreateContractorMutationHookResult = ReturnType<typeof useCreateContractorMutation>;
export type CreateContractorMutationResult = ApolloReactCommon.MutationResult<CreateContractorMutation>;
export type CreateContractorMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateContractorMutation, CreateContractorMutationVariables>;
export const CountContractorsDocument = gql`
    query countContractors {
  contractorCount
}
    `;

/**
 * __useCountContractorsQuery__
 *
 * To run a query within a React component, call `useCountContractorsQuery` and pass it any options that fit your needs.
 * When your component renders, `useCountContractorsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCountContractorsQuery({
 *   variables: {
 *   },
 * });
 */
export function useCountContractorsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<CountContractorsQuery, CountContractorsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<CountContractorsQuery, CountContractorsQueryVariables>(CountContractorsDocument, options);
      }
export function useCountContractorsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<CountContractorsQuery, CountContractorsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<CountContractorsQuery, CountContractorsQueryVariables>(CountContractorsDocument, options);
        }
export function useCountContractorsSuspenseQuery(baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<CountContractorsQuery, CountContractorsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<CountContractorsQuery, CountContractorsQueryVariables>(CountContractorsDocument, options);
        }
export type CountContractorsQueryHookResult = ReturnType<typeof useCountContractorsQuery>;
export type CountContractorsLazyQueryHookResult = ReturnType<typeof useCountContractorsLazyQuery>;
export type CountContractorsSuspenseQueryHookResult = ReturnType<typeof useCountContractorsSuspenseQuery>;
export type CountContractorsQueryResult = ApolloReactCommon.QueryResult<CountContractorsQuery, CountContractorsQueryVariables>;
export const FetchContractorsDocument = gql`
    query fetchContractors($first: Int!, $after: String, $searchTerm: String) {
  myContractors(first: $first, after: $after, searchTerm: $searchTerm) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    edges {
      node {
        ...ContractorBase
      }
    }
  }
}
    ${ContractorBaseFragmentDoc}`;

/**
 * __useFetchContractorsQuery__
 *
 * To run a query within a React component, call `useFetchContractorsQuery` and pass it any options that fit your needs.
 * When your component renders, `useFetchContractorsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFetchContractorsQuery({
 *   variables: {
 *      first: // value for 'first'
 *      after: // value for 'after'
 *      searchTerm: // value for 'searchTerm'
 *   },
 * });
 */
export function useFetchContractorsQuery(baseOptions: ApolloReactHooks.QueryHookOptions<FetchContractorsQuery, FetchContractorsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<FetchContractorsQuery, FetchContractorsQueryVariables>(FetchContractorsDocument, options);
      }
export function useFetchContractorsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<FetchContractorsQuery, FetchContractorsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<FetchContractorsQuery, FetchContractorsQueryVariables>(FetchContractorsDocument, options);
        }
export function useFetchContractorsSuspenseQuery(baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<FetchContractorsQuery, FetchContractorsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<FetchContractorsQuery, FetchContractorsQueryVariables>(FetchContractorsDocument, options);
        }
export type FetchContractorsQueryHookResult = ReturnType<typeof useFetchContractorsQuery>;
export type FetchContractorsLazyQueryHookResult = ReturnType<typeof useFetchContractorsLazyQuery>;
export type FetchContractorsSuspenseQueryHookResult = ReturnType<typeof useFetchContractorsSuspenseQuery>;
export type FetchContractorsQueryResult = ApolloReactCommon.QueryResult<FetchContractorsQuery, FetchContractorsQueryVariables>;
export const MeDocument = gql`
    query me {
  me {
    ...UserBase
  }
}
    ${UserBaseFragmentDoc}`;

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<MeQuery, MeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<MeQuery, MeQueryVariables>(MeDocument, options);
      }
export function useMeLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<MeQuery, MeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
export function useMeSuspenseQuery(baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<MeQuery, MeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeSuspenseQueryHookResult = ReturnType<typeof useMeSuspenseQuery>;
export type MeQueryResult = ApolloReactCommon.QueryResult<MeQuery, MeQueryVariables>;
export const UserLoginDocument = gql`
    mutation userLogin($email: String!, $password: String!) {
  userLogin(email: $email, password: $password) {
    token
    user {
      ...UserBase
    }
  }
}
    ${UserBaseFragmentDoc}`;
export type UserLoginMutationFn = ApolloReactCommon.MutationFunction<UserLoginMutation, UserLoginMutationVariables>;

/**
 * __useUserLoginMutation__
 *
 * To run a mutation, you first call `useUserLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUserLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [userLoginMutation, { data, loading, error }] = useUserLoginMutation({
 *   variables: {
 *      email: // value for 'email'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useUserLoginMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UserLoginMutation, UserLoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UserLoginMutation, UserLoginMutationVariables>(UserLoginDocument, options);
      }
export type UserLoginMutationHookResult = ReturnType<typeof useUserLoginMutation>;
export type UserLoginMutationResult = ApolloReactCommon.MutationResult<UserLoginMutation>;
export type UserLoginMutationOptions = ApolloReactCommon.BaseMutationOptions<UserLoginMutation, UserLoginMutationVariables>;
export const CreatePropertyDocument = gql`
    mutation createProperty($propertyDetails: PropertyDetails!, $leaseDetails: LeaseDetails, $files: [File], $photos: [CreatePhoto!], $tenants: [TenantObject!], $landlords: [Landlord!]!) {
  createProperty(
    propertyDetails: $propertyDetails
    leaseDetails: $leaseDetails
    files: $files
    photos: $photos
    tenants: $tenants
    landlords: $landlords
  ) {
    ...PropertyBase
  }
}
    ${PropertyBaseFragmentDoc}`;
export type CreatePropertyMutationFn = ApolloReactCommon.MutationFunction<CreatePropertyMutation, CreatePropertyMutationVariables>;

/**
 * __useCreatePropertyMutation__
 *
 * To run a mutation, you first call `useCreatePropertyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreatePropertyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createPropertyMutation, { data, loading, error }] = useCreatePropertyMutation({
 *   variables: {
 *      propertyDetails: // value for 'propertyDetails'
 *      leaseDetails: // value for 'leaseDetails'
 *      files: // value for 'files'
 *      photos: // value for 'photos'
 *      tenants: // value for 'tenants'
 *      landlords: // value for 'landlords'
 *   },
 * });
 */
export function useCreatePropertyMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreatePropertyMutation, CreatePropertyMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreatePropertyMutation, CreatePropertyMutationVariables>(CreatePropertyDocument, options);
      }
export type CreatePropertyMutationHookResult = ReturnType<typeof useCreatePropertyMutation>;
export type CreatePropertyMutationResult = ApolloReactCommon.MutationResult<CreatePropertyMutation>;
export type CreatePropertyMutationOptions = ApolloReactCommon.BaseMutationOptions<CreatePropertyMutation, CreatePropertyMutationVariables>;
export const CreateStaticMediaDocument = gql`
    mutation createStaticMedia($s3Key: String, $fileName: String, $mimeType: String!) {
  staticMediaCreate(s3Key: $s3Key, fileName: $fileName, mimeType: $mimeType) {
    ...StaticMediaBase
  }
}
    ${StaticMediaBaseFragmentDoc}`;
export type CreateStaticMediaMutationFn = ApolloReactCommon.MutationFunction<CreateStaticMediaMutation, CreateStaticMediaMutationVariables>;

/**
 * __useCreateStaticMediaMutation__
 *
 * To run a mutation, you first call `useCreateStaticMediaMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateStaticMediaMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createStaticMediaMutation, { data, loading, error }] = useCreateStaticMediaMutation({
 *   variables: {
 *      s3Key: // value for 's3Key'
 *      fileName: // value for 'fileName'
 *      mimeType: // value for 'mimeType'
 *   },
 * });
 */
export function useCreateStaticMediaMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateStaticMediaMutation, CreateStaticMediaMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateStaticMediaMutation, CreateStaticMediaMutationVariables>(CreateStaticMediaDocument, options);
      }
export type CreateStaticMediaMutationHookResult = ReturnType<typeof useCreateStaticMediaMutation>;
export type CreateStaticMediaMutationResult = ApolloReactCommon.MutationResult<CreateStaticMediaMutation>;
export type CreateStaticMediaMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateStaticMediaMutation, CreateStaticMediaMutationVariables>;
export const UpdatePropertyDocument = gql`
    mutation updateProperty($propertyId: ID!, $propertyDetails: PropertyDetails!, $leaseDetails: LeaseDetails, $files: [File], $photos: [CreatePhoto!], $tenants: [TenantObject!], $landlords: [Landlord!]!) {
  updateProperty(
    propertyId: $propertyId
    propertyDetails: $propertyDetails
    leaseDetails: $leaseDetails
    files: $files
    photos: $photos
    tenants: $tenants
    landlords: $landlords
  ) {
    ...PropertyBase
  }
}
    ${PropertyBaseFragmentDoc}`;
export type UpdatePropertyMutationFn = ApolloReactCommon.MutationFunction<UpdatePropertyMutation, UpdatePropertyMutationVariables>;

/**
 * __useUpdatePropertyMutation__
 *
 * To run a mutation, you first call `useUpdatePropertyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdatePropertyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updatePropertyMutation, { data, loading, error }] = useUpdatePropertyMutation({
 *   variables: {
 *      propertyId: // value for 'propertyId'
 *      propertyDetails: // value for 'propertyDetails'
 *      leaseDetails: // value for 'leaseDetails'
 *      files: // value for 'files'
 *      photos: // value for 'photos'
 *      tenants: // value for 'tenants'
 *      landlords: // value for 'landlords'
 *   },
 * });
 */
export function useUpdatePropertyMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdatePropertyMutation, UpdatePropertyMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpdatePropertyMutation, UpdatePropertyMutationVariables>(UpdatePropertyDocument, options);
      }
export type UpdatePropertyMutationHookResult = ReturnType<typeof useUpdatePropertyMutation>;
export type UpdatePropertyMutationResult = ApolloReactCommon.MutationResult<UpdatePropertyMutation>;
export type UpdatePropertyMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdatePropertyMutation, UpdatePropertyMutationVariables>;
export const FetchPropertyDocument = gql`
    query fetchProperty($id: ID!) {
  fetchProperty(id: $id) {
    ...PropertyBase
    lease {
      ...LeaseBase
    }
    tenants {
      ...TenantBase
    }
    landlords {
      ...LandlordBase
    }
    files {
      ...FileBase
    }
  }
}
    ${PropertyBaseFragmentDoc}
${LeaseBaseFragmentDoc}
${TenantBaseFragmentDoc}
${LandlordBaseFragmentDoc}
${FileBaseFragmentDoc}`;

/**
 * __useFetchPropertyQuery__
 *
 * To run a query within a React component, call `useFetchPropertyQuery` and pass it any options that fit your needs.
 * When your component renders, `useFetchPropertyQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFetchPropertyQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useFetchPropertyQuery(baseOptions: ApolloReactHooks.QueryHookOptions<FetchPropertyQuery, FetchPropertyQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<FetchPropertyQuery, FetchPropertyQueryVariables>(FetchPropertyDocument, options);
      }
export function useFetchPropertyLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<FetchPropertyQuery, FetchPropertyQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<FetchPropertyQuery, FetchPropertyQueryVariables>(FetchPropertyDocument, options);
        }
export function useFetchPropertySuspenseQuery(baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<FetchPropertyQuery, FetchPropertyQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<FetchPropertyQuery, FetchPropertyQueryVariables>(FetchPropertyDocument, options);
        }
export type FetchPropertyQueryHookResult = ReturnType<typeof useFetchPropertyQuery>;
export type FetchPropertyLazyQueryHookResult = ReturnType<typeof useFetchPropertyLazyQuery>;
export type FetchPropertySuspenseQueryHookResult = ReturnType<typeof useFetchPropertySuspenseQuery>;
export type FetchPropertyQueryResult = ApolloReactCommon.QueryResult<FetchPropertyQuery, FetchPropertyQueryVariables>;
export const FetchPropertyRequestsDocument = gql`
    query fetchPropertyRequests($first: Int, $after: String, $propertyId: ID!, $state: PropertyRequestFilter) {
  requestsForProperty(
    first: $first
    after: $after
    propertyId: $propertyId
    state: $state
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    edges {
      node {
        ...RequestBase
      }
    }
  }
}
    ${RequestBaseFragmentDoc}`;

/**
 * __useFetchPropertyRequestsQuery__
 *
 * To run a query within a React component, call `useFetchPropertyRequestsQuery` and pass it any options that fit your needs.
 * When your component renders, `useFetchPropertyRequestsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFetchPropertyRequestsQuery({
 *   variables: {
 *      first: // value for 'first'
 *      after: // value for 'after'
 *      propertyId: // value for 'propertyId'
 *      state: // value for 'state'
 *   },
 * });
 */
export function useFetchPropertyRequestsQuery(baseOptions: ApolloReactHooks.QueryHookOptions<FetchPropertyRequestsQuery, FetchPropertyRequestsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<FetchPropertyRequestsQuery, FetchPropertyRequestsQueryVariables>(FetchPropertyRequestsDocument, options);
      }
export function useFetchPropertyRequestsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<FetchPropertyRequestsQuery, FetchPropertyRequestsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<FetchPropertyRequestsQuery, FetchPropertyRequestsQueryVariables>(FetchPropertyRequestsDocument, options);
        }
export function useFetchPropertyRequestsSuspenseQuery(baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<FetchPropertyRequestsQuery, FetchPropertyRequestsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<FetchPropertyRequestsQuery, FetchPropertyRequestsQueryVariables>(FetchPropertyRequestsDocument, options);
        }
export type FetchPropertyRequestsQueryHookResult = ReturnType<typeof useFetchPropertyRequestsQuery>;
export type FetchPropertyRequestsLazyQueryHookResult = ReturnType<typeof useFetchPropertyRequestsLazyQuery>;
export type FetchPropertyRequestsSuspenseQueryHookResult = ReturnType<typeof useFetchPropertyRequestsSuspenseQuery>;
export type FetchPropertyRequestsQueryResult = ApolloReactCommon.QueryResult<FetchPropertyRequestsQuery, FetchPropertyRequestsQueryVariables>;
export const FetchPropertiesDocument = gql`
    query fetchProperties($first: Int!, $after: String, $before: String, $last: Int, $filter: PropertyFilter, $searchKeywords: String) {
  myProperties(
    first: $first
    after: $after
    before: $before
    last: $last
    filter: $filter
    searchKeywords: $searchKeywords
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    edges {
      cursor
      node {
        ...PropertyBase
        notificationCount {
          messagesCount
          urgentCount
          midHighCount
        }
      }
    }
  }
}
    ${PropertyBaseFragmentDoc}`;

/**
 * __useFetchPropertiesQuery__
 *
 * To run a query within a React component, call `useFetchPropertiesQuery` and pass it any options that fit your needs.
 * When your component renders, `useFetchPropertiesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFetchPropertiesQuery({
 *   variables: {
 *      first: // value for 'first'
 *      after: // value for 'after'
 *      before: // value for 'before'
 *      last: // value for 'last'
 *      filter: // value for 'filter'
 *      searchKeywords: // value for 'searchKeywords'
 *   },
 * });
 */
export function useFetchPropertiesQuery(baseOptions: ApolloReactHooks.QueryHookOptions<FetchPropertiesQuery, FetchPropertiesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<FetchPropertiesQuery, FetchPropertiesQueryVariables>(FetchPropertiesDocument, options);
      }
export function useFetchPropertiesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<FetchPropertiesQuery, FetchPropertiesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<FetchPropertiesQuery, FetchPropertiesQueryVariables>(FetchPropertiesDocument, options);
        }
export function useFetchPropertiesSuspenseQuery(baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<FetchPropertiesQuery, FetchPropertiesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<FetchPropertiesQuery, FetchPropertiesQueryVariables>(FetchPropertiesDocument, options);
        }
export type FetchPropertiesQueryHookResult = ReturnType<typeof useFetchPropertiesQuery>;
export type FetchPropertiesLazyQueryHookResult = ReturnType<typeof useFetchPropertiesLazyQuery>;
export type FetchPropertiesSuspenseQueryHookResult = ReturnType<typeof useFetchPropertiesSuspenseQuery>;
export type FetchPropertiesQueryResult = ApolloReactCommon.QueryResult<FetchPropertiesQuery, FetchPropertiesQueryVariables>;
export const AssignRequestToContractorDocument = gql`
    mutation assignRequestToContractor($contractorId: ID!, $contractorMessage: String!, $bookingDateStart: DateTime!, $bookingDateEnd: DateTime!, $description: String!, $requestId: ID!) {
  contractorJobCreate(
    requestId: $requestId
    contractorId: $contractorId
    bookingDateStart: $bookingDateStart
    bookingDateEnd: $bookingDateEnd
    contractorMessage: $contractorMessage
    description: $description
  ) {
    ...ContractorJobBase
  }
}
    ${ContractorJobBaseFragmentDoc}`;
export type AssignRequestToContractorMutationFn = ApolloReactCommon.MutationFunction<AssignRequestToContractorMutation, AssignRequestToContractorMutationVariables>;

/**
 * __useAssignRequestToContractorMutation__
 *
 * To run a mutation, you first call `useAssignRequestToContractorMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAssignRequestToContractorMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [assignRequestToContractorMutation, { data, loading, error }] = useAssignRequestToContractorMutation({
 *   variables: {
 *      contractorId: // value for 'contractorId'
 *      contractorMessage: // value for 'contractorMessage'
 *      bookingDateStart: // value for 'bookingDateStart'
 *      bookingDateEnd: // value for 'bookingDateEnd'
 *      description: // value for 'description'
 *      requestId: // value for 'requestId'
 *   },
 * });
 */
export function useAssignRequestToContractorMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<AssignRequestToContractorMutation, AssignRequestToContractorMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<AssignRequestToContractorMutation, AssignRequestToContractorMutationVariables>(AssignRequestToContractorDocument, options);
      }
export type AssignRequestToContractorMutationHookResult = ReturnType<typeof useAssignRequestToContractorMutation>;
export type AssignRequestToContractorMutationResult = ApolloReactCommon.MutationResult<AssignRequestToContractorMutation>;
export type AssignRequestToContractorMutationOptions = ApolloReactCommon.BaseMutationOptions<AssignRequestToContractorMutation, AssignRequestToContractorMutationVariables>;
export const SearchContractorsByNameDocument = gql`
    query searchContractorsByName($name: String!, $first: Int!, $after: String) {
  searchContractors(first: $first, after: $after, searchTerm: $name) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    edges {
      node {
        ...ContractorBase
      }
    }
  }
}
    ${ContractorBaseFragmentDoc}`;

/**
 * __useSearchContractorsByNameQuery__
 *
 * To run a query within a React component, call `useSearchContractorsByNameQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchContractorsByNameQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchContractorsByNameQuery({
 *   variables: {
 *      name: // value for 'name'
 *      first: // value for 'first'
 *      after: // value for 'after'
 *   },
 * });
 */
export function useSearchContractorsByNameQuery(baseOptions: ApolloReactHooks.QueryHookOptions<SearchContractorsByNameQuery, SearchContractorsByNameQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<SearchContractorsByNameQuery, SearchContractorsByNameQueryVariables>(SearchContractorsByNameDocument, options);
      }
export function useSearchContractorsByNameLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<SearchContractorsByNameQuery, SearchContractorsByNameQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<SearchContractorsByNameQuery, SearchContractorsByNameQueryVariables>(SearchContractorsByNameDocument, options);
        }
export function useSearchContractorsByNameSuspenseQuery(baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<SearchContractorsByNameQuery, SearchContractorsByNameQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<SearchContractorsByNameQuery, SearchContractorsByNameQueryVariables>(SearchContractorsByNameDocument, options);
        }
export type SearchContractorsByNameQueryHookResult = ReturnType<typeof useSearchContractorsByNameQuery>;
export type SearchContractorsByNameLazyQueryHookResult = ReturnType<typeof useSearchContractorsByNameLazyQuery>;
export type SearchContractorsByNameSuspenseQueryHookResult = ReturnType<typeof useSearchContractorsByNameSuspenseQuery>;
export type SearchContractorsByNameQueryResult = ApolloReactCommon.QueryResult<SearchContractorsByNameQuery, SearchContractorsByNameQueryVariables>;
export const CreateRequestDocument = gql`
    mutation createRequest($propertyId: ID!, $categoryId: ID!, $title: String!, $photos: [CreatePhoto], $details: String!, $urgency: PropertyRequestUrgency) {
  requestCreate(
    propertyId: $propertyId
    categoryId: $categoryId
    title: $title
    details: $details
    photos: $photos
    urgency: $urgency
  ) {
    ...RequestBase
  }
}
    ${RequestBaseFragmentDoc}`;
export type CreateRequestMutationFn = ApolloReactCommon.MutationFunction<CreateRequestMutation, CreateRequestMutationVariables>;

/**
 * __useCreateRequestMutation__
 *
 * To run a mutation, you first call `useCreateRequestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateRequestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createRequestMutation, { data, loading, error }] = useCreateRequestMutation({
 *   variables: {
 *      propertyId: // value for 'propertyId'
 *      categoryId: // value for 'categoryId'
 *      title: // value for 'title'
 *      photos: // value for 'photos'
 *      details: // value for 'details'
 *      urgency: // value for 'urgency'
 *   },
 * });
 */
export function useCreateRequestMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateRequestMutation, CreateRequestMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateRequestMutation, CreateRequestMutationVariables>(CreateRequestDocument, options);
      }
export type CreateRequestMutationHookResult = ReturnType<typeof useCreateRequestMutation>;
export type CreateRequestMutationResult = ApolloReactCommon.MutationResult<CreateRequestMutation>;
export type CreateRequestMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateRequestMutation, CreateRequestMutationVariables>;
export const FetchRequestCategoriesDocument = gql`
    query fetchRequestCategories {
  propertyRequestCategories {
    ...PropertyRequestCategoryBase
  }
}
    ${PropertyRequestCategoryBaseFragmentDoc}`;

/**
 * __useFetchRequestCategoriesQuery__
 *
 * To run a query within a React component, call `useFetchRequestCategoriesQuery` and pass it any options that fit your needs.
 * When your component renders, `useFetchRequestCategoriesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFetchRequestCategoriesQuery({
 *   variables: {
 *   },
 * });
 */
export function useFetchRequestCategoriesQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<FetchRequestCategoriesQuery, FetchRequestCategoriesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<FetchRequestCategoriesQuery, FetchRequestCategoriesQueryVariables>(FetchRequestCategoriesDocument, options);
      }
export function useFetchRequestCategoriesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<FetchRequestCategoriesQuery, FetchRequestCategoriesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<FetchRequestCategoriesQuery, FetchRequestCategoriesQueryVariables>(FetchRequestCategoriesDocument, options);
        }
export function useFetchRequestCategoriesSuspenseQuery(baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<FetchRequestCategoriesQuery, FetchRequestCategoriesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<FetchRequestCategoriesQuery, FetchRequestCategoriesQueryVariables>(FetchRequestCategoriesDocument, options);
        }
export type FetchRequestCategoriesQueryHookResult = ReturnType<typeof useFetchRequestCategoriesQuery>;
export type FetchRequestCategoriesLazyQueryHookResult = ReturnType<typeof useFetchRequestCategoriesLazyQuery>;
export type FetchRequestCategoriesSuspenseQueryHookResult = ReturnType<typeof useFetchRequestCategoriesSuspenseQuery>;
export type FetchRequestCategoriesQueryResult = ApolloReactCommon.QueryResult<FetchRequestCategoriesQuery, FetchRequestCategoriesQueryVariables>;
export const AddRequestCommentDocument = gql`
    mutation addRequestComment($authorName: String!, $messageBody: String!, $requestId: ID!, $systemGenerated: Boolean) {
  propertyRequestCommentCreate(
    requestId: $requestId
    authorName: $authorName
    messageBody: $messageBody
    systemGenerated: $systemGenerated
  ) {
    ...PropertyRequestCommentBase
  }
}
    ${PropertyRequestCommentBaseFragmentDoc}`;
export type AddRequestCommentMutationFn = ApolloReactCommon.MutationFunction<AddRequestCommentMutation, AddRequestCommentMutationVariables>;

/**
 * __useAddRequestCommentMutation__
 *
 * To run a mutation, you first call `useAddRequestCommentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddRequestCommentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addRequestCommentMutation, { data, loading, error }] = useAddRequestCommentMutation({
 *   variables: {
 *      authorName: // value for 'authorName'
 *      messageBody: // value for 'messageBody'
 *      requestId: // value for 'requestId'
 *      systemGenerated: // value for 'systemGenerated'
 *   },
 * });
 */
export function useAddRequestCommentMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<AddRequestCommentMutation, AddRequestCommentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<AddRequestCommentMutation, AddRequestCommentMutationVariables>(AddRequestCommentDocument, options);
      }
export type AddRequestCommentMutationHookResult = ReturnType<typeof useAddRequestCommentMutation>;
export type AddRequestCommentMutationResult = ApolloReactCommon.MutationResult<AddRequestCommentMutation>;
export type AddRequestCommentMutationOptions = ApolloReactCommon.BaseMutationOptions<AddRequestCommentMutation, AddRequestCommentMutationVariables>;
export const CountRequestCommentsDocument = gql`
    query countRequestComments($requestId: ID!) {
  propertyRequestCommentsCount(requestId: $requestId)
}
    `;

/**
 * __useCountRequestCommentsQuery__
 *
 * To run a query within a React component, call `useCountRequestCommentsQuery` and pass it any options that fit your needs.
 * When your component renders, `useCountRequestCommentsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCountRequestCommentsQuery({
 *   variables: {
 *      requestId: // value for 'requestId'
 *   },
 * });
 */
export function useCountRequestCommentsQuery(baseOptions: ApolloReactHooks.QueryHookOptions<CountRequestCommentsQuery, CountRequestCommentsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<CountRequestCommentsQuery, CountRequestCommentsQueryVariables>(CountRequestCommentsDocument, options);
      }
export function useCountRequestCommentsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<CountRequestCommentsQuery, CountRequestCommentsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<CountRequestCommentsQuery, CountRequestCommentsQueryVariables>(CountRequestCommentsDocument, options);
        }
export function useCountRequestCommentsSuspenseQuery(baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<CountRequestCommentsQuery, CountRequestCommentsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<CountRequestCommentsQuery, CountRequestCommentsQueryVariables>(CountRequestCommentsDocument, options);
        }
export type CountRequestCommentsQueryHookResult = ReturnType<typeof useCountRequestCommentsQuery>;
export type CountRequestCommentsLazyQueryHookResult = ReturnType<typeof useCountRequestCommentsLazyQuery>;
export type CountRequestCommentsSuspenseQueryHookResult = ReturnType<typeof useCountRequestCommentsSuspenseQuery>;
export type CountRequestCommentsQueryResult = ApolloReactCommon.QueryResult<CountRequestCommentsQuery, CountRequestCommentsQueryVariables>;
export const DeleteContractorJobDocument = gql`
    mutation deleteContractorJob($id: ID!) {
  contractorJobDelete(id: $id) {
    ...ContractorJobBase
  }
}
    ${ContractorJobBaseFragmentDoc}`;
export type DeleteContractorJobMutationFn = ApolloReactCommon.MutationFunction<DeleteContractorJobMutation, DeleteContractorJobMutationVariables>;

/**
 * __useDeleteContractorJobMutation__
 *
 * To run a mutation, you first call `useDeleteContractorJobMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteContractorJobMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteContractorJobMutation, { data, loading, error }] = useDeleteContractorJobMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteContractorJobMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteContractorJobMutation, DeleteContractorJobMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<DeleteContractorJobMutation, DeleteContractorJobMutationVariables>(DeleteContractorJobDocument, options);
      }
export type DeleteContractorJobMutationHookResult = ReturnType<typeof useDeleteContractorJobMutation>;
export type DeleteContractorJobMutationResult = ApolloReactCommon.MutationResult<DeleteContractorJobMutation>;
export type DeleteContractorJobMutationOptions = ApolloReactCommon.BaseMutationOptions<DeleteContractorJobMutation, DeleteContractorJobMutationVariables>;
export const FetchActiveJobForRequestDocument = gql`
    query fetchActiveJobForRequest($requestId: ID!) {
  contractorJobActive(requestId: $requestId) {
    ...ContractorJobBase
  }
}
    ${ContractorJobBaseFragmentDoc}`;

/**
 * __useFetchActiveJobForRequestQuery__
 *
 * To run a query within a React component, call `useFetchActiveJobForRequestQuery` and pass it any options that fit your needs.
 * When your component renders, `useFetchActiveJobForRequestQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFetchActiveJobForRequestQuery({
 *   variables: {
 *      requestId: // value for 'requestId'
 *   },
 * });
 */
export function useFetchActiveJobForRequestQuery(baseOptions: ApolloReactHooks.QueryHookOptions<FetchActiveJobForRequestQuery, FetchActiveJobForRequestQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<FetchActiveJobForRequestQuery, FetchActiveJobForRequestQueryVariables>(FetchActiveJobForRequestDocument, options);
      }
export function useFetchActiveJobForRequestLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<FetchActiveJobForRequestQuery, FetchActiveJobForRequestQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<FetchActiveJobForRequestQuery, FetchActiveJobForRequestQueryVariables>(FetchActiveJobForRequestDocument, options);
        }
export function useFetchActiveJobForRequestSuspenseQuery(baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<FetchActiveJobForRequestQuery, FetchActiveJobForRequestQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<FetchActiveJobForRequestQuery, FetchActiveJobForRequestQueryVariables>(FetchActiveJobForRequestDocument, options);
        }
export type FetchActiveJobForRequestQueryHookResult = ReturnType<typeof useFetchActiveJobForRequestQuery>;
export type FetchActiveJobForRequestLazyQueryHookResult = ReturnType<typeof useFetchActiveJobForRequestLazyQuery>;
export type FetchActiveJobForRequestSuspenseQueryHookResult = ReturnType<typeof useFetchActiveJobForRequestSuspenseQuery>;
export type FetchActiveJobForRequestQueryResult = ApolloReactCommon.QueryResult<FetchActiveJobForRequestQuery, FetchActiveJobForRequestQueryVariables>;
export const FetchRequestDocument = gql`
    query fetchRequest($id: ID!) {
  fetchRequest(id: $id) {
    ...RequestBase
    property {
      ...PropertyBase
    }
    tenant {
      ...TenantBase
    }
  }
}
    ${RequestBaseFragmentDoc}
${PropertyBaseFragmentDoc}
${TenantBaseFragmentDoc}`;

/**
 * __useFetchRequestQuery__
 *
 * To run a query within a React component, call `useFetchRequestQuery` and pass it any options that fit your needs.
 * When your component renders, `useFetchRequestQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFetchRequestQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useFetchRequestQuery(baseOptions: ApolloReactHooks.QueryHookOptions<FetchRequestQuery, FetchRequestQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<FetchRequestQuery, FetchRequestQueryVariables>(FetchRequestDocument, options);
      }
export function useFetchRequestLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<FetchRequestQuery, FetchRequestQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<FetchRequestQuery, FetchRequestQueryVariables>(FetchRequestDocument, options);
        }
export function useFetchRequestSuspenseQuery(baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<FetchRequestQuery, FetchRequestQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<FetchRequestQuery, FetchRequestQueryVariables>(FetchRequestDocument, options);
        }
export type FetchRequestQueryHookResult = ReturnType<typeof useFetchRequestQuery>;
export type FetchRequestLazyQueryHookResult = ReturnType<typeof useFetchRequestLazyQuery>;
export type FetchRequestSuspenseQueryHookResult = ReturnType<typeof useFetchRequestSuspenseQuery>;
export type FetchRequestQueryResult = ApolloReactCommon.QueryResult<FetchRequestQuery, FetchRequestQueryVariables>;
export const FetchRequestByTicketNumberDocument = gql`
    query fetchRequestByTicketNumber($ticketNumber: String!) {
  fetchRequestByTicketNumber(ticketNumber: $ticketNumber) {
    ...RequestBase
    property {
      ...PropertyBase
    }
    tenant {
      ...TenantBase
    }
  }
}
    ${RequestBaseFragmentDoc}
${PropertyBaseFragmentDoc}
${TenantBaseFragmentDoc}`;

/**
 * __useFetchRequestByTicketNumberQuery__
 *
 * To run a query within a React component, call `useFetchRequestByTicketNumberQuery` and pass it any options that fit your needs.
 * When your component renders, `useFetchRequestByTicketNumberQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFetchRequestByTicketNumberQuery({
 *   variables: {
 *      ticketNumber: // value for 'ticketNumber'
 *   },
 * });
 */
export function useFetchRequestByTicketNumberQuery(baseOptions: ApolloReactHooks.QueryHookOptions<FetchRequestByTicketNumberQuery, FetchRequestByTicketNumberQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<FetchRequestByTicketNumberQuery, FetchRequestByTicketNumberQueryVariables>(FetchRequestByTicketNumberDocument, options);
      }
export function useFetchRequestByTicketNumberLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<FetchRequestByTicketNumberQuery, FetchRequestByTicketNumberQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<FetchRequestByTicketNumberQuery, FetchRequestByTicketNumberQueryVariables>(FetchRequestByTicketNumberDocument, options);
        }
export function useFetchRequestByTicketNumberSuspenseQuery(baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<FetchRequestByTicketNumberQuery, FetchRequestByTicketNumberQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<FetchRequestByTicketNumberQuery, FetchRequestByTicketNumberQueryVariables>(FetchRequestByTicketNumberDocument, options);
        }
export type FetchRequestByTicketNumberQueryHookResult = ReturnType<typeof useFetchRequestByTicketNumberQuery>;
export type FetchRequestByTicketNumberLazyQueryHookResult = ReturnType<typeof useFetchRequestByTicketNumberLazyQuery>;
export type FetchRequestByTicketNumberSuspenseQueryHookResult = ReturnType<typeof useFetchRequestByTicketNumberSuspenseQuery>;
export type FetchRequestByTicketNumberQueryResult = ApolloReactCommon.QueryResult<FetchRequestByTicketNumberQuery, FetchRequestByTicketNumberQueryVariables>;
export const FetchRequestCommentsDocument = gql`
    query fetchRequestComments($requestId: ID!, $after: String, $before: String, $first: Int, $last: Int) {
  propertyRequestComments(
    requestId: $requestId
    after: $after
    before: $before
    first: $first
    last: $last
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    edges {
      node {
        ...PropertyRequestCommentBase
      }
    }
  }
}
    ${PropertyRequestCommentBaseFragmentDoc}`;

/**
 * __useFetchRequestCommentsQuery__
 *
 * To run a query within a React component, call `useFetchRequestCommentsQuery` and pass it any options that fit your needs.
 * When your component renders, `useFetchRequestCommentsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFetchRequestCommentsQuery({
 *   variables: {
 *      requestId: // value for 'requestId'
 *      after: // value for 'after'
 *      before: // value for 'before'
 *      first: // value for 'first'
 *      last: // value for 'last'
 *   },
 * });
 */
export function useFetchRequestCommentsQuery(baseOptions: ApolloReactHooks.QueryHookOptions<FetchRequestCommentsQuery, FetchRequestCommentsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<FetchRequestCommentsQuery, FetchRequestCommentsQueryVariables>(FetchRequestCommentsDocument, options);
      }
export function useFetchRequestCommentsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<FetchRequestCommentsQuery, FetchRequestCommentsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<FetchRequestCommentsQuery, FetchRequestCommentsQueryVariables>(FetchRequestCommentsDocument, options);
        }
export function useFetchRequestCommentsSuspenseQuery(baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<FetchRequestCommentsQuery, FetchRequestCommentsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<FetchRequestCommentsQuery, FetchRequestCommentsQueryVariables>(FetchRequestCommentsDocument, options);
        }
export type FetchRequestCommentsQueryHookResult = ReturnType<typeof useFetchRequestCommentsQuery>;
export type FetchRequestCommentsLazyQueryHookResult = ReturnType<typeof useFetchRequestCommentsLazyQuery>;
export type FetchRequestCommentsSuspenseQueryHookResult = ReturnType<typeof useFetchRequestCommentsSuspenseQuery>;
export type FetchRequestCommentsQueryResult = ApolloReactCommon.QueryResult<FetchRequestCommentsQuery, FetchRequestCommentsQueryVariables>;
export const UpdateRequestUrgencyDocument = gql`
    mutation updateRequestUrgency($requestId: ID!, $urgency: PropertyRequestUrgency!) {
  requestUpdateUrgency(requestId: $requestId, urgency: $urgency) {
    ...RequestBase
  }
}
    ${RequestBaseFragmentDoc}`;
export type UpdateRequestUrgencyMutationFn = ApolloReactCommon.MutationFunction<UpdateRequestUrgencyMutation, UpdateRequestUrgencyMutationVariables>;

/**
 * __useUpdateRequestUrgencyMutation__
 *
 * To run a mutation, you first call `useUpdateRequestUrgencyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateRequestUrgencyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateRequestUrgencyMutation, { data, loading, error }] = useUpdateRequestUrgencyMutation({
 *   variables: {
 *      requestId: // value for 'requestId'
 *      urgency: // value for 'urgency'
 *   },
 * });
 */
export function useUpdateRequestUrgencyMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateRequestUrgencyMutation, UpdateRequestUrgencyMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpdateRequestUrgencyMutation, UpdateRequestUrgencyMutationVariables>(UpdateRequestUrgencyDocument, options);
      }
export type UpdateRequestUrgencyMutationHookResult = ReturnType<typeof useUpdateRequestUrgencyMutation>;
export type UpdateRequestUrgencyMutationResult = ApolloReactCommon.MutationResult<UpdateRequestUrgencyMutation>;
export type UpdateRequestUrgencyMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdateRequestUrgencyMutation, UpdateRequestUrgencyMutationVariables>;
export const FetchRequestsDocument = gql`
    query fetchRequests($first: Int!, $after: String, $state: PropertyRequestFilter) {
  myRequests(first: $first, after: $after, state: $state) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    edges {
      node {
        ...RequestBase
        property {
          address {
            ...AddressBase
          }
        }
      }
    }
  }
}
    ${RequestBaseFragmentDoc}
${AddressBaseFragmentDoc}`;

/**
 * __useFetchRequestsQuery__
 *
 * To run a query within a React component, call `useFetchRequestsQuery` and pass it any options that fit your needs.
 * When your component renders, `useFetchRequestsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFetchRequestsQuery({
 *   variables: {
 *      first: // value for 'first'
 *      after: // value for 'after'
 *      state: // value for 'state'
 *   },
 * });
 */
export function useFetchRequestsQuery(baseOptions: ApolloReactHooks.QueryHookOptions<FetchRequestsQuery, FetchRequestsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<FetchRequestsQuery, FetchRequestsQueryVariables>(FetchRequestsDocument, options);
      }
export function useFetchRequestsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<FetchRequestsQuery, FetchRequestsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<FetchRequestsQuery, FetchRequestsQueryVariables>(FetchRequestsDocument, options);
        }
export function useFetchRequestsSuspenseQuery(baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<FetchRequestsQuery, FetchRequestsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<FetchRequestsQuery, FetchRequestsQueryVariables>(FetchRequestsDocument, options);
        }
export type FetchRequestsQueryHookResult = ReturnType<typeof useFetchRequestsQuery>;
export type FetchRequestsLazyQueryHookResult = ReturnType<typeof useFetchRequestsLazyQuery>;
export type FetchRequestsSuspenseQueryHookResult = ReturnType<typeof useFetchRequestsSuspenseQuery>;
export type FetchRequestsQueryResult = ApolloReactCommon.QueryResult<FetchRequestsQuery, FetchRequestsQueryVariables>;
export const UpdateRequestStateDocument = gql`
    mutation updateRequestState($requestIds: [ID!]!, $state: PropertyRequestState!) {
  requestUpdateState(requestIds: $requestIds, state: $state)
}
    `;
export type UpdateRequestStateMutationFn = ApolloReactCommon.MutationFunction<UpdateRequestStateMutation, UpdateRequestStateMutationVariables>;

/**
 * __useUpdateRequestStateMutation__
 *
 * To run a mutation, you first call `useUpdateRequestStateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateRequestStateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateRequestStateMutation, { data, loading, error }] = useUpdateRequestStateMutation({
 *   variables: {
 *      requestIds: // value for 'requestIds'
 *      state: // value for 'state'
 *   },
 * });
 */
export function useUpdateRequestStateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateRequestStateMutation, UpdateRequestStateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpdateRequestStateMutation, UpdateRequestStateMutationVariables>(UpdateRequestStateDocument, options);
      }
export type UpdateRequestStateMutationHookResult = ReturnType<typeof useUpdateRequestStateMutation>;
export type UpdateRequestStateMutationResult = ApolloReactCommon.MutationResult<UpdateRequestStateMutation>;
export type UpdateRequestStateMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdateRequestStateMutation, UpdateRequestStateMutationVariables>;