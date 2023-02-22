import { openDB } from 'idb'
import type { DBSchema } from 'idb'
import { createStore } from 'solid-js/store'
import { sequence } from '@/utils/misc'

const storeName = 'items'
const keyPath = 'id'

type Identified = {
	[keyPath]: number
}

type ClientStoreSchema<T extends Identified> = DBSchema & {
	[storeName]: {
		key: string
		value: T
	}
}

export function createClientStore<T extends Identified>(
	name: string,
	version: number,
) {
	const [state, setState] = createStore<Record<number, T>>({})
	const dbPromise = openDB<ClientStoreSchema<T>>(name, version, {
		upgrade(db) {
			db.createObjectStore(storeName, {
				keyPath,
				autoIncrement: true,
			})
		},
	}).then(async (db) => {
		const items = await db.getAll(storeName)

		let itemsObj: Record<number, T> = {}
		items.forEach((item) => {
			itemsObj[item.id] = item
		})

		setState(itemsObj)
		return db
	})

	let setPromises: Promise<string>[] = []

	async function set(item: T): Promise<void> {
		const [db] = await Promise.all([dbPromise, sequence(setPromises)])
		setPromises = []

		setState((from) => {
			return {
				...from,
				[item.id]: item,
			}
		})

		setPromises.push(db.put(storeName, item))
	}

	return [state, set] as const
}
