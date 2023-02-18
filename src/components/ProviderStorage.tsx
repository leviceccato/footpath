import { createContext, useContext } from 'solid-js'
import type { ParentComponent } from 'solid-js'
import { createStorage } from '@/utils/storage'

function createStorageContext() {
	const storage = createStorage()
	return [storage] as const
}

const context = createContext(createStorageContext())

export function useStorage() {
	return useContext(context)
}

const ProviderStorage: ParentComponent = (props) => {
	return (
		<context.Provider value={createStorageContext()}>
			{props.children}
		</context.Provider>
	)
}

export default ProviderStorage
