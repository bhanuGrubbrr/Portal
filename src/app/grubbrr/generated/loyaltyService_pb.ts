/* eslint-disable */
// @generated by protobuf-ts 2.9.0 with parameter ts_nocheck,eslint_disable,add_pb_suffix,long_type_string,generate_dependencies
// @generated from protobuf file "loyaltyService.proto" (package "Mgmt", syntax proto3)
// tslint:disable
// @ts-nocheck
import { DiscountTendersVM } from "./loyalty_pb";
import { LocationLoyaltyConfigRequest } from "./loyalty_pb";
import { LoyaltyIntegrationConfigVM } from "./loyalty_pb";
import { LocationRequest } from "./common_pb";
import { EmptyResponse } from "./common_pb";
import { RemoveIntegrationRequest } from "./loyalty_pb";
import { LoyaltyIntegrationDefinitionVM } from "./loyalty_pb";
import { LoyaltyIntegrationDefinitionsVM } from "./loyalty_pb";
import { EmptyRequest } from "./common_pb";
import { ServiceType } from "@protobuf-ts/runtime-rpc";
/**
 * @generated ServiceType for protobuf service Mgmt.LoyaltyService
 */
export const LoyaltyService = new ServiceType("Mgmt.LoyaltyService", [
    { name: "GetIntegrationDefinitions", options: {}, I: EmptyRequest, O: LoyaltyIntegrationDefinitionsVM },
    { name: "UpsertIntegrationDefinition", options: {}, I: LoyaltyIntegrationDefinitionVM, O: LoyaltyIntegrationDefinitionVM },
    { name: "RemoveIntegrationDefinition", options: {}, I: RemoveIntegrationRequest, O: EmptyResponse },
    { name: "GetLocationConfig", options: {}, I: LocationRequest, O: LoyaltyIntegrationConfigVM },
    { name: "UpdateLocationConfig", options: {}, I: LocationLoyaltyConfigRequest, O: LoyaltyIntegrationConfigVM },
    { name: "GetDiscountTenders", options: {}, I: LocationRequest, O: DiscountTendersVM }
]);
