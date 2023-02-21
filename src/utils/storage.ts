import { createStore } from 'solid-js/store'

export function createClientStore<T>(name: string) {
	const instance = import('localforage').then((l) => l.createInstance({ name }))

	const [store, setStore] = createStore<Record<string, T>>({})

	async function getItem(key: string): Promise<T | null> {
		let item = store[key]
		if (item) {
			return item
		}

		const i = await instance
		item = i.getItem(key) as T
		if (item) {
			setStore(key, item)
			return item
		}

		return null
	}

	async function setItem(key: string, item: T): Promise<void> {
		const i = await instance
		i.setItem(key, item)
		setStore(key, item)
	}

	return [getItem, setItem] as const
}
