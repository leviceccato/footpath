import {
	createUniqueId,
	onMount,
	onCleanup,
	mergeProps,
	createSignal,
	createEffect,
	createRoot,
} from 'solid-js'
import type {
	ParentComponent,
	JSX,
	FlowProps,
	Accessor,
	Setter,
} from 'solid-js'
import { Dynamic } from 'solid-js/web'
import type { StrictModifiers, Options, Instance } from '@popperjs/core'
import * as css from './Popover.css'

type PopoverState = {
	isShown: () => boolean
}

type Popover = PopoverState & {
	id: string
	groupId?: string
	setIsShown: Setter<boolean>
}

const store = createRoot(() => {
	const [popovers, setPopovers] = createSignal<Popover[]>([])

	function addPopover(id: string, groupId?: string) {
		const [isShown, setIsShown] = createSignal(false)

		setPopovers([
			...popovers(),
			{
				id,
				groupId,
				isShown,
				setIsShown,
			},
		])
	}

	function removePopover(id: string) {
		setPopovers(popovers().filter((p) => p.id !== id))
	}

	function getPopover(id: string): Popover | undefined {
		return popovers().find((p) => p.id === id)
	}

	function isPopoverShown(id: string): Accessor<boolean> {
		const popover = getPopover(id)
		if (!popover) return () => false

		return popover.isShown
	}

	function setPopoverShown(id: string, to: boolean) {
		const popover = getPopover(id)
		if (!popover) return

		popover.setIsShown(to)
	}

	return {
		addPopover,
		removePopover,
		isPopoverShown,
		setPopoverShown,
	}
})

const Popover: ParentComponent<{
	when?: boolean | 'hover' | 'click'
	class?: string
	groupId?: string
	referenceTag?: string
	contentTag?: string
	reference?: JSX.Element | ((state: PopoverState) => JSX.Element)
	options?: Partial<Options>
}> = (props) => {
	const _props = mergeProps({ referenceTag: 'div', contentTag: 'div' }, props)

	const id = createUniqueId()

	const { addPopover, removePopover, isPopoverShown, setPopoverShown } = store

	addPopover(id, _props.groupId)

	let popper: Instance | undefined
	let referenceRef: HTMLDivElement | undefined
	let contentRef: HTMLDivElement | undefined

	const isShown = () => isPopoverShown(id)()

	const reference = () => {
		if (typeof _props.reference === 'function') {
			return _props.reference({ isShown })
		}
		return props.reference
	}

	const contentVariant = (): keyof typeof css.contentVariants => {
		return isShown() ? 'shown' : 'hidden'
	}

	function toggleEventListeners(enabled: boolean) {
		popper?.setOptions((options) => ({
			...options,
			modifiers: [
				...(options.modifiers || []),
				{ name: 'eventListeners', enabled },
			],
		}))
		if (enabled) {
			window.addEventListener('click', handleClickOutsideToClose)
			window.addEventListener('keydown', handleEscapeToClose)
			return
		}
		window.removeEventListener('click', handleClickOutsideToClose)
		window.removeEventListener('keydown', handleEscapeToClose)
	}

	function handleClickOutsideToClose({ target }: Event) {
		if (!(target instanceof Node)) {
			return
		}

		const isOutsideReference = !referenceRef?.contains(target)
		const isOutsideContent = !contentRef?.contains(target)

		if (isOutsideReference && isOutsideContent) {
			setPopoverShown(id, false)
		}
	}

	function handleEscapeToClose({ key }: KeyboardEvent) {
		if (key === 'Escape') {
			setPopoverShown(id, false)
		}
	}

	createEffect(() => {
		if (isShown()) {
			toggleEventListeners(true)
			return popper?.update()
		}
		toggleEventListeners(false)
	})

	onMount(async () => {
		if (
			!(referenceRef instanceof Element) ||
			!(contentRef instanceof HTMLElement)
		) {
			return
		}

		const { createPopper } = await import('@popperjs/core')

		popper = createPopper<StrictModifiers>(
			referenceRef,
			contentRef,
			_props.options,
		)
	})

	onCleanup(() => {
		toggleEventListeners(false)
		removePopover(id)
	})

	return (
		<>
			<Dynamic
				component={_props.referenceTag}
				class={_props.class ?? ''}
				ref={referenceRef}
				aria-describedby={id}
				onClick={[setPopoverShown, id, true]}
				// onfocusin={handleHover}
				// onfocusout={[setIsHovered, false]}
				// onmouseenter={handleHover}
				// onmouseleave={[setIsHovered, false]}
			>
				{reference()}
			</Dynamic>
			<Dynamic
				class={css.contentVariants[contentVariant()]}
				component={_props.contentTag}
				ref={contentRef}
				id={id}
				role="tooltip"
			>
				{_props.children}
			</Dynamic>
		</>
	)
}

export default Popover
