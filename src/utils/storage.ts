import { defaultValues } from '@/utils/solid'
import type { StorageRequest, StorageResponse } from '@/utils/storage.worker'
import StorageWorker from '@/utils/storage.worker?worker'
import { createEffect, createRoot, createSignal } from 'solid-js'

export function createClientStore<TValue>(rawProps: {
	name: string
	version?: number
	strategy?: 'indexeddb' | 'localstorage'
	initialValue: TValue
	shouldPersist?: boolean
	onError?: ((error: ErrorEvent) => void) | null
}) {
	return createRoot(() => {
		const props = defaultValues(rawProps, {
			shouldPersist: true,
			onError: null,
			strategy: 'indexeddb',
			version: 1,
		})

		const [store, setStore] = createSignal({ value: props.initialValue })

		/* Worker is created in promise so it can resolve asynchronously while
		this function is created synchronously. The effect for updates to
		the store will wait until the worker is initialised. */

		if (props.strategy === 'indexeddb') {
			const workerPromise = new Promise<Worker>((resolve) => {
				const worker = new StorageWorker()

				props.initialValue

				worker.onerror = props.onError

				worker.onmessage = ({ data }: MessageEvent<StorageResponse>) => {
					switch (data.type) {
						case 'init':
							resolve(worker)
							break
						case 'get':
							setStore({ value: data.payload.data as TValue })
							break
					}
				}

				request(worker, {
					type: 'init',
					payload: {
						name: props.name,
						version: props.version,
					},
				})
			})

			if (props.shouldPersist) {
				createEffect(() => {
					const data = store().value || props.initialValue

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
		}

		return [store, setStore] as const
	})
}

function request(worker: Worker, message: StorageRequest): void {
	worker.postMessage(message)
}
