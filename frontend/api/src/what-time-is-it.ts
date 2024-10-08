// @generated by protobuf-ts 2.9.4 with parameter optimize_code_size
// @generated from protobuf file "what-time-is-it.proto" (package "whattimeisit", syntax proto3)
// tslint:disable
import { ServiceType } from "@protobuf-ts/runtime-rpc";
import { MessageType } from "@protobuf-ts/runtime";
import { Timestamp } from "./google/protobuf/timestamp";
/**
 * @generated from protobuf message whattimeisit.WhatTimeIsItRightNowRequest
 */
export interface WhatTimeIsItRightNowRequest {
}
/**
 * @generated from protobuf message whattimeisit.WhatTimeIsItRightNowResponse
 */
export interface WhatTimeIsItRightNowResponse {
    /**
     * @generated from protobuf field: google.protobuf.Timestamp now = 1;
     */
    now?: Timestamp;
}
/**
 * @generated from protobuf message whattimeisit.WhatTimeIsItRightNowStreamRequest
 */
export interface WhatTimeIsItRightNowStreamRequest {
    /**
     * @generated from protobuf field: int32 freq_ms = 1;
     */
    freqMs: number;
}
/**
 * @generated from protobuf message whattimeisit.WhatTimeIsItRightNowStreamResponse
 */
export interface WhatTimeIsItRightNowStreamResponse {
    /**
     * @generated from protobuf field: google.protobuf.Timestamp now = 1;
     */
    now?: Timestamp;
}
// @generated message type with reflection information, may provide speed optimized methods
class WhatTimeIsItRightNowRequest$Type extends MessageType<WhatTimeIsItRightNowRequest> {
    constructor() {
        super("whattimeisit.WhatTimeIsItRightNowRequest", []);
    }
}
/**
 * @generated MessageType for protobuf message whattimeisit.WhatTimeIsItRightNowRequest
 */
export const WhatTimeIsItRightNowRequest = new WhatTimeIsItRightNowRequest$Type();
// @generated message type with reflection information, may provide speed optimized methods
class WhatTimeIsItRightNowResponse$Type extends MessageType<WhatTimeIsItRightNowResponse> {
    constructor() {
        super("whattimeisit.WhatTimeIsItRightNowResponse", [
            { no: 1, name: "now", kind: "message", T: () => Timestamp }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message whattimeisit.WhatTimeIsItRightNowResponse
 */
export const WhatTimeIsItRightNowResponse = new WhatTimeIsItRightNowResponse$Type();
// @generated message type with reflection information, may provide speed optimized methods
class WhatTimeIsItRightNowStreamRequest$Type extends MessageType<WhatTimeIsItRightNowStreamRequest> {
    constructor() {
        super("whattimeisit.WhatTimeIsItRightNowStreamRequest", [
            { no: 1, name: "freq_ms", kind: "scalar", T: 5 /*ScalarType.INT32*/ }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message whattimeisit.WhatTimeIsItRightNowStreamRequest
 */
export const WhatTimeIsItRightNowStreamRequest = new WhatTimeIsItRightNowStreamRequest$Type();
// @generated message type with reflection information, may provide speed optimized methods
class WhatTimeIsItRightNowStreamResponse$Type extends MessageType<WhatTimeIsItRightNowStreamResponse> {
    constructor() {
        super("whattimeisit.WhatTimeIsItRightNowStreamResponse", [
            { no: 1, name: "now", kind: "message", T: () => Timestamp }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message whattimeisit.WhatTimeIsItRightNowStreamResponse
 */
export const WhatTimeIsItRightNowStreamResponse = new WhatTimeIsItRightNowStreamResponse$Type();
/**
 * @generated ServiceType for protobuf service whattimeisit.WhatTimeIsItService
 */
export const WhatTimeIsItService = new ServiceType("whattimeisit.WhatTimeIsItService", [
    { name: "WhatTimeIsItRightNow", options: {}, I: WhatTimeIsItRightNowRequest, O: WhatTimeIsItRightNowResponse },
    { name: "WhatTimeIsItRightNowStream", serverStreaming: true, options: {}, I: WhatTimeIsItRightNowStreamRequest, O: WhatTimeIsItRightNowStreamResponse }
]);
