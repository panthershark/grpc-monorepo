import { Signal, signal } from '@preact/signals';
import { ServerStreamingCall } from '@protobuf-ts/runtime-rpc';
import { backOff } from 'exponential-backoff';
import { useCallback, useEffect, useMemo } from 'preact/hooks';

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

export interface StreamResponse<Req extends object, Resp extends object> {
	stream: ServerStreamingCall<Req, Resp>;
	abort: (reason?: any) => void;
}

const createStreamFn =
	<Req extends object, Resp extends object>(
		op: Signal<StreamOperation<Req, Resp>>,
		fn: (req: Req) => Promise<StreamResponse<Req, Resp>>
	) =>
	async (onAbort: () => void) => {
		const req = op.value.req;

		try {
			const { stream, abort } = await fn(req);

			op.value = {
				status: StreamOperationStatus.Streaming,
				req,
				resp: undefined,
				abort: () => {
					abort();
					onAbort();
				}
			};

			for await (let resp of stream.responses) {
				op.value = {
					status: StreamOperationStatus.Streaming,
					req,
					resp,
					abort: () => {
						abort();
						onAbort();
					}
				};
			}
			let { status } = await stream;

			switch (status.code) {
				case 'OK':
					op.value = { ...op.value, status: StreamOperationStatus.Complete, abort: () => {} };
					break;
				default:
					abort();
					onAbort();
					throw new Error(`${status.code}:${status.detail}`);
			}
		} catch (e) {
			op.value = {
				status: StreamOperationStatus.Error,
				req,
				err: new Error(`${e}`),
				abort: () => {}
			};

			throw e;
		}
	};

interface StreamOptions {
	reconnect?: boolean;
}

// useStreamApi: factory to generate a hook from a grpc service wrapper. To make a call that returns a stream, use createStreamApiHook
export const useStreamApi = <Req extends object, Resp extends object>(
	streamer: (req: Req) => Promise<StreamResponse<Req, Resp>>,
	req: Req,
	opts?: StreamOptions
): Signal<StreamOperation<Req, Resp>> => {
	const op = useMemo(
		() =>
			signal<StreamOperation<Req, Resp>>({
				status: StreamOperationStatus.Streaming,
				req,
				abort: () => {}
			}),
		[]
	);

	const startStream = useCallback(createStreamFn(op, streamer), []);

	useEffect(() => {
		op.value = { ...op.value, req };
		let reconnect = opts?.reconnect === true;

		const run = async () => {
			try {
				await backOff(
					() =>
						startStream(() => {
							reconnect = false;
						}),
					{ retry: () => reconnect }
				);
			} catch (e) {
				console.log(Object.keys(e as any), e);
			}
		};

		run();

		return () => {
			reconnect = false;
			op.value.abort();
		};
	}, [req]);

	return op;
};
