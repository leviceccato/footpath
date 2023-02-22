import { openDB } from 'idb'
import type { DBSchema } from 'idb'
import { createStore } from 'solid-js/store'
import type { StoreNode } from 'solid-js/store'
import { sequence } from '@/utils/misc'

const storeName = 'data'
const keyName = 'key'

type ClientStoreSchema<T> = DBSchema & {
	[storeName]: {
		key: string
		value: T
	}
}

export function createClientStore<T extends StoreNode>(
	name: string,
	version: number,
	initialValue: T,
) {
	const [state, setState] = createStore(initialValue)
	const dbPromise = openDB<ClientStoreSchema<T>>(name, version, {
		upgrade(db) {
			db.createObjectStore(storeName)
		},
	}).then(async (db) => {
		const data = await db.get(storeName, keyName)
		if (data) {
			setState(data)
		}

		return db
	})

	let setPromises: Promise<string>[] = []

	async function set(to: T): Promise<void> {
		const [db] = await Promise.all([dbPromise, sequence(setPromises)])
		setPromises = []

		setState(to)
		setPromises.push(db.put(storeName, to, keyName))
	}

	return [state, set] as const
}
