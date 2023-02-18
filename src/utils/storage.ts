type Storage = {
	getItem: (key: string) => Promise<unknown>
	setItem: (key: string, value: unknown) => Promise<unknown>
}

export function createStorage(): Storage {
	const instance = new Promise<LocalForage>((resolve) => {
		import('localforage').then(resolve)
	})

	return {
		getItem: (key: string) => instance.then((i) => i.getItem(key)),
		setItem: (key: string, value: unknown) =>
			instance.then((i) => i.setItem(key, value)),
	}
}
