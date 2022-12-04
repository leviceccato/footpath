import { createContext, useContext, createUniqueId } from 'solid-js'
import type { ParentComponent } from 'solid-js'

const id = createUniqueId()
const attr = `data-focusable-${id}`

function getFocusables(parent: Element): NodeListOf<Element> {
	return parent.querySelectorAll(attr)
}

function setFocusablesActive(parent: Element, to: boolean): void {
	getFocusables(parent).forEach((el) => {
		el.setAttribute('tabindex', to ? '0' : '-1')
	})
}

function createFocusContext() {
	return [
		{
			[attr]: true,
			tabindex: '0',
		},
		{ getFocusables, setFocusablesActive },
	] as const
}

const context = createContext(createFocusContext())

export function useFocus() {
	return useContext(context)
}

const ProviderFocus: ParentComponent = (props) => {
	return (
		<context.Provider value={createFocusContext()}>
			{props.children}
		</context.Provider>
	)
}

export default ProviderFocus
