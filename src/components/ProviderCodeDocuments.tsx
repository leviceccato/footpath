import { createContext, useContext, createRoot } from 'solid-js'
import type { ParentComponent } from 'solid-js'
import { createClientStore } from '@/utils/storage'

const uuid = () => import('uuid')

type CodeDocument = {
	id: string
	index: number
	name: string
	createdAt: Date
	deletedAt: Date | null
	content: string
}

function createCodeDocumentsContext() {
	return createRoot(() => {
		const [codeDocuments, setCodeDocuments] = createClientStore<
			Record<string, CodeDocument>
		>({
			name: 'code-documents',
			version: 1,
			initialValue: {},
			onError: handleError,
			shouldPersist: true,
		})

		const codeDocumentCount = () => Object.keys(codeDocuments).length

		async function createCodeDocument(
			name: string,
			index: number,
		): Promise<string> {
			const { v4 } = await uuid()
			const id = v4()

			const document = {
				id,
				name,
				index,
				createdAt: new Date(),
				deletedAt: null,
				content: '',
			}

			setCodeDocuments({
				...codeDocuments,
				[id]: document,
			})
			return id
		}

		function handleError(error: ErrorEvent): void {
			console.log(error)
		}

		return [
			codeDocuments,
			{ setCodeDocuments, createCodeDocument, codeDocumentCount },
		] as const
	})
}

const context = createContext(createCodeDocumentsContext())

export function useDocuments() {
	return useContext(context)
}

const ProviderCodeDocuments: ParentComponent = (props) => {
	return (
		<context.Provider value={createCodeDocumentsContext()}>
			{props.children}
		</context.Provider>
	)
}

export default ProviderCodeDocuments
