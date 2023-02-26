import { createEffect, createRoot } from 'solid-js'
import { createStore, unwrap } from 'solid-js/store'
import StorageWorker from '@/utils/storage.worker?worker'
import type { StorageRequest, StorageResponse } from '@/utils/storage.worker'

export function createClientStore<T>(
	name: string,
	version: number,
	initialValue: T,
) {
	return createRoot(() => {
		const [store, setStore] = createStore({ value: initialValue })
		const worker = new StorageWorker()

		worker.onmessage = ({ data }: MessageEvent<StorageResponse>) => {
			if (data.type === 'get') {
				setStore(data.payload.data)
			}
		}

		worker.onerror = (error) => {
			console.error('Error in storage worker', error)
		}

		request(worker, {
			type: 'init',
			payload: {
				name,
				version,
			},
		})

		createEffect(() => {
			console.log('store effect')
			request(worker, {
				type: 'set',
				payload: {
					data: unwrap(store.value),
				},
			})
		})

		return [store, setStore] as const
	})
}

function request(worker: Worker, message: StorageRequest): void {
	worker.postMessage(message)
}
