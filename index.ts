import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

// VPC Configuration
const vpc = new aws.ec2.Vpc("LimeLeaseVPC", {
  cidrBlock: "10.0.0.0/16",
  enableDnsHostnames: true,
  enableDnsSupport: true,
  tags: {
    Name: "LimeLeaseVPC",
  },
});

// Create public subnets in different availability zones
const publicSubnet1 = new aws.ec2.Subnet("PublicSubnet1", {
  vpcId: vpc.id,
  cidrBlock: "10.0.1.0/24",
  availabilityZone: "ap-southeast-2a",
  mapPublicIpOnLaunch: true,
  tags: {
    Name: "PublicSubnet1",
  },
});

const publicSubnet2 = new aws.ec2.Subnet("PublicSubnet2", {
  vpcId: vpc.id,
  cidrBlock: "10.0.2.0/24",
  availabilityZone: "ap-southeast-2b",
  mapPublicIpOnLaunch: true,
  tags: {
    Name: "PublicSubnet2",
  },
});

// Create private subnets in different availability zones
const privateSubnet1 = new aws.ec2.Subnet("PrivateSubnet1", {
  vpcId: vpc.id,
  cidrBlock: "10.0.3.0/24",
  availabilityZone: "ap-southeast-2a",
  tags: {
    Name: "PrivateSubnet1",
  },
});

const privateSubnet2 = new aws.ec2.Subnet("PrivateSubnet2", {
  vpcId: vpc.id,
  cidrBlock: "10.0.4.0/24",
  availabilityZone: "ap-southeast-2b",
  tags: {
    Name: "PrivateSubnet2",
  },
});

// Internet Gateway for public subnets
const internetGateway = new aws.ec2.InternetGateway("InternetGateway", {
  vpcId: vpc.id,
  tags: {
    Name: "LimeLeaseIGW",
  },
});

// Create a NAT Gateway in the public subnet
const eip = new aws.ec2.Eip("NatEIP", {
  vpc: true,
});

const natGateway = new aws.ec2.NatGateway("NatGateway", {
  allocationId: eip.id,
  subnetId: publicSubnet1.id,
  tags: {
    Name: "LimeLeaseNAT",
  },
});

// Route tables
const publicRouteTable = new aws.ec2.RouteTable("PublicRouteTable", {
  vpcId: vpc.id,
  tags: {
    Name: "PublicRouteTable",
  },
});

const privateRouteTable = new aws.ec2.RouteTable("PrivateRouteTable", {
  vpcId: vpc.id,
  tags: {
    Name: "PrivateRouteTable",
  },
});

// Routes
const publicRoute = new aws.ec2.Route("PublicRoute", {
  routeTableId: publicRouteTable.id,
  destinationCidrBlock: "0.0.0.0/0",
  gatewayId: internetGateway.id,
});

const privateRoute = new aws.ec2.Route("PrivateRoute", {
  routeTableId: privateRouteTable.id,
  destinationCidrBlock: "0.0.0.0/0",
  natGatewayId: natGateway.id,
});

// Route table associations
const publicSubnet1RouteTableAssociation = new aws.ec2.RouteTableAssociation(
  "PublicSubnet1Association",
  {
    subnetId: publicSubnet1.id,
    routeTableId: publicRouteTable.id,
  }
);

const publicSubnet2RouteTableAssociation = new aws.ec2.RouteTableAssociation(
  "PublicSubnet2Association",
  {
    subnetId: publicSubnet2.id,
    routeTableId: publicRouteTable.id,
  }
);

const privateSubnet1RouteTableAssociation = new aws.ec2.RouteTableAssociation(
  "PrivateSubnet1Association",
  {
    subnetId: privateSubnet1.id,
    routeTableId: privateRouteTable.id,
  }
);

const privateSubnet2RouteTableAssociation = new aws.ec2.RouteTableAssociation(
  "PrivateSubnet2Association",
  {
    subnetId: privateSubnet2.id,
    routeTableId: privateRouteTable.id,
  }
);

// S3 Bucket
const bucket = new aws.s3.Bucket("Storage", {
  acl: "private",
  tags: {
    Name: "LimeLeaseBucket",
  },
});

// Security Groups
const apiSecurityGroup = new aws.ec2.SecurityGroup("ElixirApiSecurityGroup", {
  vpcId: vpc.id,
  ingress: [
    {
      protocol: "tcp",
      fromPort: 80,
      toPort: 80,
      cidrBlocks: ["0.0.0.0/0"],
    },
    {
      protocol: "tcp",
      fromPort: 443,
      toPort: 443,
      cidrBlocks: ["0.0.0.0/0"],
    },
    {
      fromPort: 3000,
      toPort: 3000,
      protocol: "tcp",
      cidrBlocks: ["0.0.0.0/0"],
    },
  ],
  egress: [
    {
      fromPort: 0,
      toPort: 0,
      protocol: "-1",
      cidrBlocks: ["0.0.0.0/0"],
    },
  ],
  tags: {
    Name: "ElixirApiSecurityGroup",
  },
});

const dbSecurityGroup = new aws.ec2.SecurityGroup("DatabaseSecurityGroup", {
  vpcId: vpc.id,
  description: "Allow access to the database from ECS tasks",
  ingress: [
    {
      fromPort: 5432,
      toPort: 5432,
      protocol: "tcp",
      securityGroups: [apiSecurityGroup.id],
    },
  ],
  egress: [
    {
      fromPort: 0,
      toPort: 0,
      protocol: "-1",
      cidrBlocks: ["0.0.0.0/0"],
    },
  ],
  tags: {
    Name: "DatabaseSecurityGroup",
  },
});

// Database Subnet Group
const dbSubnetGroup = new aws.rds.SubnetGroup("DatabaseSubnetGroup", {
  name: "database-subnet-group",
  subnetIds: [privateSubnet1.id, privateSubnet2.id],
  description: "Subnet group for the database",
  tags: {
    Name: "DatabaseSubnetGroup",
  },
});

// Database Parameter Group
const databaseParameterGroup = new aws.rds.ParameterGroup(
  "DatabaseParameterGroup",
  {
    family: "postgres16",
    name: "database-parameter-group",
    parameters: [{ name: "rds.force_ssl", value: "0" }],
    tags: {
      Name: "DatabaseParameterGroup",
    },
  }
);

// RDS Database Instance
const database = new aws.rds.Instance("Database", {
  engine: "postgres",
  instanceClass: "db.t3.micro",
  identifierPrefix: "limelease-db-",
  dbName: "lime_lease_prod",
  allocatedStorage: 20,
  maxAllocatedStorage: 100,
  storageType: "gp2",
  username: "postgres",
  password: "postgres", // In production, use Pulumi config or AWS Secrets Manager
  skipFinalSnapshot: true,
  vpcSecurityGroupIds: [dbSecurityGroup.id],
  dbSubnetGroupName: dbSubnetGroup.name,
  parameterGroupName: databaseParameterGroup.name,
  tags: {
    Name: "LimeLeaseDatabase",
  },
});

// ECR Repository
const apiRepository = new aws.ecr.Repository("ElixirApiRepository", {
  name: "elixir-api",
  imageScanningConfiguration: {
    scanOnPush: true,
  },
  imageTagMutability: "MUTABLE",
  tags: {
    Name: "ElixirApiRepository",
  },
});

// ECS Execution Role
const ecsTaskExecutionRole = new aws.iam.Role("EcsTaskExecutionRole", {
  assumeRolePolicy: JSON.stringify({
    Version: "2012-10-17",
    Statement: [
      {
        Action: "sts:AssumeRole",
        Effect: "Allow",
        Principal: {
          Service: "ecs-tasks.amazonaws.com",
        },
      },
    ],
  }),
  tags: {
    Name: "EcsTaskExecutionRole",
  },
});

// Attach the Amazon ECS Task Execution Role policy
const taskExecutionRolePolicyAttachment = new aws.iam.RolePolicyAttachment(
  "TaskExecutionRolePolicyAttachment",
  {
    role: ecsTaskExecutionRole.name,
    policyArn:
      "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy",
  }
);

// Custom policy for additional permissions
const customPolicy = new aws.iam.Policy("CustomEcsPolicy", {
  description: "Custom policy for ECS tasks",
  policy: JSON.stringify({
    Version: "2012-10-17",
    Statement: [
      {
        Effect: "Allow",
        Action: [
          "ecr:GetAuthorizationToken",
          "ecr:BatchCheckLayerAvailability",
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchGetImage",
        ],
        Resource: "*",
      },
    ],
  }),
  tags: {
    Name: "CustomEcsPolicy",
  },
});

// Attach custom policy to the role
const customPolicyAttachment = new aws.iam.RolePolicyAttachment(
  "CustomPolicyAttachment",
  {
    role: ecsTaskExecutionRole.name,
    policyArn: customPolicy.arn,
  }
);

// CloudWatch Log Group
const logGroup = new aws.cloudwatch.LogGroup("ElixirApiLogGroup", {
  name: "/ecs/ElixirApi",
  retentionInDays: 30,
  tags: {
    Name: "ElixirApiLogGroup",
  },
});

// ECS Task Definition
const taskDefinition = new aws.ecs.TaskDefinition("ElixirApiECSTask", {
  family: "elixir-ecs-tasks",
  cpu: "256",
  memory: "512",
  networkMode: "awsvpc",
  requiresCompatibilities: ["FARGATE"],
  executionRoleArn: ecsTaskExecutionRole.arn,
  containerDefinitions: pulumi
    .all([database.endpoint, database.dbName, apiRepository.repositoryUrl])
    .apply(([endpoint, dbName, repoUrl]) => {
      return JSON.stringify([
        {
          name: "elixir-api",
          image: `${repoUrl}:latest`,
          portMappings: [
            {
              containerPort: 80,
              hostPort: 80,
              protocol: "tcp",
            },
          ],
          logConfiguration: {
            logDriver: "awslogs",
            options: {
              "awslogs-group": logGroup.name,
              "awslogs-region": "ap-southeast-2",
              "awslogs-stream-prefix": "elixir-api",
            },
          },
          environment: [
            {
              name: "DATABASE_URL",
              value: pulumi.interpolate`postgres://postgres:postgres@${endpoint}:5432/${dbName}`,
            },
            {
              name: "PORT",
              value: "80",
            },
            {
              name: "SECRET_KEY_BASE",
              value: "your-secret-key-base", // Use Pulumi config or AWS Secrets Manager in production
            },
          ],
          essential: true,
        },
      ]);
    }),
  tags: {
    Name: "ElixirApiECSTask",
  },
});

// ECS Cluster
const cluster = new aws.ecs.Cluster("ElixirApiCluster", {
  name: "elixir-api-cluster",
  settings: [
    {
      name: "containerInsights",
      value: "enabled",
    },
  ],
  tags: {
    Name: "ElixirApiCluster",
  },
});

// ECS Service
const service = new aws.ecs.Service("ElixirApiService", {
  cluster: cluster.arn,
  taskDefinition: taskDefinition.arn,
  desiredCount: 1,
  launchType: "FARGATE",
  networkConfiguration: {
    subnets: [privateSubnet1.id, privateSubnet2.id],
    securityGroups: [apiSecurityGroup.id],
    assignPublicIp: false,
  },
  tags: {
    Name: "ElixirApiService",
  },
});

// API Gateway v2 (HTTP API)
const apiGateway = new aws.apigatewayv2.Api("ElixirApi", {
  protocolType: "HTTP",
  name: "elixir-api",
  tags: {
    Name: "ElixirApi",
  },
});

// VPC Link for API Gateway
const vpcLink = new aws.apigatewayv2.VpcLink("ApiVpcLink", {
  name: "elixir-api-vpc-link",
  subnetIds: [privateSubnet1.id, privateSubnet2.id],
  securityGroupIds: [apiSecurityGroup.id],
  tags: {
    Name: "ApiVpcLink",
  },
});

// API Gateway Integration with VPC Link
const integration = new aws.apigatewayv2.Integration("ApiIntegration", {
  apiId: apiGateway.id,
  integrationType: "HTTP_PROXY",
  integrationMethod: "ANY",
  integrationUri: pulumi.interpolate`http://${service.name}.${cluster.name}.internal`,
  connectionType: "VPC_LINK",
  connectionId: vpcLink.id,
  payloadFormatVersion: "1.0",
});

// API Gateway Route
const route = new aws.apigatewayv2.Route("ApiRoute", {
  apiId: apiGateway.id,
  routeKey: "ANY /{proxy+}",
  target: pulumi.interpolate`integrations/${integration.id}`,
});

// API Gateway Stage
const stage = new aws.apigatewayv2.Stage("ApiStage", {
  apiId: apiGateway.id,
  name: "$default",
  autoDeploy: true,
});

// Export the outputs
export const vpcId = vpc.id;
export const bucketName = bucket.id;
export const databaseEndpoint = database.endpoint;
export const apiEndpoint = apiGateway.apiEndpoint;
export const ecrRepositoryUrl = apiRepository.repositoryUrl;
