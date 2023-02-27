import { createEffect, createRoot } from 'solid-js'
import { createStore, unwrap } from 'solid-js/store'
import StorageWorker from '@/utils/storage.worker?worker'
import type { StorageRequest, StorageResponse } from '@/utils/storage.worker'

export function createClientStore<T>({
	name,
	version,
	initialValue,
	onError = () => {},
	shouldPersist = true,
}: {
	name: string
	version: number
	initialValue: T
	onError?: (error: ErrorEvent) => void
	shouldPersist?: boolean
}) {
	return createRoot(() => {
		const [store, setStore] = createStore({ value: initialValue })

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
					name,
					version,
				},
			})
		})

		if (shouldPersist) {
			createEffect(() => {
				const data = unwrap(store.value)

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
