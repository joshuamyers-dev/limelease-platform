/* tslint:disable */
/* eslint-disable */
import "sst"
declare module "sst" {
  export interface Resource {
    Services: {
      type: "sst.aws.ApiGatewayV2"
      url: string
    }
    Storage: {
      name: string
      type: "sst.aws.Bucket"
    }
  }
}
export {}