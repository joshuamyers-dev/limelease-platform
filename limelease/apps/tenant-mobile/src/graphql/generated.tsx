import { gql } from '@apollo/client';
import * as ApolloReactCommon from '@apollo/client';
import * as ApolloReactHooks from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: any;
  DateTime: any;
};

export type Address = {
  __typename?: 'Address';
  postcode: Scalars['Int'];
  state: Scalars['String'];
  streetName: Scalars['String'];
  streetNumber: Scalars['Int'];
  streetType: Scalars['String'];
  suburb: Scalars['String'];
  unitNumber?: Maybe<Scalars['Int']>;
};

export type Agency = {
  __typename?: 'Agency';
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type AgencyAgent = {
  __typename?: 'AgencyAgent';
  id: Scalars['ID'];
  role: Scalars['String'];
  user: User;
};

export type AgencyAgentConnection = {
  __typename?: 'AgencyAgentConnection';
  edges?: Maybe<Array<Maybe<AgencyAgentEdge>>>;
  pageInfo: PageInfo;
};

export type AgencyAgentEdge = {
  __typename?: 'AgencyAgentEdge';
  cursor?: Maybe<Scalars['String']>;
  node?: Maybe<AgencyAgent>;
};

export type Contractor = {
  __typename?: 'Contractor';
  address?: Maybe<Address>;
  areasServed: Array<Maybe<Scalars['String']>>;
  businessName: Scalars['String'];
  contactEmail: Scalars['String'];
  contactNumber: Scalars['String'];
  id: Scalars['ID'];
  jobs?: Maybe<ContractorJobConnection>;
  websiteUrl?: Maybe<Scalars['String']>;
};


export type ContractorJobsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  state?: InputMaybe<PropertyRequestFilter>;
};

export type ContractorConnection = {
  __typename?: 'ContractorConnection';
  edges?: Maybe<Array<Maybe<ContractorEdge>>>;
  pageInfo: PageInfo;
};

export type ContractorEdge = {
  __typename?: 'ContractorEdge';
  cursor?: Maybe<Scalars['String']>;
  node?: Maybe<Contractor>;
};

export type ContractorJob = {
  __typename?: 'ContractorJob';
  bookingDateEnd?: Maybe<Scalars['DateTime']>;
  bookingDateStart?: Maybe<Scalars['DateTime']>;
  contractor?: Maybe<Contractor>;
  description?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
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
  cursor?: Maybe<Scalars['String']>;
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
  postcode: Scalars['Int'];
  state: Scalars['String'];
  streetName: Scalars['String'];
  streetNumber: Scalars['Int'];
  streetType: Scalars['String'];
  suburb: Scalars['String'];
  unitNumber?: InputMaybe<Scalars['Int']>;
};

export type CreatePhoto = {
  id?: InputMaybe<Scalars['ID']>;
  name?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<Scalars['String']>;
  uriPath?: InputMaybe<Scalars['String']>;
  url?: InputMaybe<Scalars['String']>;
};

export type File = {
  id?: InputMaybe<Scalars['ID']>;
  name: Scalars['String'];
  type: Scalars['String'];
  uri?: InputMaybe<Scalars['String']>;
};

export type Landlord = {
  email: Scalars['String'];
  firstName: Scalars['String'];
  id?: InputMaybe<Scalars['ID']>;
  lastName: Scalars['String'];
  phoneNumber: Scalars['String'];
};

export type Lease = {
  __typename?: 'Lease';
  endDate?: Maybe<Scalars['DateTime']>;
  id: Scalars['ID'];
  isActive?: Maybe<Scalars['Boolean']>;
  property: Property;
  rentPcm?: Maybe<Scalars['Float']>;
  startDate?: Maybe<Scalars['DateTime']>;
  tenants: Array<Maybe<Tenant>>;
};

export type LeaseDetails = {
  endDate: Scalars['DateTime'];
  id?: InputMaybe<Scalars['ID']>;
  rentPcm: Scalars['Int'];
  startDate: Scalars['DateTime'];
};

export type PageInfo = {
  __typename?: 'PageInfo';
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars['String']>;
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars['Boolean'];
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars['Boolean'];
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars['String']>;
};

export type Profile = {
  __typename?: 'Profile';
  email?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  lastName?: Maybe<Scalars['String']>;
  phoneNumber?: Maybe<Scalars['String']>;
};

export type Property = {
  __typename?: 'Property';
  address: Address;
  agents?: Maybe<Array<Maybe<PropertyAgent>>>;
  bathrooms: Scalars['Int'];
  bedrooms: Scalars['Int'];
  carspaces: Scalars['Int'];
  files?: Maybe<Array<Maybe<PropertyFile>>>;
  id: Scalars['ID'];
  landlords: Array<PropertyLandlord>;
  lease?: Maybe<Lease>;
  notificationCount?: Maybe<PropertyNotificationCounts>;
  photos: Array<PropertyPhoto>;
  requests?: Maybe<Array<Maybe<PropertyRequest>>>;
  tenants?: Maybe<Array<Maybe<Tenant>>>;
};

export type PropertyAgent = {
  __typename?: 'PropertyAgent';
  agent?: Maybe<AgencyAgent>;
  id: Scalars['ID'];
};

export type PropertyConnection = {
  __typename?: 'PropertyConnection';
  edges?: Maybe<Array<Maybe<PropertyEdge>>>;
  pageInfo: PageInfo;
};

export type PropertyDetails = {
  address: CreateAddress;
  bathrooms: Scalars['Int'];
  bedrooms: Scalars['Int'];
  carspaces: Scalars['Int'];
};

export type PropertyEdge = {
  __typename?: 'PropertyEdge';
  cursor?: Maybe<Scalars['String']>;
  node?: Maybe<Property>;
};

export type PropertyFile = {
  __typename?: 'PropertyFile';
  fileName: Scalars['String'];
  id: Scalars['ID'];
  insertedAt: Scalars['DateTime'];
  staticMedia?: Maybe<StaticMedia>;
};

export enum PropertyFilter {
  All = 'ALL',
  Occupied = 'OCCUPIED',
  Vacant = 'VACANT'
}

export type PropertyLandlord = {
  __typename?: 'PropertyLandlord';
  email: Scalars['String'];
  firstName: Scalars['String'];
  id: Scalars['ID'];
  lastName: Scalars['String'];
  phoneNumber: Scalars['String'];
};

export type PropertyNotificationCounts = {
  __typename?: 'PropertyNotificationCounts';
  messagesCount: Scalars['Int'];
  midHighCount: Scalars['Int'];
  urgentCount: Scalars['Int'];
};

export type PropertyPhoto = {
  __typename?: 'PropertyPhoto';
  id: Scalars['ID'];
  order: Scalars['Int'];
  staticMedia?: Maybe<StaticMedia>;
};

export type PropertyRequest = {
  __typename?: 'PropertyRequest';
  category: PropertyRequestCategory;
  comments?: Maybe<PropertyRequestCommentConnection>;
  details: Scalars['String'];
  id: Scalars['ID'];
  insertedAt: Scalars['Date'];
  photos?: Maybe<Array<Maybe<PropertyRequestPhoto>>>;
  property: Property;
  state: PropertyRequestState;
  tenant?: Maybe<Tenant>;
  ticketNumber: Scalars['String'];
  title: Scalars['String'];
  urgency: PropertyRequestUrgency;
};


export type PropertyRequestCommentsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};

export type PropertyRequestCategory = {
  __typename?: 'PropertyRequestCategory';
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type PropertyRequestComment = {
  __typename?: 'PropertyRequestComment';
  authorName: Scalars['String'];
  id: Scalars['ID'];
  insertedAt: Scalars['DateTime'];
  messageBody?: Maybe<Scalars['String']>;
  systemGenerated?: Maybe<Scalars['Boolean']>;
};

export type PropertyRequestCommentConnection = {
  __typename?: 'PropertyRequestCommentConnection';
  edges?: Maybe<Array<Maybe<PropertyRequestCommentEdge>>>;
  pageInfo: PageInfo;
};

export type PropertyRequestCommentEdge = {
  __typename?: 'PropertyRequestCommentEdge';
  cursor?: Maybe<Scalars['String']>;
  node?: Maybe<PropertyRequestComment>;
};

export type PropertyRequestConnection = {
  __typename?: 'PropertyRequestConnection';
  edges?: Maybe<Array<Maybe<PropertyRequestEdge>>>;
  pageInfo: PageInfo;
};

export type PropertyRequestEdge = {
  __typename?: 'PropertyRequestEdge';
  cursor?: Maybe<Scalars['String']>;
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
  requestUpdateState: Scalars['Boolean'];
  /** Update the urgency of a property request. Expected errors: unauthorized */
  requestUpdateUrgency: PropertyRequest;
  /** Create a new static media asset. */
  staticMediaCreate: StaticMedia;
  /** Update an existing property */
  updateProperty: Property;
  /** Login a user with email and password */
  userLogin: Session;
  /** Send OTP code for user (tenant) login */
  userSendOtp: Scalars['Boolean'];
  /** Verify OTP code for user (tenant) login */
  userVerifyOtp: Session;
};


export type RootMutationTypeContractorJobCreateArgs = {
  bookingDateEnd: Scalars['DateTime'];
  bookingDateStart: Scalars['DateTime'];
  contractorId: Scalars['ID'];
  contractorMessage: Scalars['String'];
  description: Scalars['String'];
  requestId: Scalars['ID'];
};


export type RootMutationTypeContractorJobDeleteArgs = {
  id: Scalars['ID'];
};


export type RootMutationTypeCreateContractorArgs = {
  address?: InputMaybe<CreateAddress>;
  areasServed: Array<InputMaybe<Scalars['String']>>;
  businessName: Scalars['String'];
  contactEmail: Scalars['String'];
  contactNumber: Scalars['String'];
  websiteUrl?: InputMaybe<Scalars['String']>;
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
  authorName: Scalars['String'];
  messageBody: Scalars['String'];
  requestId: Scalars['ID'];
  systemGenerated?: InputMaybe<Scalars['Boolean']>;
};


export type RootMutationTypeRequestCreateArgs = {
  categoryId: Scalars['ID'];
  details: Scalars['String'];
  photos?: InputMaybe<Array<InputMaybe<CreatePhoto>>>;
  propertyId: Scalars['ID'];
  title: Scalars['String'];
  urgency?: InputMaybe<PropertyRequestUrgency>;
};


export type RootMutationTypeRequestUpdateStateArgs = {
  requestIds: Array<Scalars['ID']>;
  state: PropertyRequestState;
};


export type RootMutationTypeRequestUpdateUrgencyArgs = {
  requestId: Scalars['ID'];
  urgency: PropertyRequestUrgency;
};


export type RootMutationTypeStaticMediaCreateArgs = {
  fileName?: InputMaybe<Scalars['String']>;
  mimeType: Scalars['String'];
  s3Key?: InputMaybe<Scalars['String']>;
};


export type RootMutationTypeUpdatePropertyArgs = {
  files?: InputMaybe<Array<InputMaybe<File>>>;
  landlords: Array<Landlord>;
  leaseDetails?: InputMaybe<LeaseDetails>;
  photos?: InputMaybe<Array<CreatePhoto>>;
  propertyDetails: PropertyDetails;
  propertyId: Scalars['ID'];
  tenants?: InputMaybe<Array<TenantObject>>;
};


export type RootMutationTypeUserLoginArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type RootMutationTypeUserSendOtpArgs = {
  mobileNumber: Scalars['String'];
};


export type RootMutationTypeUserVerifyOtpArgs = {
  code: Scalars['String'];
  mobileNumber: Scalars['String'];
};

export type RootQueryType = {
  __typename?: 'RootQueryType';
  /** Fetch the count of contractors a user is associated with. Expected Errors: unauthorized */
  contractorCount: Scalars['Int'];
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
  /** Fetch details about my lease as a tenant. */
  myLease?: Maybe<Lease>;
  /** Get a paginated list of properties. Expected errors: unauthorized. */
  myProperties?: Maybe<PropertyConnection>;
  /** Fetch all requests, filtered by a state. Expected errors: unauthorized */
  myRequests?: Maybe<PropertyRequestConnection>;
  /** Get a list of team members for your agency. */
  myTeam?: Maybe<AgencyAgentConnection>;
  /** Fetch upcoming jobs for a tenant. */
  myUpcomingJobs?: Maybe<ContractorJob>;
  /** Fetch a list of property request categories. */
  propertyRequestCategories?: Maybe<Array<Maybe<PropertyRequestCategory>>>;
  /** Fetch a paginated list of property request comments by ID */
  propertyRequestComments?: Maybe<PropertyRequestCommentConnection>;
  /** Fetch a count of property request comments by Request ID */
  propertyRequestCommentsCount: Scalars['Int'];
  /** Fetch a paginated lists of requests for a particular property. Expected errors: unauthorized, not_found */
  requestsForProperty?: Maybe<PropertyRequestConnection>;
  /** Search for contractors by name */
  searchContractors?: Maybe<ContractorConnection>;
};


export type RootQueryTypeContractorJobActiveArgs = {
  requestId: Scalars['ID'];
};


export type RootQueryTypeFetchContractorArgs = {
  contractorId: Scalars['ID'];
};


export type RootQueryTypeFetchPropertyArgs = {
  id: Scalars['ID'];
};


export type RootQueryTypeFetchRequestArgs = {
  id: Scalars['ID'];
};


export type RootQueryTypeFetchRequestByTicketNumberArgs = {
  ticketNumber: Scalars['String'];
};


export type RootQueryTypeJobsForContractorArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  contractorId: Scalars['ID'];
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  state?: InputMaybe<PropertyRequestFilter>;
};


export type RootQueryTypeMyContractorsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  searchTerm?: InputMaybe<Scalars['String']>;
};


export type RootQueryTypeMyPropertiesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<PropertyFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  searchKeywords?: InputMaybe<Scalars['String']>;
};


export type RootQueryTypeMyRequestsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  state?: InputMaybe<PropertyRequestFilter>;
};


export type RootQueryTypeMyTeamArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  searchTerm?: InputMaybe<Scalars['String']>;
};


export type RootQueryTypePropertyRequestCommentsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  requestId: Scalars['ID'];
};


export type RootQueryTypePropertyRequestCommentsCountArgs = {
  requestId: Scalars['ID'];
};


export type RootQueryTypeRequestsForPropertyArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  propertyId: Scalars['ID'];
  state?: InputMaybe<PropertyRequestFilter>;
};


export type RootQueryTypeSearchContractorsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  searchTerm: Scalars['String'];
};

export type Session = {
  __typename?: 'Session';
  token: Scalars['String'];
  user: User;
};

export type StaticMedia = {
  __typename?: 'StaticMedia';
  id: Scalars['ID'];
  s3Key?: Maybe<Scalars['String']>;
  uploadUrl?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
};

export type Tenant = {
  __typename?: 'Tenant';
  id: Scalars['ID'];
  property: Property;
  user: User;
};

export type TenantObject = {
  email: Scalars['String'];
  firstName: Scalars['String'];
  id?: InputMaybe<Scalars['ID']>;
  lastName: Scalars['String'];
  phoneNumber: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  agency?: Maybe<Agency>;
  id: Scalars['ID'];
  isAdmin: Scalars['Boolean'];
  profile: Profile;
  tenant?: Maybe<Tenant>;
};

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'RootQueryType', me?: { __typename?: 'User', id: string, profile: { __typename?: 'Profile', id: string, email?: string | null, firstName?: string | null, lastName?: string | null, phoneNumber?: string | null }, tenant?: { __typename?: 'Tenant', id: string, property: { __typename?: 'Property', id: string, bathrooms: number, bedrooms: number, carspaces: number, address: { __typename?: 'Address', unitNumber?: number | null, streetName: string, streetType: string, streetNumber: number, suburb: string, postcode: number, state: string } } } | null } | null };

export type MyLeaseQueryVariables = Exact<{ [key: string]: never; }>;


export type MyLeaseQuery = { __typename?: 'RootQueryType', myLease?: { __typename?: 'Lease', id: string, startDate?: any | null, endDate?: any | null, rentPcm?: number | null, property: { __typename?: 'Property', agents?: Array<{ __typename?: 'PropertyAgent', id: string, agent?: { __typename?: 'AgencyAgent', id: string, user: { __typename?: 'User', id: string, profile: { __typename?: 'Profile', firstName?: string | null, lastName?: string | null, phoneNumber?: string | null } } } | null } | null> | null } } | null };

export type MyUpcomingJobsQueryVariables = Exact<{ [key: string]: never; }>;


export type MyUpcomingJobsQuery = { __typename?: 'RootQueryType', myUpcomingJobs?: { __typename?: 'ContractorJob', id: string, state: ContractorJobState, description?: string | null, bookingDateStart?: any | null, bookingDateEnd?: any | null, request?: { __typename?: 'PropertyRequest', id: string } | null, contractor?: { __typename?: 'Contractor', id: string, businessName: string } | null } | null };

export type SendOtpMutationVariables = Exact<{
  number: Scalars['String'];
}>;


export type SendOtpMutation = { __typename?: 'RootMutationType', userSendOtp: boolean };

export type VerifyOtpMutationVariables = Exact<{
  number: Scalars['String'];
  code: Scalars['String'];
}>;


export type VerifyOtpMutation = { __typename?: 'RootMutationType', userVerifyOtp: { __typename?: 'Session', token: string, user: { __typename?: 'User', id: string, profile: { __typename?: 'Profile', id: string, email?: string | null, firstName?: string | null, lastName?: string | null, phoneNumber?: string | null }, tenant?: { __typename?: 'Tenant', id: string, property: { __typename?: 'Property', id: string, bathrooms: number, bedrooms: number, carspaces: number, address: { __typename?: 'Address', unitNumber?: number | null, streetName: string, streetType: string, streetNumber: number, suburb: string, postcode: number, state: string } } } | null } } };

export type AddRequestCommentMutationVariables = Exact<{
  authorName: Scalars['String'];
  messageBody: Scalars['String'];
  requestId: Scalars['ID'];
  systemGenerated?: InputMaybe<Scalars['Boolean']>;
}>;


export type AddRequestCommentMutation = { __typename?: 'RootMutationType', propertyRequestCommentCreate?: { __typename?: 'PropertyRequestComment', id: string, messageBody?: string | null, systemGenerated?: boolean | null, authorName: string, insertedAt: any } | null };

export type CreateRequestMutationVariables = Exact<{
  propertyId: Scalars['ID'];
  categoryId: Scalars['ID'];
  title: Scalars['String'];
  photos?: InputMaybe<Array<InputMaybe<CreatePhoto>> | InputMaybe<CreatePhoto>>;
  details: Scalars['String'];
  urgency?: InputMaybe<PropertyRequestUrgency>;
}>;


export type CreateRequestMutation = { __typename?: 'RootMutationType', requestCreate: { __typename?: 'PropertyRequest', id: string, ticketNumber: string, state: PropertyRequestState, title: string, insertedAt: any } };

export type FetchActiveJobForRequestQueryVariables = Exact<{
  requestId: Scalars['ID'];
}>;


export type FetchActiveJobForRequestQuery = { __typename?: 'RootQueryType', contractorJobActive?: { __typename?: 'ContractorJob', id: string, state: ContractorJobState, description?: string | null, bookingDateStart?: any | null, bookingDateEnd?: any | null, contractor?: { __typename?: 'Contractor', id: string, businessName: string } | null } | null };

export type FetchRequestQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type FetchRequestQuery = { __typename?: 'RootQueryType', fetchRequest: { __typename?: 'PropertyRequest', details: string, id: string, ticketNumber: string, state: PropertyRequestState, title: string, insertedAt: any, category: { __typename?: 'PropertyRequestCategory', id: string, name: string }, property: { __typename?: 'Property', agents?: Array<{ __typename?: 'PropertyAgent', id: string, agent?: { __typename?: 'AgencyAgent', user: { __typename?: 'User', profile: { __typename?: 'Profile', firstName?: string | null, lastName?: string | null } } } | null } | null> | null }, photos?: Array<{ __typename?: 'PropertyRequestPhoto', staticMedia: { __typename?: 'StaticMedia', url?: string | null } } | null> | null } };

export type FetchRequestCategoriesQueryVariables = Exact<{ [key: string]: never; }>;


export type FetchRequestCategoriesQuery = { __typename?: 'RootQueryType', propertyRequestCategories?: Array<{ __typename?: 'PropertyRequestCategory', id: string, name: string } | null> | null };

export type FetchRequestCommentsQueryVariables = Exact<{
  requestId: Scalars['ID'];
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
}>;


export type FetchRequestCommentsQuery = { __typename?: 'RootQueryType', propertyRequestComments?: { __typename?: 'PropertyRequestCommentConnection', pageInfo: { __typename?: 'PageInfo', hasPreviousPage: boolean, hasNextPage: boolean, startCursor?: string | null, endCursor?: string | null }, edges?: Array<{ __typename?: 'PropertyRequestCommentEdge', node?: { __typename?: 'PropertyRequestComment', id: string, messageBody?: string | null, systemGenerated?: boolean | null, authorName: string, insertedAt: any } | null } | null> | null } | null };

export type MyRequestsQueryVariables = Exact<{
  first: Scalars['Int'];
  after?: InputMaybe<Scalars['String']>;
  state?: InputMaybe<PropertyRequestFilter>;
}>;


export type MyRequestsQuery = { __typename?: 'RootQueryType', myRequests?: { __typename?: 'PropertyRequestConnection', pageInfo: { __typename?: 'PageInfo', hasPreviousPage: boolean, hasNextPage: boolean, startCursor?: string | null, endCursor?: string | null }, edges?: Array<{ __typename?: 'PropertyRequestEdge', node?: { __typename?: 'PropertyRequest', id: string, ticketNumber: string, state: PropertyRequestState, title: string, insertedAt: any } | null } | null> | null } | null };

export type ContractorBaseFragment = { __typename?: 'Contractor', id: string, businessName: string };

export type ContractorJobBaseFragment = { __typename?: 'ContractorJob', id: string, state: ContractorJobState, description?: string | null, bookingDateStart?: any | null, bookingDateEnd?: any | null, contractor?: { __typename?: 'Contractor', id: string, businessName: string } | null };

export type LeaseBaseFragment = { __typename?: 'Lease', id: string, startDate?: any | null, endDate?: any | null, rentPcm?: number | null };

export type ProfileBaseFragment = { __typename?: 'Profile', id: string, email?: string | null, firstName?: string | null, lastName?: string | null, phoneNumber?: string | null };

export type PropertyBaseFragment = { __typename?: 'Property', id: string, bathrooms: number, bedrooms: number, carspaces: number, address: { __typename?: 'Address', unitNumber?: number | null, streetName: string, streetType: string, streetNumber: number, suburb: string, postcode: number, state: string } };

export type PropertyRequestCommentBaseFragment = { __typename?: 'PropertyRequestComment', id: string, messageBody?: string | null, systemGenerated?: boolean | null, authorName: string, insertedAt: any };

export type RequestBaseFragment = { __typename?: 'PropertyRequest', id: string, ticketNumber: string, state: PropertyRequestState, title: string, insertedAt: any };

export type TenantBaseFragment = { __typename?: 'Tenant', id: string, property: { __typename?: 'Property', id: string, bathrooms: number, bedrooms: number, carspaces: number, address: { __typename?: 'Address', unitNumber?: number | null, streetName: string, streetType: string, streetNumber: number, suburb: string, postcode: number, state: string } } };

export type UserBaseFragment = { __typename?: 'User', id: string, profile: { __typename?: 'Profile', id: string, email?: string | null, firstName?: string | null, lastName?: string | null, phoneNumber?: string | null }, tenant?: { __typename?: 'Tenant', id: string, property: { __typename?: 'Property', id: string, bathrooms: number, bedrooms: number, carspaces: number, address: { __typename?: 'Address', unitNumber?: number | null, streetName: string, streetType: string, streetNumber: number, suburb: string, postcode: number, state: string } } } | null };

export const ContractorBaseFragmentDoc = gql`
    fragment ContractorBase on Contractor {
  id
  businessName
}
    `;
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
export const LeaseBaseFragmentDoc = gql`
    fragment LeaseBase on Lease {
  id
  startDate
  endDate
  rentPcm
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
export const RequestBaseFragmentDoc = gql`
    fragment RequestBase on PropertyRequest {
  id
  ticketNumber
  state
  title
  insertedAt
}
    `;
export const ProfileBaseFragmentDoc = gql`
    fragment ProfileBase on Profile {
  id
  email
  firstName
  lastName
  phoneNumber
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
}
    `;
export const TenantBaseFragmentDoc = gql`
    fragment TenantBase on Tenant {
  id
  property {
    ...PropertyBase
  }
}
    ${PropertyBaseFragmentDoc}`;
export const UserBaseFragmentDoc = gql`
    fragment UserBase on User {
  id
  profile {
    ...ProfileBase
  }
  tenant {
    ...TenantBase
  }
}
    ${ProfileBaseFragmentDoc}
${TenantBaseFragmentDoc}`;
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
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeQueryResult = ApolloReactCommon.QueryResult<MeQuery, MeQueryVariables>;
export const MyLeaseDocument = gql`
    query myLease {
  myLease {
    ...LeaseBase
    property {
      agents {
        id
        agent {
          id
          user {
            id
            profile {
              firstName
              lastName
              phoneNumber
            }
          }
        }
      }
    }
  }
}
    ${LeaseBaseFragmentDoc}`;

/**
 * __useMyLeaseQuery__
 *
 * To run a query within a React component, call `useMyLeaseQuery` and pass it any options that fit your needs.
 * When your component renders, `useMyLeaseQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMyLeaseQuery({
 *   variables: {
 *   },
 * });
 */
export function useMyLeaseQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<MyLeaseQuery, MyLeaseQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<MyLeaseQuery, MyLeaseQueryVariables>(MyLeaseDocument, options);
      }
export function useMyLeaseLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<MyLeaseQuery, MyLeaseQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<MyLeaseQuery, MyLeaseQueryVariables>(MyLeaseDocument, options);
        }
export type MyLeaseQueryHookResult = ReturnType<typeof useMyLeaseQuery>;
export type MyLeaseLazyQueryHookResult = ReturnType<typeof useMyLeaseLazyQuery>;
export type MyLeaseQueryResult = ApolloReactCommon.QueryResult<MyLeaseQuery, MyLeaseQueryVariables>;
export const MyUpcomingJobsDocument = gql`
    query myUpcomingJobs {
  myUpcomingJobs {
    ...ContractorJobBase
    request {
      id
    }
  }
}
    ${ContractorJobBaseFragmentDoc}`;

/**
 * __useMyUpcomingJobsQuery__
 *
 * To run a query within a React component, call `useMyUpcomingJobsQuery` and pass it any options that fit your needs.
 * When your component renders, `useMyUpcomingJobsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMyUpcomingJobsQuery({
 *   variables: {
 *   },
 * });
 */
export function useMyUpcomingJobsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<MyUpcomingJobsQuery, MyUpcomingJobsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<MyUpcomingJobsQuery, MyUpcomingJobsQueryVariables>(MyUpcomingJobsDocument, options);
      }
export function useMyUpcomingJobsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<MyUpcomingJobsQuery, MyUpcomingJobsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<MyUpcomingJobsQuery, MyUpcomingJobsQueryVariables>(MyUpcomingJobsDocument, options);
        }
export type MyUpcomingJobsQueryHookResult = ReturnType<typeof useMyUpcomingJobsQuery>;
export type MyUpcomingJobsLazyQueryHookResult = ReturnType<typeof useMyUpcomingJobsLazyQuery>;
export type MyUpcomingJobsQueryResult = ApolloReactCommon.QueryResult<MyUpcomingJobsQuery, MyUpcomingJobsQueryVariables>;
export const SendOtpDocument = gql`
    mutation sendOtp($number: String!) {
  userSendOtp(mobileNumber: $number)
}
    `;
export type SendOtpMutationFn = ApolloReactCommon.MutationFunction<SendOtpMutation, SendOtpMutationVariables>;

/**
 * __useSendOtpMutation__
 *
 * To run a mutation, you first call `useSendOtpMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSendOtpMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [sendOtpMutation, { data, loading, error }] = useSendOtpMutation({
 *   variables: {
 *      number: // value for 'number'
 *   },
 * });
 */
export function useSendOtpMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<SendOtpMutation, SendOtpMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<SendOtpMutation, SendOtpMutationVariables>(SendOtpDocument, options);
      }
export type SendOtpMutationHookResult = ReturnType<typeof useSendOtpMutation>;
export type SendOtpMutationResult = ApolloReactCommon.MutationResult<SendOtpMutation>;
export type SendOtpMutationOptions = ApolloReactCommon.BaseMutationOptions<SendOtpMutation, SendOtpMutationVariables>;
export const VerifyOtpDocument = gql`
    mutation verifyOtp($number: String!, $code: String!) {
  userVerifyOtp(mobileNumber: $number, code: $code) {
    token
    user {
      ...UserBase
    }
  }
}
    ${UserBaseFragmentDoc}`;
export type VerifyOtpMutationFn = ApolloReactCommon.MutationFunction<VerifyOtpMutation, VerifyOtpMutationVariables>;

/**
 * __useVerifyOtpMutation__
 *
 * To run a mutation, you first call `useVerifyOtpMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useVerifyOtpMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [verifyOtpMutation, { data, loading, error }] = useVerifyOtpMutation({
 *   variables: {
 *      number: // value for 'number'
 *      code: // value for 'code'
 *   },
 * });
 */
export function useVerifyOtpMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<VerifyOtpMutation, VerifyOtpMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<VerifyOtpMutation, VerifyOtpMutationVariables>(VerifyOtpDocument, options);
      }
export type VerifyOtpMutationHookResult = ReturnType<typeof useVerifyOtpMutation>;
export type VerifyOtpMutationResult = ApolloReactCommon.MutationResult<VerifyOtpMutation>;
export type VerifyOtpMutationOptions = ApolloReactCommon.BaseMutationOptions<VerifyOtpMutation, VerifyOtpMutationVariables>;
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
export type FetchActiveJobForRequestQueryHookResult = ReturnType<typeof useFetchActiveJobForRequestQuery>;
export type FetchActiveJobForRequestLazyQueryHookResult = ReturnType<typeof useFetchActiveJobForRequestLazyQuery>;
export type FetchActiveJobForRequestQueryResult = ApolloReactCommon.QueryResult<FetchActiveJobForRequestQuery, FetchActiveJobForRequestQueryVariables>;
export const FetchRequestDocument = gql`
    query fetchRequest($id: ID!) {
  fetchRequest(id: $id) {
    ...RequestBase
    details
    category {
      id
      name
    }
    property {
      agents {
        id
        agent {
          user {
            profile {
              firstName
              lastName
            }
          }
        }
      }
    }
    photos {
      staticMedia {
        url
      }
    }
  }
}
    ${RequestBaseFragmentDoc}`;

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
export type FetchRequestQueryHookResult = ReturnType<typeof useFetchRequestQuery>;
export type FetchRequestLazyQueryHookResult = ReturnType<typeof useFetchRequestLazyQuery>;
export type FetchRequestQueryResult = ApolloReactCommon.QueryResult<FetchRequestQuery, FetchRequestQueryVariables>;
export const FetchRequestCategoriesDocument = gql`
    query fetchRequestCategories {
  propertyRequestCategories {
    id
    name
  }
}
    `;

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
export type FetchRequestCategoriesQueryHookResult = ReturnType<typeof useFetchRequestCategoriesQuery>;
export type FetchRequestCategoriesLazyQueryHookResult = ReturnType<typeof useFetchRequestCategoriesLazyQuery>;
export type FetchRequestCategoriesQueryResult = ApolloReactCommon.QueryResult<FetchRequestCategoriesQuery, FetchRequestCategoriesQueryVariables>;
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
export type FetchRequestCommentsQueryHookResult = ReturnType<typeof useFetchRequestCommentsQuery>;
export type FetchRequestCommentsLazyQueryHookResult = ReturnType<typeof useFetchRequestCommentsLazyQuery>;
export type FetchRequestCommentsQueryResult = ApolloReactCommon.QueryResult<FetchRequestCommentsQuery, FetchRequestCommentsQueryVariables>;
export const MyRequestsDocument = gql`
    query myRequests($first: Int!, $after: String, $state: PropertyRequestFilter) {
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
      }
    }
  }
}
    ${RequestBaseFragmentDoc}`;

/**
 * __useMyRequestsQuery__
 *
 * To run a query within a React component, call `useMyRequestsQuery` and pass it any options that fit your needs.
 * When your component renders, `useMyRequestsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMyRequestsQuery({
 *   variables: {
 *      first: // value for 'first'
 *      after: // value for 'after'
 *      state: // value for 'state'
 *   },
 * });
 */
export function useMyRequestsQuery(baseOptions: ApolloReactHooks.QueryHookOptions<MyRequestsQuery, MyRequestsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<MyRequestsQuery, MyRequestsQueryVariables>(MyRequestsDocument, options);
      }
export function useMyRequestsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<MyRequestsQuery, MyRequestsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<MyRequestsQuery, MyRequestsQueryVariables>(MyRequestsDocument, options);
        }
export type MyRequestsQueryHookResult = ReturnType<typeof useMyRequestsQuery>;
export type MyRequestsLazyQueryHookResult = ReturnType<typeof useMyRequestsLazyQuery>;
export type MyRequestsQueryResult = ApolloReactCommon.QueryResult<MyRequestsQuery, MyRequestsQueryVariables>;