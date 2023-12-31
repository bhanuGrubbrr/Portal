/* eslint-disable */
// @generated by protobuf-ts 2.9.0 with parameter ts_nocheck,eslint_disable,add_pb_suffix,long_type_string,generate_dependencies
// @generated from protobuf file "appearanceService.proto" (package "Mgmt", syntax proto3)
// tslint:disable
// @ts-nocheck
import type { RpcTransport } from "@protobuf-ts/runtime-rpc";
import type { ServiceInfo } from "@protobuf-ts/runtime-rpc";
import { AppearanceService } from "./appearanceService_pb";
import type { ReceiptSettingsRequest } from "./appearanceService_pb";
import type { ReceiptSettingsVM } from "./appearance_pb";
import type { RemoveScreensaverRequest } from "./appearanceService_pb";
import type { AppearanceMediaAssetVM } from "./appearance_pb";
import type { AddScreensaverRequest } from "./appearanceService_pb";
import type { AnimationsVM } from "./appearance_pb";
import type { UpdateTemplateAnimationsRequest } from "./appearanceService_pb";
import type { TemplateImagesVM } from "./appearance_pb";
import type { UpdateTemplateImagesRequest } from "./appearanceService_pb";
import type { TemplateSettingsVM } from "./appearance_pb";
import type { UpdateTemplateSettingsRequest } from "./appearanceService_pb";
import type { TemplateLanguageTextVM } from "./appearance_pb";
import type { UpdateTemplateTextOverridesRequest } from "./appearanceService_pb";
import type { TemplateConfigVM } from "./appearance_pb";
import type { LoyaltyColorsRequest } from "./appearanceService_pb";
import type { ColorsRequest } from "./appearanceService_pb";
import type { LoyaltyColorsVM } from "./appearance_pb";
import { stackIntercept } from "@protobuf-ts/runtime-rpc";
import type { KioskColorsVM } from "./appearance_pb";
import type { LocationRequest } from "./common_pb";
import type { UnaryCall } from "@protobuf-ts/runtime-rpc";
import type { RpcOptions } from "@protobuf-ts/runtime-rpc";
/**
 * @generated from protobuf service Mgmt.AppearanceService
 */
export interface IAppearanceServiceClient {
    /**
     * @generated from protobuf rpc: GetColors(Mgmt.LocationRequest) returns (Mgmt.KioskColorsVM);
     */
    getColors(input: LocationRequest, options?: RpcOptions): UnaryCall<LocationRequest, KioskColorsVM>;
    /**
     * @generated from protobuf rpc: GetLoyaltyColors(Mgmt.LocationRequest) returns (Mgmt.LoyaltyColorsVM);
     */
    getLoyaltyColors(input: LocationRequest, options?: RpcOptions): UnaryCall<LocationRequest, LoyaltyColorsVM>;
    /**
     * @generated from protobuf rpc: UpsertColors(Mgmt.ColorsRequest) returns (Mgmt.KioskColorsVM);
     */
    upsertColors(input: ColorsRequest, options?: RpcOptions): UnaryCall<ColorsRequest, KioskColorsVM>;
    /**
     * @generated from protobuf rpc: UpsertLoyaltyColors(Mgmt.LoyaltyColorsRequest) returns (Mgmt.LoyaltyColorsVM);
     */
    upsertLoyaltyColors(input: LoyaltyColorsRequest, options?: RpcOptions): UnaryCall<LoyaltyColorsRequest, LoyaltyColorsVM>;
    /**
     * @generated from protobuf rpc: GetTemplateConfig(Mgmt.LocationRequest) returns (Mgmt.TemplateConfigVM);
     */
    getTemplateConfig(input: LocationRequest, options?: RpcOptions): UnaryCall<LocationRequest, TemplateConfigVM>;
    /**
     * @generated from protobuf rpc: UpdateTemplateTextOverrides(Mgmt.UpdateTemplateTextOverridesRequest) returns (Mgmt.TemplateLanguageTextVM);
     */
    updateTemplateTextOverrides(input: UpdateTemplateTextOverridesRequest, options?: RpcOptions): UnaryCall<UpdateTemplateTextOverridesRequest, TemplateLanguageTextVM>;
    /**
     * @generated from protobuf rpc: UpdateTemplateSettings(Mgmt.UpdateTemplateSettingsRequest) returns (Mgmt.TemplateSettingsVM);
     */
    updateTemplateSettings(input: UpdateTemplateSettingsRequest, options?: RpcOptions): UnaryCall<UpdateTemplateSettingsRequest, TemplateSettingsVM>;
    /**
     * @generated from protobuf rpc: UpdateTemplateImages(Mgmt.UpdateTemplateImagesRequest) returns (Mgmt.TemplateImagesVM);
     */
    updateTemplateImages(input: UpdateTemplateImagesRequest, options?: RpcOptions): UnaryCall<UpdateTemplateImagesRequest, TemplateImagesVM>;
    /**
     * @generated from protobuf rpc: UpdateTemplateAnimations(Mgmt.UpdateTemplateAnimationsRequest) returns (Mgmt.AnimationsVM);
     */
    updateTemplateAnimations(input: UpdateTemplateAnimationsRequest, options?: RpcOptions): UnaryCall<UpdateTemplateAnimationsRequest, AnimationsVM>;
    /**
     * @generated from protobuf rpc: AddScreensaver(Mgmt.AddScreensaverRequest) returns (Mgmt.AppearanceMediaAssetVM);
     */
    addScreensaver(input: AddScreensaverRequest, options?: RpcOptions): UnaryCall<AddScreensaverRequest, AppearanceMediaAssetVM>;
    /**
     * @generated from protobuf rpc: RemoveScreensaver(Mgmt.RemoveScreensaverRequest) returns (Mgmt.AppearanceMediaAssetVM);
     */
    removeScreensaver(input: RemoveScreensaverRequest, options?: RpcOptions): UnaryCall<RemoveScreensaverRequest, AppearanceMediaAssetVM>;
    /**
     * @generated from protobuf rpc: GetReceiptSettings(Mgmt.LocationRequest) returns (Mgmt.ReceiptSettingsVM);
     */
    getReceiptSettings(input: LocationRequest, options?: RpcOptions): UnaryCall<LocationRequest, ReceiptSettingsVM>;
    /**
     * @generated from protobuf rpc: UpsertReceiptSettings(Mgmt.ReceiptSettingsRequest) returns (Mgmt.ReceiptSettingsVM);
     */
    upsertReceiptSettings(input: ReceiptSettingsRequest, options?: RpcOptions): UnaryCall<ReceiptSettingsRequest, ReceiptSettingsVM>;
}
/**
 * @generated from protobuf service Mgmt.AppearanceService
 */
export class AppearanceServiceClient implements IAppearanceServiceClient, ServiceInfo {
    typeName = AppearanceService.typeName;
    methods = AppearanceService.methods;
    options = AppearanceService.options;
    constructor(private readonly _transport: RpcTransport) {
    }
    /**
     * @generated from protobuf rpc: GetColors(Mgmt.LocationRequest) returns (Mgmt.KioskColorsVM);
     */
    getColors(input: LocationRequest, options?: RpcOptions): UnaryCall<LocationRequest, KioskColorsVM> {
        const method = this.methods[0], opt = this._transport.mergeOptions(options);
        return stackIntercept<LocationRequest, KioskColorsVM>("unary", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: GetLoyaltyColors(Mgmt.LocationRequest) returns (Mgmt.LoyaltyColorsVM);
     */
    getLoyaltyColors(input: LocationRequest, options?: RpcOptions): UnaryCall<LocationRequest, LoyaltyColorsVM> {
        const method = this.methods[1], opt = this._transport.mergeOptions(options);
        return stackIntercept<LocationRequest, LoyaltyColorsVM>("unary", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: UpsertColors(Mgmt.ColorsRequest) returns (Mgmt.KioskColorsVM);
     */
    upsertColors(input: ColorsRequest, options?: RpcOptions): UnaryCall<ColorsRequest, KioskColorsVM> {
        const method = this.methods[2], opt = this._transport.mergeOptions(options);
        return stackIntercept<ColorsRequest, KioskColorsVM>("unary", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: UpsertLoyaltyColors(Mgmt.LoyaltyColorsRequest) returns (Mgmt.LoyaltyColorsVM);
     */
    upsertLoyaltyColors(input: LoyaltyColorsRequest, options?: RpcOptions): UnaryCall<LoyaltyColorsRequest, LoyaltyColorsVM> {
        const method = this.methods[3], opt = this._transport.mergeOptions(options);
        return stackIntercept<LoyaltyColorsRequest, LoyaltyColorsVM>("unary", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: GetTemplateConfig(Mgmt.LocationRequest) returns (Mgmt.TemplateConfigVM);
     */
    getTemplateConfig(input: LocationRequest, options?: RpcOptions): UnaryCall<LocationRequest, TemplateConfigVM> {
        const method = this.methods[4], opt = this._transport.mergeOptions(options);
        return stackIntercept<LocationRequest, TemplateConfigVM>("unary", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: UpdateTemplateTextOverrides(Mgmt.UpdateTemplateTextOverridesRequest) returns (Mgmt.TemplateLanguageTextVM);
     */
    updateTemplateTextOverrides(input: UpdateTemplateTextOverridesRequest, options?: RpcOptions): UnaryCall<UpdateTemplateTextOverridesRequest, TemplateLanguageTextVM> {
        const method = this.methods[5], opt = this._transport.mergeOptions(options);
        return stackIntercept<UpdateTemplateTextOverridesRequest, TemplateLanguageTextVM>("unary", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: UpdateTemplateSettings(Mgmt.UpdateTemplateSettingsRequest) returns (Mgmt.TemplateSettingsVM);
     */
    updateTemplateSettings(input: UpdateTemplateSettingsRequest, options?: RpcOptions): UnaryCall<UpdateTemplateSettingsRequest, TemplateSettingsVM> {
        const method = this.methods[6], opt = this._transport.mergeOptions(options);
        return stackIntercept<UpdateTemplateSettingsRequest, TemplateSettingsVM>("unary", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: UpdateTemplateImages(Mgmt.UpdateTemplateImagesRequest) returns (Mgmt.TemplateImagesVM);
     */
    updateTemplateImages(input: UpdateTemplateImagesRequest, options?: RpcOptions): UnaryCall<UpdateTemplateImagesRequest, TemplateImagesVM> {
        const method = this.methods[7], opt = this._transport.mergeOptions(options);
        return stackIntercept<UpdateTemplateImagesRequest, TemplateImagesVM>("unary", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: UpdateTemplateAnimations(Mgmt.UpdateTemplateAnimationsRequest) returns (Mgmt.AnimationsVM);
     */
    updateTemplateAnimations(input: UpdateTemplateAnimationsRequest, options?: RpcOptions): UnaryCall<UpdateTemplateAnimationsRequest, AnimationsVM> {
        const method = this.methods[8], opt = this._transport.mergeOptions(options);
        return stackIntercept<UpdateTemplateAnimationsRequest, AnimationsVM>("unary", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: AddScreensaver(Mgmt.AddScreensaverRequest) returns (Mgmt.AppearanceMediaAssetVM);
     */
    addScreensaver(input: AddScreensaverRequest, options?: RpcOptions): UnaryCall<AddScreensaverRequest, AppearanceMediaAssetVM> {
        const method = this.methods[9], opt = this._transport.mergeOptions(options);
        return stackIntercept<AddScreensaverRequest, AppearanceMediaAssetVM>("unary", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: RemoveScreensaver(Mgmt.RemoveScreensaverRequest) returns (Mgmt.AppearanceMediaAssetVM);
     */
    removeScreensaver(input: RemoveScreensaverRequest, options?: RpcOptions): UnaryCall<RemoveScreensaverRequest, AppearanceMediaAssetVM> {
        const method = this.methods[10], opt = this._transport.mergeOptions(options);
        return stackIntercept<RemoveScreensaverRequest, AppearanceMediaAssetVM>("unary", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: GetReceiptSettings(Mgmt.LocationRequest) returns (Mgmt.ReceiptSettingsVM);
     */
    getReceiptSettings(input: LocationRequest, options?: RpcOptions): UnaryCall<LocationRequest, ReceiptSettingsVM> {
        const method = this.methods[11], opt = this._transport.mergeOptions(options);
        return stackIntercept<LocationRequest, ReceiptSettingsVM>("unary", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: UpsertReceiptSettings(Mgmt.ReceiptSettingsRequest) returns (Mgmt.ReceiptSettingsVM);
     */
    upsertReceiptSettings(input: ReceiptSettingsRequest, options?: RpcOptions): UnaryCall<ReceiptSettingsRequest, ReceiptSettingsVM> {
        const method = this.methods[12], opt = this._transport.mergeOptions(options);
        return stackIntercept<ReceiptSettingsRequest, ReceiptSettingsVM>("unary", this._transport, method, opt, input);
    }
}
