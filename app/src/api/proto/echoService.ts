import { transport_Unary, transport_Stream, transport_ClientStream, transport_ServerStream, transport_BidirectionalStream } from '@corioders/jskit/io/transport';
import { grpc } from '@corioders/jskit/io/transport/grpc';

import { API_V1 } from '@/api/api';

import { EchoRequest } from './generated/pb_pb';
import { EchoService } from './generated/pb_pb_service';

const serviceClient = new grpc.ServiceClient(EchoService, API_V1.GRPC);

export function echo(message: string): transport_Unary<string | null> {
	const request = new EchoRequest();
	request.setMessage(message);
	const context = serviceClient.echo(request);

	async function response(): Promise<string | null> {
		const response = await context.response;
		if (response === null) return null;
		return response.getMessage();
	}

	return {
		response: response(),
		cancel: context.cancel,
	};
}

export function echoServerStream(message: string): transport_ServerStream<string> {
	const request = new EchoRequest();
	request.setMessage(message);
	const context = serviceClient.echoServerStream(request);

	async function* responseGenerator(): transport_Stream<string> {
		for await (const response of context.response) {
			yield response.getMessage();
		}
		return undefined as never;
	}

	return {
		response: responseGenerator(),
		cancel: context.cancel,
	};
}

export function echoClientStream(): transport_ClientStream<string | null, string> {
	const context = serviceClient.echoClientStream();

	async function response(): Promise<string | null> {
		const r = await context.response;
		if (r === null) return null;

		return r.getMessage();
	}

	function write(message: string): void {
		const request = new EchoRequest();
		request.setMessage(message);
		context.write(request);
	}

	return {
		response: response(),
		write: write,
		end: context.end,
		cancel: context.cancel,
	};
}

export function echoBidirectionalStream(): transport_BidirectionalStream<string, string> {
	const context = serviceClient.echoBidirectionalStream();

	async function* responseGenerator(): transport_Stream<string> {
		for await (const response of context.response) {
			yield response.getMessage();
		}
		return undefined as never;
	}

	function write(message: string): void {
		const request = new EchoRequest();
		request.setMessage(message);
		context.write(request);
	}

	return {
		response: responseGenerator(),
		write: write,
		end: context.end,
		cancel: context.cancel,
	};
}
