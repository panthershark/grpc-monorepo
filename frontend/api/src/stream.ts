import { Signal, useSignal } from '@preact/signals';
import { ServerStreamingCall } from '@protobuf-ts/runtime-rpc';
import { useCallback, useEffect } from 'preact/hooks';

export enum StreamOperationStatus {
	Streaming,
	Complete,
	Error
}

export interface StreamOperation<Req, Resp> {
	status: StreamOperationStatus;
	req: Req;
	resp?: Resp;
	err?: Error;
	abort: () => void;
}

interface StreamResponse<Req extends object, Resp extends object> {
	stream: ServerStreamingCall<Req, Resp>;
	abort: (reason?: any) => void;
}

const createStreamFn =
	<Req extends object, Resp extends object>(
		op: Signal<StreamOperation<Req, Resp>>,
		fn: (req: Req) => Promise<StreamResponse<Req, Resp>>
	) =>
	async () => {
		const req = op.value.req;

		try {
			const { stream, abort } = await fn(req);

			op.value = {
				status: StreamOperationStatus.Streaming,
				req,
				resp: undefined,
				abort
			};

			for await (let resp of stream.responses) {
				op.value = {
					status: StreamOperationStatus.Streaming,
					req,
					resp,
					abort
				};
			}
			let { status } = await stream;

			switch (status.code) {
				case 'OK':
					op.value = { ...op.value, status: StreamOperationStatus.Complete, abort: () => {} };
					break;
				default:
					op.value = {
						status: StreamOperationStatus.Error,
						req,
						err: new Error(`${status.code}:${status.detail}`),
						abort: () => {}
					};
					break;
			}
		} catch (e) {
			op.value = {
				status: StreamOperationStatus.Error,
				req,
				err: new Error(JSON.stringify(e, null, 2)),
				abort: () => {}
			};
		}
	};

// createStreamApiHook: returns a signal for the stream response from a grpc service.
export const useStreamApiHook = <Req extends object, Resp extends object>(
	fn: (req: Req) => Promise<StreamResponse<Req, Resp>>,
	req: Req
): Signal<StreamOperation<Req, Resp>> => {
	const op = useSignal<StreamOperation<Req, Resp>>({
		status: StreamOperationStatus.Streaming,
		req,
		abort: () => {}
	});

	const startStream = useCallback(createStreamFn(op, fn), []);

	useEffect(() => {
		op.value.abort();
		op.value.req = req;
		startStream();
	}, Object.values(req));

	return op;
};
