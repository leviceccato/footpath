import { type IDBPDatabase, openDB } from 'idb'
import { debounce } from 'radash'

type RequestInit = {
	type: 'init'
	payload: {
		name: string
		version: number
	}
}

type RequestSet = {
	type: 'set'
	payload: {
		data: unknown
	}
}

type RequestGet = {
	type: 'get'
}

export type StorageRequest = RequestInit | RequestGet | RequestSet

type ResponseInit = {
	type: 'init'
}

type ResponseGet = {
	type: 'get'
	payload: {
		data: unknown
	}
}

type ResponseSet = {
	type: 'set'
}

export type StorageResponse = ResponseInit | ResponseGet | ResponseSet

const storeName = 'data'
const keyName = 'value'

let dbPromise: Promise<IDBPDatabase<unknown>> | undefined

self.onmessage = ({ data }: MessageEvent<StorageRequest>) => {
	switch (data.type) {
		case 'init':
			init(data.payload.name, data.payload.version)
			break
		case 'get':
			get()
			break
		case 'set':
			set(data.payload.data)
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
			payload: {
				data,
			},
		})
	})
}

const set = debounce({ delay: 200 }, (data: unknown): void => {
	dbPromise?.then(async (db) => {
		await db.put(storeName, data, keyName)

		respond({ type: 'set' })
	})
})

function respond(message: StorageResponse): void {
	self.postMessage(message)
}
