import { createClientStore } from '@/utils/storage'
import {
	type ParentComponent,
	createContext,
	createRoot,
	createSignal,
	useContext,
} from 'solid-js'

export type CodeDocument = {
	id: string
	index: number
	name: string
	createdAt: Date
	deletedAt: Date | null
	content: string
}

type CodeDocumentStore = Record<string, CodeDocument>

function createCodeDocumentsContext() {
	return createRoot(() => {
		const [error, setError] = createSignal<ErrorEvent>()
		const [activeId, setActiveId] = createSignal<string>()
		const [store, setStore] = createClientStore<CodeDocumentStore>({
			name: 'code-documents',
			version: 1,
			initialValue: {},
			onError: setError,
			shouldPersist: true,
		})

		const count = () => Object.keys(store().value).length

		async function create(name: string): Promise<string> {
			const id = crypto.randomUUID()

			const document: CodeDocument = {
				id,
				name,
				index: count() + 1,
				createdAt: new Date(),
				deletedAt: null,
				content: '',
			}

			setStore({
				value: {
					...store().value,
					[id]: document,
				},
			})

			setActiveId(id)

			return id
		}

		function _delete(id: string): void {
			const newStore: CodeDocumentStore = { ...store().value }

			newStore[id].deletedAt = new Date()

			setStore({ value: newStore })
		}

		function clearError() {
			setError(undefined)
		}

		return {
			all: store,
			set: setStore,
			delete: _delete,
			create,
			count,
			error,
			activeId,
			clearError,
			activate: setActiveId,
		} as const
	})
}

const codeDocumentsContext = createCodeDocumentsContext()
const context = createContext(codeDocumentsContext)

export function useCodeDocuments() {
	return useContext(context)
}

export const CodeDocuments: ParentComponent = (props) => {
	return (
		<context.Provider value={codeDocumentsContext}>
			{props.children}
		</context.Provider>
	)
}
