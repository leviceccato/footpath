import { createEffect } from 'solid-js'
import { createStore } from 'solid-js/store'
import type { StoreNode } from 'solid-js/store'
import StorageWorker from '@/utils/storage.worker?worker'
import type { StorageRequest, StorageResponse } from '@/utils/storage.worker'

export function createClientStore<T extends StoreNode>(
	name: string,
	version: number,
	initialValue: T,
) {
	const [store, setStore] = createStore<T>(initialValue)
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
		request(worker, {
			type: 'set',
			payload: {
				data: store,
			},
		})
	})

	return [store, setStore] as const
}

function request(worker: Worker, message: StorageRequest): void {
	worker.postMessage(message)
}
