import { debounce } from '@/utils/misc'
import { type IDBPDatabase, openDB } from 'idb'

export type StorageRequest = RequestInit | RequestGet | RequestSet

type RequestInit = {
	type: 'init'
	name: string
	version: number
}

type RequestSet = {
	type: 'set'
	data: unknown
}

type RequestGet = {
	type: 'get'
}

export type StorageResponse = ResponseInit | ResponseGet | ResponseSet

type ResponseInit = {
	type: 'init'
}

type ResponseGet = {
	type: 'get'
	data: unknown
}

type ResponseSet = {
	type: 'set'
}

const storeName = 'data'
const keyName = 'value'

let dbPromise: Promise<IDBPDatabase<unknown>> | undefined

self.onmessage = (event: MessageEvent<StorageRequest>) => {
	switch (event.data.type) {
		case 'init':
			init(event.data.name, event.data.version)
			break
		case 'get':
			get()
			break
		case 'set':
			set(event.data.data)
			break
	}
}

function init(name: string, version: number): void {
	dbPromise = openDB(name, version, {
		upgrade(db) {
			db.createObjectStore(storeName)
		},
	}).then((db) => {
		respond({ type: 'init' })
		return db
	})
	get()
}

function get(): void {
	dbPromise?.then(async (db) => {
		const data = await db.get(storeName, keyName)
		if (data === undefined) {
			return
		}

		respond({
			type: 'get',
			data,
		})
	})
}

const set = debounce(200, (data: unknown): void => {
	dbPromise?.then(async (db) => {
		await db.put(storeName, data, keyName)

		respond({ type: 'set' })
	})
})

function respond(message: StorageResponse): void {
	self.postMessage(message)
}
