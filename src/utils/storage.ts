type Storage = {
	getItem: (key: string) => Promise<unknown>
	setItem: (key: string, value: unknown) => Promise<unknown>
}

export function createStorage(name: string): Storage {
	const instance = new Promise<LocalForage>((resolve) => {
		import('localforage').then((localforage) => {
			resolve(
				localforage.createInstance({
					storeName: name,
				}),
			)
		})
	})

	return {
		getItem: (key: string) => instance.then((i) => i.getItem(key)),
		setItem: (key: string, value: unknown) =>
			instance.then((i) => i.setItem(key, value)),
	}
}
