/* eslint-disable */
// @generated by protobuf-ts 2.9.0 with parameter ts_nocheck,eslint_disable,add_pb_suffix,long_type_string,generate_dependencies
// @generated from protobuf file "paymentService.proto" (package "Mgmt", syntax proto3)
// tslint:disable
// @ts-nocheck
import { EmptyResponse } from "./common_pb";
import { PaymentIntegrationConfigListVM } from "./payment_pb";
import { PaymentTendersVM } from "./payment_pb";
import { PaymentIntegrationsVM } from "./payment_pb";
import { LocationRequest } from "./common_pb";
import { ServiceType } from "@protobuf-ts/runtime-rpc";
import type { BinaryWriteOptions } from "@protobuf-ts/runtime";
import type { IBinaryWriter } from "@protobuf-ts/runtime";
import { WireType } from "@protobuf-ts/runtime";
import type { BinaryReadOptions } from "@protobuf-ts/runtime";
import type { IBinaryReader } from "@protobuf-ts/runtime";
import { UnknownFieldHandler } from "@protobuf-ts/runtime";
import type { PartialMessage } from "@protobuf-ts/runtime";
import { reflectionMergePartial } from "@protobuf-ts/runtime";
import { MESSAGE_TYPE } from "@protobuf-ts/runtime";
import { MessageType } from "@protobuf-ts/runtime";
import { KioskPaymentConfigVM } from "./payment_pb";
import { PaymentIntegrationConfigVM } from "./payment_pb";
/**
 * @generated from protobuf message Mgmt.KioskRequest
 */
export interface KioskRequest {
    /**
     * @generated from protobuf field: string locationId = 1;
     */
    locationId: string;
    /**
     * @generated from protobuf field: string kioskId = 2;
     */
    kioskId: string;
}
/**
 * @generated from protobuf message Mgmt.PaymentRequest
 */
export interface PaymentRequest {
    /**
     * @generated from protobuf field: string locationId = 1;
     */
    locationId: string;
    /**
     * @generated from protobuf field: string paymentIntegrationId = 2;
     */
    paymentIntegrationId: string;
}
/**
 * @generated from protobuf message Mgmt.LocationPaymentConfigRequest
 */
export interface LocationPaymentConfigRequest {
    /**
     * @generated from protobuf field: string locationId = 1;
     */
    locationId: string;
    /**
     * @generated from protobuf field: Mgmt.PaymentIntegrationConfigVM config = 2;
     */
    config?: PaymentIntegrationConfigVM;
    /**
     * @generated from protobuf field: string defaultPaymentTender = 3;
     */
    defaultPaymentTender: string;
    /**
     * @generated from protobuf field: optional bool enableAmazonOnePay = 4;
     */
    enableAmazonOnePay?: boolean;
}
/**
 * @generated from protobuf message Mgmt.UpdateKioskPaymentConfigRequest
 */
export interface UpdateKioskPaymentConfigRequest {
    /**
     * @generated from protobuf field: string locationId = 1;
     */
    locationId: string;
    /**
     * @generated from protobuf field: string kioskId = 2;
     */
    kioskId: string;
    /**
     * @generated from protobuf field: Mgmt.KioskPaymentConfigVM config = 3;
     */
    config?: KioskPaymentConfigVM;
}
// @generated message type with reflection information, may provide speed optimized methods
class KioskRequest$Type extends MessageType<KioskRequest> {
    constructor() {
        super("Mgmt.KioskRequest", [
            { no: 1, name: "locationId", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "kioskId", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
    create(value?: PartialMessage<KioskRequest>): KioskRequest {
        const message = { locationId: "", kioskId: "" };
        globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            reflectionMergePartial<KioskRequest>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: KioskRequest): KioskRequest {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* string locationId */ 1:
                    message.locationId = reader.string();
                    break;
                case /* string kioskId */ 2:
                    message.kioskId = reader.string();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message: KioskRequest, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* string locationId = 1; */
        if (message.locationId !== "")
            writer.tag(1, WireType.LengthDelimited).string(message.locationId);
        /* string kioskId = 2; */
        if (message.kioskId !== "")
            writer.tag(2, WireType.LengthDelimited).string(message.kioskId);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message Mgmt.KioskRequest
 */
export const KioskRequest = new KioskRequest$Type();
// @generated message type with reflection information, may provide speed optimized methods
class PaymentRequest$Type extends MessageType<PaymentRequest> {
    constructor() {
        super("Mgmt.PaymentRequest", [
            { no: 1, name: "locationId", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "paymentIntegrationId", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
    create(value?: PartialMessage<PaymentRequest>): PaymentRequest {
        const message = { locationId: "", paymentIntegrationId: "" };
        globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            reflectionMergePartial<PaymentRequest>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: PaymentRequest): PaymentRequest {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* string locationId */ 1:
                    message.locationId = reader.string();
                    break;
                case /* string paymentIntegrationId */ 2:
                    message.paymentIntegrationId = reader.string();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message: PaymentRequest, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* string locationId = 1; */
        if (message.locationId !== "")
            writer.tag(1, WireType.LengthDelimited).string(message.locationId);
        /* string paymentIntegrationId = 2; */
        if (message.paymentIntegrationId !== "")
            writer.tag(2, WireType.LengthDelimited).string(message.paymentIntegrationId);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message Mgmt.PaymentRequest
 */
export const PaymentRequest = new PaymentRequest$Type();
// @generated message type with reflection information, may provide speed optimized methods
class LocationPaymentConfigRequest$Type extends MessageType<LocationPaymentConfigRequest> {
    constructor() {
        super("Mgmt.LocationPaymentConfigRequest", [
            { no: 1, name: "locationId", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "config", kind: "message", T: () => PaymentIntegrationConfigVM },
            { no: 3, name: "defaultPaymentTender", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 4, name: "enableAmazonOnePay", kind: "scalar", opt: true, T: 8 /*ScalarType.BOOL*/ }
        ]);
    }
    create(value?: PartialMessage<LocationPaymentConfigRequest>): LocationPaymentConfigRequest {
        const message = { locationId: "", defaultPaymentTender: "" };
        globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            reflectionMergePartial<LocationPaymentConfigRequest>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: LocationPaymentConfigRequest): LocationPaymentConfigRequest {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* string locationId */ 1:
                    message.locationId = reader.string();
                    break;
                case /* Mgmt.PaymentIntegrationConfigVM config */ 2:
                    message.config = PaymentIntegrationConfigVM.internalBinaryRead(reader, reader.uint32(), options, message.config);
                    break;
                case /* string defaultPaymentTender */ 3:
                    message.defaultPaymentTender = reader.string();
                    break;
                case /* optional bool enableAmazonOnePay */ 4:
                    message.enableAmazonOnePay = reader.bool();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message: LocationPaymentConfigRequest, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* string locationId = 1; */
        if (message.locationId !== "")
            writer.tag(1, WireType.LengthDelimited).string(message.locationId);
        /* Mgmt.PaymentIntegrationConfigVM config = 2; */
        if (message.config)
            PaymentIntegrationConfigVM.internalBinaryWrite(message.config, writer.tag(2, WireType.LengthDelimited).fork(), options).join();
        /* string defaultPaymentTender = 3; */
        if (message.defaultPaymentTender !== "")
            writer.tag(3, WireType.LengthDelimited).string(message.defaultPaymentTender);
        /* optional bool enableAmazonOnePay = 4; */
        if (message.enableAmazonOnePay !== undefined)
            writer.tag(4, WireType.Varint).bool(message.enableAmazonOnePay);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message Mgmt.LocationPaymentConfigRequest
 */
export const LocationPaymentConfigRequest = new LocationPaymentConfigRequest$Type();
// @generated message type with reflection information, may provide speed optimized methods
class UpdateKioskPaymentConfigRequest$Type extends MessageType<UpdateKioskPaymentConfigRequest> {
    constructor() {
        super("Mgmt.UpdateKioskPaymentConfigRequest", [
            { no: 1, name: "locationId", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "kioskId", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 3, name: "config", kind: "message", T: () => KioskPaymentConfigVM }
        ]);
    }
    create(value?: PartialMessage<UpdateKioskPaymentConfigRequest>): UpdateKioskPaymentConfigRequest {
        const message = { locationId: "", kioskId: "" };
        globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            reflectionMergePartial<UpdateKioskPaymentConfigRequest>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: UpdateKioskPaymentConfigRequest): UpdateKioskPaymentConfigRequest {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* string locationId */ 1:
                    message.locationId = reader.string();
                    break;
                case /* string kioskId */ 2:
                    message.kioskId = reader.string();
                    break;
                case /* Mgmt.KioskPaymentConfigVM config */ 3:
                    message.config = KioskPaymentConfigVM.internalBinaryRead(reader, reader.uint32(), options, message.config);
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message: UpdateKioskPaymentConfigRequest, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* string locationId = 1; */
        if (message.locationId !== "")
            writer.tag(1, WireType.LengthDelimited).string(message.locationId);
        /* string kioskId = 2; */
        if (message.kioskId !== "")
            writer.tag(2, WireType.LengthDelimited).string(message.kioskId);
        /* Mgmt.KioskPaymentConfigVM config = 3; */
        if (message.config)
            KioskPaymentConfigVM.internalBinaryWrite(message.config, writer.tag(3, WireType.LengthDelimited).fork(), options).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message Mgmt.UpdateKioskPaymentConfigRequest
 */
export const UpdateKioskPaymentConfigRequest = new UpdateKioskPaymentConfigRequest$Type();
/**
 * @generated ServiceType for protobuf service Mgmt.PaymentService
 */
export const PaymentService = new ServiceType("Mgmt.PaymentService", [
    { name: "GetLocationPaymentIntegrations", options: {}, I: LocationRequest, O: PaymentIntegrationsVM },
    { name: "GetLocationPaymentTenders", options: {}, I: PaymentRequest, O: PaymentTendersVM },
    { name: "UpdateLocationPaymentIntegrationConfig", options: {}, I: LocationPaymentConfigRequest, O: PaymentIntegrationConfigVM },
    { name: "RemoveLocationPaymentIntegration", options: {}, I: PaymentRequest, O: PaymentIntegrationConfigListVM },
    { name: "GetKioskPaymentIntegrations", options: {}, I: KioskRequest, O: PaymentIntegrationsVM },
    { name: "UpdateKioskPaymentIntegrations", options: {}, I: UpdateKioskPaymentConfigRequest, O: EmptyResponse }
]);