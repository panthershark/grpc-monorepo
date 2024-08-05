import { Signal, useSignal } from '@preact/signals';
import { useCallback, useEffect } from 'preact/hooks';

export enum FetchOperationStatus {
	Initialized,
	Fetching,
	Error,
	Success
}

export interface FetchOperation<Req, Resp> {
	status: FetchOperationStatus;
	req?: Req;
	resp?: Resp;
	err?: Error;
}

const createCallServiceFn =
	<Req, Resp>(op: Signal<FetchOperation<Req, Resp>>, fn: (req: Req) => Promise<Resp>) =>
	async (req: Req) => {
		if (op.value.status === FetchOperationStatus.Fetching) {
			return;
		}

		op.value = {
			...op.value,
			status: FetchOperationStatus.Fetching,
			req
		};

		// try the call.
		try {
			op.value = {
				status: FetchOperationStatus.Success,
				req,
				resp: await fn(req)
			};
		} catch (e) {
			console.log(`Fetch err: ${e}. req: `, req);
			op.value = {
				status: FetchOperationStatus.Error,
				req,
				err: new Error(JSON.stringify(e, null, 2))
			};
		}
	};

// useFetchApiHook: calls and returns a fetch service for a grpc service. Returns a signal representing the state of the operation and a function to refresh the fetch call (i.e. call it again)
export const useFetchApiHook = <Req, Resp>(
	fn: (req: Req) => Promise<Resp>,
	initialCallParams?: Req
): [Signal<FetchOperation<Req, Resp>>, (req: Req) => void] => {
	const op = useSignal<FetchOperation<Req, Resp>>({
		status: FetchOperationStatus.Initialized
	});

	const callService = useCallback(createCallServiceFn(op, fn), []);

	// if initial call params are passed, then call the service automatically.
	useEffect(() => {
		if (initialCallParams !== undefined) {
			callService(initialCallParams);
		}
	}, []);

	return [op, callService];
};
