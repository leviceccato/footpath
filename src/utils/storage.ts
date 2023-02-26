// import type { DBSchema } from 'idb'
import { createStore } from 'solid-js/store'
import type { StoreNode } from 'solid-js/store'
import StorageWorker from '@/workers/storage?worker'
import type { StorageRequest, StorageResponse } from '@/workers/storage'

export function createClientStore<T extends StoreNode>(
	name: string,
	version: number,
	initialValue: T,
) {
	const [store, setStore] = createStore(initialValue)
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

	async function _setStore(to: T): Promise<void> {
		setStore(to)
		request(worker, {
			type: 'set',
			payload: {
				data: to,
			},
		})
	}

	return [store, _setStore] as const
}

function request(worker: Worker, message: StorageRequest): void {
	worker.postMessage(message)
}
