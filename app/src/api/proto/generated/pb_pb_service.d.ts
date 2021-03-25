// package: pb
// file: pb.proto

import * as pb_pb from "./pb_pb";
import {grpc} from "@improbable-eng/grpc-web";

type EchoServiceEcho = {
  readonly methodName: string;
  readonly service: typeof EchoService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof pb_pb.EchoRequest;
  readonly responseType: typeof pb_pb.EchoResponse;
};

type EchoServiceEchoServerStream = {
  readonly methodName: string;
  readonly service: typeof EchoService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof pb_pb.EchoRequest;
  readonly responseType: typeof pb_pb.EchoResponse;
};

type EchoServiceEchoClientStream = {
  readonly methodName: string;
  readonly service: typeof EchoService;
  readonly requestStream: true;
  readonly responseStream: false;
  readonly requestType: typeof pb_pb.EchoRequest;
  readonly responseType: typeof pb_pb.EchoResponse;
};

type EchoServiceEchoBidirectionalStream = {
  readonly methodName: string;
  readonly service: typeof EchoService;
  readonly requestStream: true;
  readonly responseStream: true;
  readonly requestType: typeof pb_pb.EchoRequest;
  readonly responseType: typeof pb_pb.EchoResponse;
};

export class EchoService {
  static readonly serviceName: string;
  static readonly Echo: EchoServiceEcho;
  static readonly EchoServerStream: EchoServiceEchoServerStream;
  static readonly EchoClientStream: EchoServiceEchoClientStream;
  static readonly EchoBidirectionalStream: EchoServiceEchoBidirectionalStream;
}

export type ServiceError = { message: string, code: number; metadata: grpc.Metadata }
export type Status = { details: string, code: number; metadata: grpc.Metadata }

interface UnaryResponse {
  cancel(): void;
}
interface ResponseStream<T> {
  cancel(): void;
  on(type: 'data', handler: (message: T) => void): ResponseStream<T>;
  on(type: 'end', handler: (status?: Status) => void): ResponseStream<T>;
  on(type: 'status', handler: (status: Status) => void): ResponseStream<T>;
}
interface RequestStream<T> {
  write(message: T): RequestStream<T>;
  end(): void;
  cancel(): void;
  on(type: 'end', handler: (status?: Status) => void): RequestStream<T>;
  on(type: 'status', handler: (status: Status) => void): RequestStream<T>;
}
interface BidirectionalStream<ReqT, ResT> {
  write(message: ReqT): BidirectionalStream<ReqT, ResT>;
  end(): void;
  cancel(): void;
  on(type: 'data', handler: (message: ResT) => void): BidirectionalStream<ReqT, ResT>;
  on(type: 'end', handler: (status?: Status) => void): BidirectionalStream<ReqT, ResT>;
  on(type: 'status', handler: (status: Status) => void): BidirectionalStream<ReqT, ResT>;
}

export class EchoServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  echo(
    requestMessage: pb_pb.EchoRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: pb_pb.EchoResponse|null) => void
  ): UnaryResponse;
  echo(
    requestMessage: pb_pb.EchoRequest,
    callback: (error: ServiceError|null, responseMessage: pb_pb.EchoResponse|null) => void
  ): UnaryResponse;
  echoServerStream(requestMessage: pb_pb.EchoRequest, metadata?: grpc.Metadata): ResponseStream<pb_pb.EchoResponse>;
  echoClientStream(metadata?: grpc.Metadata): RequestStream<pb_pb.EchoRequest>;
  echoBidirectionalStream(metadata?: grpc.Metadata): BidirectionalStream<pb_pb.EchoRequest, pb_pb.EchoResponse>;
}

