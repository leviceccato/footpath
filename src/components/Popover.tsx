import { createUniqueId, onMount } from 'solid-js'
import type { ParentComponent, JSX } from 'solid-js'
import type { StrictModifiers } from '@popperjs/core'

const Popover: ParentComponent<{ content?: JSX.Element }> = (props) => {
	const id = createUniqueId()

	let childrenRef: HTMLDivElement | undefined
	let contentRef: HTMLDivElement | undefined

	onMount(async () => {
		if (
			!(childrenRef instanceof Element) ||
			!(contentRef instanceof HTMLElement)
		) {
			return
		}

		const { createPopper } = await import('@popperjs/core')

		createPopper<StrictModifiers>(childrenRef, contentRef, {})
	})

	return (
		<>
			<div
				ref={childrenRef}
				aria-describedby={id}
			>
				{props.children}
			</div>
			<div
				ref={contentRef}
				id={id}
				role="tooltip"
			>
				{props.content}
			</div>
		</>
	)
}
