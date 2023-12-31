/* eslint-disable */
// @generated by protobuf-ts 2.9.0 with parameter ts_nocheck,eslint_disable,add_pb_suffix,long_type_string,generate_dependencies
// @generated from protobuf file "workflowMonitorService.proto" (package "Mgmt", syntax proto3)
// tslint:disable
// @ts-nocheck
import type { RpcTransport } from "@protobuf-ts/runtime-rpc";
import type { ServiceInfo } from "@protobuf-ts/runtime-rpc";
import { WorkflowMonitorService } from "./workflowMonitorService_pb";
import type { UpdateWorkflowMonitorDeviceRequest } from "./workflowMonitorService_pb";
import type { EmptyResponse } from "./common_pb";
import type { WorkflowMonitorVM } from "./workflowMonitor_pb";
import type { AddWorkflowMonitorRequest } from "./workflowMonitorService_pb";
import type { DeviceLocationResponse } from "./common_pb";
import type { DeviceLocationRequest } from "./common_pb";
import { stackIntercept } from "@protobuf-ts/runtime-rpc";
import type { WorkflowMonitorsVM } from "./workflowMonitor_pb";
import type { LocationRequest } from "./common_pb";
import type { UnaryCall } from "@protobuf-ts/runtime-rpc";
import type { RpcOptions } from "@protobuf-ts/runtime-rpc";
/**
 * @generated from protobuf service Mgmt.WorkflowMonitorService
 */
export interface IWorkflowMonitorServiceClient {
    /**
     * @generated from protobuf rpc: GetWorkflowMonitors(Mgmt.LocationRequest) returns (Mgmt.WorkflowMonitorsVM);
     */
    getWorkflowMonitors(input: LocationRequest, options?: RpcOptions): UnaryCall<LocationRequest, WorkflowMonitorsVM>;
    /**
     * @generated from protobuf rpc: GetWorkflowMonitorOTP(Mgmt.DeviceLocationRequest) returns (Mgmt.DeviceLocationResponse);
     */
    getWorkflowMonitorOTP(input: DeviceLocationRequest, options?: RpcOptions): UnaryCall<DeviceLocationRequest, DeviceLocationResponse>;
    /**
     * @generated from protobuf rpc: AddWorkflowMonitor(Mgmt.AddWorkflowMonitorRequest) returns (Mgmt.WorkflowMonitorVM);
     */
    addWorkflowMonitor(input: AddWorkflowMonitorRequest, options?: RpcOptions): UnaryCall<AddWorkflowMonitorRequest, WorkflowMonitorVM>;
    /**
     * linking happens in kioskService
     *
     * @generated from protobuf rpc: UnlinkWorkflowMonitor(Mgmt.DeviceLocationRequest) returns (Mgmt.EmptyResponse);
     */
    unlinkWorkflowMonitor(input: DeviceLocationRequest, options?: RpcOptions): UnaryCall<DeviceLocationRequest, EmptyResponse>;
    /**
     * @generated from protobuf rpc: UpdateWorkflowMonitor(Mgmt.UpdateWorkflowMonitorDeviceRequest) returns (Mgmt.WorkflowMonitorVM);
     */
    updateWorkflowMonitor(input: UpdateWorkflowMonitorDeviceRequest, options?: RpcOptions): UnaryCall<UpdateWorkflowMonitorDeviceRequest, WorkflowMonitorVM>;
    /**
     * @generated from protobuf rpc: RemoveWorkflowMonitor(Mgmt.DeviceLocationRequest) returns (Mgmt.EmptyResponse);
     */
    removeWorkflowMonitor(input: DeviceLocationRequest, options?: RpcOptions): UnaryCall<DeviceLocationRequest, EmptyResponse>;
}
/**
 * @generated from protobuf service Mgmt.WorkflowMonitorService
 */
export class WorkflowMonitorServiceClient implements IWorkflowMonitorServiceClient, ServiceInfo {
    typeName = WorkflowMonitorService.typeName;
    methods = WorkflowMonitorService.methods;
    options = WorkflowMonitorService.options;
    constructor(private readonly _transport: RpcTransport) {
    }
    /**
     * @generated from protobuf rpc: GetWorkflowMonitors(Mgmt.LocationRequest) returns (Mgmt.WorkflowMonitorsVM);
     */
    getWorkflowMonitors(input: LocationRequest, options?: RpcOptions): UnaryCall<LocationRequest, WorkflowMonitorsVM> {
        const method = this.methods[0], opt = this._transport.mergeOptions(options);
        return stackIntercept<LocationRequest, WorkflowMonitorsVM>("unary", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: GetWorkflowMonitorOTP(Mgmt.DeviceLocationRequest) returns (Mgmt.DeviceLocationResponse);
     */
    getWorkflowMonitorOTP(input: DeviceLocationRequest, options?: RpcOptions): UnaryCall<DeviceLocationRequest, DeviceLocationResponse> {
        const method = this.methods[1], opt = this._transport.mergeOptions(options);
        return stackIntercept<DeviceLocationRequest, DeviceLocationResponse>("unary", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: AddWorkflowMonitor(Mgmt.AddWorkflowMonitorRequest) returns (Mgmt.WorkflowMonitorVM);
     */
    addWorkflowMonitor(input: AddWorkflowMonitorRequest, options?: RpcOptions): UnaryCall<AddWorkflowMonitorRequest, WorkflowMonitorVM> {
        const method = this.methods[2], opt = this._transport.mergeOptions(options);
        return stackIntercept<AddWorkflowMonitorRequest, WorkflowMonitorVM>("unary", this._transport, method, opt, input);
    }
    /**
     * linking happens in kioskService
     *
     * @generated from protobuf rpc: UnlinkWorkflowMonitor(Mgmt.DeviceLocationRequest) returns (Mgmt.EmptyResponse);
     */
    unlinkWorkflowMonitor(input: DeviceLocationRequest, options?: RpcOptions): UnaryCall<DeviceLocationRequest, EmptyResponse> {
        const method = this.methods[3], opt = this._transport.mergeOptions(options);
        return stackIntercept<DeviceLocationRequest, EmptyResponse>("unary", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: UpdateWorkflowMonitor(Mgmt.UpdateWorkflowMonitorDeviceRequest) returns (Mgmt.WorkflowMonitorVM);
     */
    updateWorkflowMonitor(input: UpdateWorkflowMonitorDeviceRequest, options?: RpcOptions): UnaryCall<UpdateWorkflowMonitorDeviceRequest, WorkflowMonitorVM> {
        const method = this.methods[4], opt = this._transport.mergeOptions(options);
        return stackIntercept<UpdateWorkflowMonitorDeviceRequest, WorkflowMonitorVM>("unary", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: RemoveWorkflowMonitor(Mgmt.DeviceLocationRequest) returns (Mgmt.EmptyResponse);
     */
    removeWorkflowMonitor(input: DeviceLocationRequest, options?: RpcOptions): UnaryCall<DeviceLocationRequest, EmptyResponse> {
        const method = this.methods[5], opt = this._transport.mergeOptions(options);
        return stackIntercept<DeviceLocationRequest, EmptyResponse>("unary", this._transport, method, opt, input);
    }
}
