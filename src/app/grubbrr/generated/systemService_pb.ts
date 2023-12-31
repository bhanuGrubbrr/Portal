/* eslint-disable */
// @generated by protobuf-ts 2.9.0 with parameter ts_nocheck,eslint_disable,add_pb_suffix,long_type_string,generate_dependencies
// @generated from protobuf file "systemService.proto" (package "Mgmt", syntax proto3)
// tslint:disable
// @ts-nocheck
import { PosSyncTypeVM } from "./system_pb";
import { PosSyncMetaRequest } from "./system_pb";
import { PosSyncIntegrationDefinitionVM } from "./system_pb";
import { PosSyncMetaRecordVM } from "./system_pb";
import { PaymentSettingsVM } from "./system_pb";
import { PosSettingsVM } from "./system_pb";
import { LocaleOptionsVM } from "./system_pb";
import { CurrencyOptionsVM } from "./system_pb";
import { EmptyRequest } from "./common_pb";
import { ServiceType } from "@protobuf-ts/runtime-rpc";
/**
 * @generated ServiceType for protobuf service Mgmt.SystemService
 */
export const SystemService = new ServiceType("Mgmt.SystemService", [
    { name: "GetCurrencyOptions", options: {}, I: EmptyRequest, O: CurrencyOptionsVM },
    { name: "GetLocaleOptions", options: {}, I: EmptyRequest, O: LocaleOptionsVM },
    { name: "GetPosSettings", options: {}, I: EmptyRequest, O: PosSettingsVM },
    { name: "GetPaymentSettings", options: {}, I: EmptyRequest, O: PaymentSettingsVM },
    { name: "GetPosSyncMetaRecordAsync", options: {}, I: EmptyRequest, O: PosSyncMetaRecordVM },
    { name: "GetPosSyncDefinition", options: {}, I: EmptyRequest, O: PosSyncIntegrationDefinitionVM },
    { name: "AddPosSyncType", options: {}, I: PosSyncMetaRequest, O: PosSyncTypeVM }
]);
