import { renderHook, waitFor } from '@testing-library/preact';
import { describe, expect, it, vi } from 'vitest';
import { FetchOperationStatus, useFetchApi } from './fetch';

describe('useFetchApi', () => {
	it('initializes without req', () => {
		const fetcher = vi.fn();
		const { result } = renderHook(() => useFetchApi<string, number>(fetcher));

		expect(result.current[0].value).toEqual({ status: FetchOperationStatus.Initialized });
		expect(fetcher).not.toHaveBeenCalled();
	});

	it('initializes req', () => {
		const fetcher = vi.fn();
		const { result } = renderHook(() => useFetchApi<string, number>(fetcher, 'fqwahgaghads'));

		expect(result.current[0].value).toEqual({ status: FetchOperationStatus.Fetching, req: 'fqwahgaghads' });
		expect(fetcher).toHaveBeenCalledWith('fqwahgaghads');
	});

	it('updates state on success', async () => {
		const fetcher = vi.fn().mockResolvedValue(420);
		const { result } = renderHook(() => useFetchApi<string, number>(fetcher, 'fqwahgaghads'));

		await waitFor(() => {
			expect(result.current[0].value).toEqual({ status: FetchOperationStatus.Success, req: 'fqwahgaghads', resp: 420 });
		});
	});

	it('updates state on error', async () => {
		const fetcher = vi.fn().mockRejectedValue('eeerrr');
		const { result } = renderHook(() => useFetchApi<string, number>(fetcher, 'fqwahgaghads'));

		await waitFor(() => {
			expect(result.current[0].value.status).toEqual(FetchOperationStatus.Error);
			expect(result.current[0].value.req).toEqual('fqwahgaghads');
			expect(result.current[0].value.err?.message).toContain('eeerrr');
		});
	});

	it('updates state when refresh is called', async () => {
		const fetcher = vi.fn();
		const { result } = renderHook(() => useFetchApi<string, number>(fetcher));
		expect(fetcher).not.toHaveBeenCalled();

		const refresh = result.current[1];
		refresh('valentimes');
		expect(result.current[0].value).toEqual({ status: FetchOperationStatus.Fetching, req: 'valentimes' });
	});

	it('does not clear resp on refresh', async () => {
		const fetcher = vi.fn();
		const { result } = renderHook(() => useFetchApi<string, number>(fetcher));
		const [op, refresh] = result.current;
		op.value.status = FetchOperationStatus.Success;
		op.value.resp = 420;

		refresh('valentimes');
		expect(result.current[0].value).toEqual({ status: FetchOperationStatus.Fetching, req: 'valentimes', resp: 420 });
	});
});
