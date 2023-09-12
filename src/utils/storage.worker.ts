import { openDB } from 'idb'
import type { IDBPDatabase } from 'idb'
import { debounce } from 'lodash-es'

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
		data: any
	}
}

type RequestGet = {
	type: 'get'
}

export type StorageRequest = RequestInit | RequestGet | RequestSet

type ResponseInit = {
	type: 'init'
	payload?: {
		data: any
	}
}

type ResponseGet = {
	type: 'get'
	payload: {
		data: any
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
	if (data.type === 'init') {
		return init(data.payload.name, data.payload.version)
	}
	if (data.type === 'get') {
		return get()
	}
	if (data.type === 'set') {
		return set(data.payload.data)
	}
}

function init(name: string, version: number): void {
	dbPromise = openDB(name, version, {
		upgrade(db) {
			db.createObjectStore(storeName)
		},
	}).then(async (db) => {
		const data = await db.get(storeName, keyName)
		respond({ type: 'init', payload: { data } })
		return db
	})
}

function get(): void {
	dbPromise?.then(async (db) => {
		const data = await db.get(storeName, keyName)

		respond({
			type: 'get',
			payload: {
				data,
			},
		})
	})
}

const set = debounce((data: any): void => {
	dbPromise?.then(async (db) => {
		await db.put(storeName, data, keyName)

		respond({ type: 'set' })
	})
}, 200)

function respond(message: StorageResponse): void {
	self.postMessage(message)
}
