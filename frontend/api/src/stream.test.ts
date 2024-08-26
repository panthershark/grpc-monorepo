import { renderHook, waitFor } from '@testing-library/preact';
import { describe, expect, it, vi } from 'vitest';
import { StreamOperationStatus, useStreamApi } from './stream';

const sleep = (ms: number) => {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
};

describe('useStreamApi', () => {
	it('initializes req', async () => {
		const abort = vi.fn();
		const streamer = vi.fn().mockResolvedValue({
			stream: {
				status: { code: 'OK' },
				responses: (async function* () {})()
			},
			abort
		});
		const { result } = renderHook(() => useStreamApi<{ s: string }, { n: number }>(streamer, { s: 'fqwahgaghads' }));

		expect(result.current.value.status).toEqual(StreamOperationStatus.Streaming);
		expect(result.current.value.req).toEqual({ s: 'fqwahgaghads' });

		await waitFor(() => {
			expect(streamer).toHaveBeenCalledWith({ s: 'fqwahgaghads' });
		});
	});

	it('streams messages', async () => {
		const abort = vi.fn();
		const streamer = vi.fn().mockResolvedValue({
			stream: {
				status: { code: 'OK' },
				responses: (async function* () {
					await sleep(100);
					yield { n: 420 };
					await sleep(100);
					yield { n: 421 };
					await sleep(100);
				})()
			},
			abort
		});
		const { result } = renderHook(() => useStreamApi<{ s: string }, { n: number }>(streamer, { s: 'fqwahgaghads' }));

		await waitFor(() => {
			expect(result.current.value.status).toEqual(StreamOperationStatus.Streaming);
			expect(result.current.value.req).toEqual({ s: 'fqwahgaghads' });
			expect(result.current.value.resp).toEqual({ n: 420 });
		});

		await waitFor(() => {
			expect(result.current.value.status).toEqual(StreamOperationStatus.Streaming);
			expect(result.current.value.req).toEqual({ s: 'fqwahgaghads' });
			expect(result.current.value.resp).toEqual({ n: 421 });
		});

		await waitFor(() => {
			expect(result.current.value.status).toEqual(StreamOperationStatus.Complete);
		});
	});

	it('updates state on error', async () => {
		const abort = vi.fn();
		const streamer = vi.fn().mockResolvedValue({
			stream: {
				status: { code: 'not used' },
				responses: (async function* () {
					throw new Error('eerrr');
				})()
			},
			abort
		});
		const { result } = renderHook(() => useStreamApi<{ s: string }, { n: number }>(streamer, { s: 'fqwahgaghads' }));

		await waitFor(() => {
			expect(result.current.value.status).toEqual(StreamOperationStatus.Error);
			expect(result.current.value.req).toEqual({ s: 'fqwahgaghads' });
			expect(result.current.value.err?.message).toContain('eerrr');
		});

		await sleep(200);
		expect(streamer, 'does not reconnect').toHaveBeenCalledTimes(1);
	});

	it('cancels on abort', async () => {
		const abort = vi.fn();
		const streamer = vi.fn().mockResolvedValue({
			stream: {
				status: { code: 'OK' },
				responses: (async function* () {
					await sleep(20);
					throw new Error('abortedd');
				})()
			},
			abort
		});

		const { result } = renderHook(() =>
			useStreamApi<{ s: string }, { n: number }>(streamer, { s: 'fqwahgaghads' }, { reconnect: true })
		);

		await sleep(10);
		result.current.value.abort();
		expect(abort).toHaveBeenCalledTimes(1);

		await waitFor(() => {
			expect(result.current.value.status).toEqual(StreamOperationStatus.Error);
			expect(result.current.value.req).toEqual({ s: 'fqwahgaghads' });
			expect(result.current.value.err?.message).toContain('abortedd');
		});

		await sleep(200);
		expect(streamer, 'reconnects').toHaveBeenCalledTimes(1);
	});

	it('reconnects with backoff on error', async () => {
		const abort = vi.fn();
		const streamer = vi
			.fn()
			.mockResolvedValue({
				stream: {
					status: { code: 'OK' },
					responses: (async function* () {
						await sleep(10);
						yield { n: 420 };
					})()
				},
				abort
			})
			.mockResolvedValueOnce({
				stream: {
					status: { code: 'not used' },
					responses: (async function* () {
						throw new Error('eerrr');
					})()
				},
				abort
			});

		const { result } = renderHook(() =>
			useStreamApi<{ s: string }, { n: number }>(streamer, { s: 'fqwahgaghads' }, { reconnect: true })
		);

		await waitFor(() => {
			expect(result.current.value.status).toEqual(StreamOperationStatus.Error);
			expect(result.current.value.req).toEqual({ s: 'fqwahgaghads' });
			expect(result.current.value.err?.message).toContain('eerrr');
		});

		await waitFor(() => {
			expect(result.current.value.status).toEqual(StreamOperationStatus.Streaming);
			expect(result.current.value.req).toEqual({ s: 'fqwahgaghads' });
		});
		result.current.value.abort();

		await sleep(200);
		expect(streamer, 'reconnects').toHaveBeenCalledTimes(2);
	});
});
