import { createSignal, createEffect, createRoot } from 'solid-js'
import StorageWorker from '@/utils/storage.worker?worker'
import type { StorageRequest, StorageResponse } from '@/utils/storage.worker'

type CreateClientStoreOptions<TValue> = {
	name: string
	version: number
	initialValue: TValue
	onError?: (error: ErrorEvent) => void
	shouldPersist?: boolean
}

export function createClientStore<TValue>(
	options: CreateClientStoreOptions<TValue>,
) {
	return createRoot(() => {
		const [store, setStore] = createSignal({ value: options.initialValue })

		// Worker is created in promise so it can resolve asynchronously while
		// this function is created synchronously. The effect for updates to
		// the store will wait until the worker is initialised.

		const workerPromise = new Promise<Worker>((resolve) => {
			const worker = new StorageWorker()

			worker.onmessage = ({ data }: MessageEvent<StorageResponse>) => {
				if (data.type === 'init') {
					return resolve(worker)
				}
				if (data.type === 'get') {
					return setStore({ value: data.payload.data })
				}
			}

			worker.onerror = options.onError ?? null

			request(worker, {
				type: 'init',
				payload: {
					name: options.name,
					version: options.version,
				},
			})
		})

		if (options.shouldPersist ?? true) {
			createEffect(() => {
				const data = store().value || options.initialValue

				workerPromise.then((worker) => {
					request(worker, {
						type: 'set',
						payload: {
							data,
						},
					})
				})
			})
		}

		return [store, setStore] as const
	})
}

function request(worker: Worker, message: StorageRequest): void {
	worker.postMessage(message)
}
