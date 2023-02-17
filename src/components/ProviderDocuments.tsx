import { createContext, useContext } from 'solid-js'
import type { ParentComponent } from 'solid-js'

function createDocumentsContext() {
	return [] as const
}

const context = createContext(createDocumentsContext())

export function useDocuments() {
	return useContext(context)
}

const ProviderDocuments: ParentComponent<{
	initialDocuments: string
}> = (props) => {
	return <context.Provider value={[]}>{props.children}</context.Provider>
}

export default ProviderDocuments
