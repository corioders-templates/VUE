import { transport_Stream, transport_ClientStream, transport_BidirectionalStream } from '@corioders/jskit/io/transport';

import {
	echo as _echo,
	echoServerStream as _echoServerStream,
	echoClientStream as _echoClientStream,
	echoBidirectionalStream as _echoBidirectionalStream,
} from './proto/echoService';

export function echo(message: string): Promise<string> {
	// We know we won't call _echo().cancel() so we are sure that response != null.
	return _echo(message).response as Promise<string>;
}

export function echoServerStream(message: string): transport_Stream<string> {
	return _echoServerStream(message).response;
}

export function echoClientStream(): transport_ClientStream<string | null, string> {
	return _echoClientStream();
}

export function echoBidirectionalStream(): transport_BidirectionalStream<string, string> {
	return _echoBidirectionalStream();
}
