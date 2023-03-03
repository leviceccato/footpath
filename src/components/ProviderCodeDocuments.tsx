import { createContext, useContext, createRoot, createSignal } from 'solid-js'
import type { ParentComponent } from 'solid-js'
import { createClientStore } from '@/utils/storage'

const uuid = () => import('uuid')

export type CodeDocument = {
	id: string
	index: number
	name: string
	isActive: boolean
	createdAt: Date
	deletedAt: Date | null
	content: string
}

type CodeDocumentStore = Record<string, CodeDocument>

function createCodeDocumentsContext() {
	return createRoot(() => {
		const [error, setError] = createSignal<ErrorEvent>()
		const [store, setStore] = createClientStore<CodeDocumentStore>({
			name: 'code-documents',
			version: 1,
			initialValue: {},
			onError: setError,
			shouldPersist: true,
		})

		const count = () => Object.keys(store.value).length

		async function create(name: string): Promise<string> {
			const { v4 } = await uuid()
			const id = v4()

			const document = {
				id,
				name,
				index: count() + 1,
				isActive: false,
				createdAt: new Date(),
				deletedAt: null,
				content: '',
			}

			setStore({
				...store.value,
				[id]: document,
			})
			return id
		}

		function activate(id: string): void {
			let newStore: CodeDocumentStore = {}

			Object.values(store.value).forEach((doc) => {
				const currentId = doc.id
				newStore[currentId] = doc

				if (newStore[currentId].id === id) {
					newStore[currentId].isActive = true
				} else {
					newStore[currentId].isActive = false
				}
			})

			setStore(newStore)
		}

		function _delete(id: string): void {
			let newStore: CodeDocumentStore = { ...store.value }

			newStore[id].deletedAt = new Date()

			setStore(newStore)
		}

		function clearError() {
			setError(undefined)
		}

		return [
			store,
			{
				setCodeDocuments: setStore,
				createCodeDocument: create,
				codeDocumentCount: count,
				codeDocumentsError: error,
				clearCodeDocumentsError: clearError,
				activateCodeDocument: activate,
				deleteCodeDocument: _delete,
			},
		] as const
	})
}

const codeDocumentsContext = createCodeDocumentsContext()
const context = createContext(codeDocumentsContext)

export function useCodeDocuments() {
	return useContext(context)
}

const ProviderCodeDocuments: ParentComponent = (props) => {
	return (
		<context.Provider value={codeDocumentsContext}>
			{props.children}
		</context.Provider>
	)
}

export default ProviderCodeDocuments
