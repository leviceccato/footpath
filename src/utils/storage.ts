import { createEffect, createRoot } from 'solid-js'
import { createStore, unwrap } from 'solid-js/store'
import StorageWorker from '@/utils/storage.worker?worker'
import type { StorageRequest, StorageResponse } from '@/utils/storage.worker'

type CreateClientStoreOptions<T> = {
	name: string
	version: number
	initialValue: T
	onError?: (error: ErrorEvent) => void
	shouldPersist?: boolean
}

export function createClientStore<T>(options: CreateClientStoreOptions<T>) {
	const onError = options.onError ?? (() => {})
	const shouldPersist = options.shouldPersist ?? true

	return createRoot(() => {
		const [store, setStore] = createStore({ value: options.initialValue })

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

			worker.onerror = onError

			request(worker, {
				type: 'init',
				payload: {
					name: options.name,
					version: options.version,
				},
			})
		})

		if (shouldPersist) {
			createEffect(() => {
				const data = unwrap(store.value) || options.initialValue

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
