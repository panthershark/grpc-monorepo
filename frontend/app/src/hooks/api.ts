import {
	useFetchApiHook,
	useStreamApiHook,
	WhatTimeIsItRightNowResponse,
	WhatTimeIsItRightNowStreamResponse,
	WhatTimeIsItServiceClient
} from '@panthershark/api';
import { GrpcWebFetchTransport } from '@protobuf-ts/grpcweb-transport';
import { grpcUrl } from '../env';

const transport = new GrpcWebFetchTransport({
	baseUrl: grpcUrl,
	format: 'text'
});

// useWhatTimeIsIt: wraps grpc call with a hook.
export const useWhatTimeIsIt = () =>
	useFetchApiHook<null, WhatTimeIsItRightNowResponse>(async (_) => {
		const client = new WhatTimeIsItServiceClient(transport);
		const { response } = await client.whatTimeIsItRightNow({});

		return response;
	});

// useWhatTimeIsItStream: wraps grpc call with a hook.
export const useWhatTimeIsItStream = (ms: number) =>
	useStreamApiHook<{}, WhatTimeIsItRightNowStreamResponse>(async (_) => {
		const client = new WhatTimeIsItServiceClient(transport);
		const controller = new AbortController();
		return {
			stream: client.whatTimeIsItRightNowStream({ freqMs: ms }, { abort: controller.signal }),
			abort: () => controller.abort()
		};
	}, {});
