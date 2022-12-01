import {
	createUniqueId,
	onMount,
	onCleanup,
	mergeProps,
	createSignal,
	createEffect,
	createRoot,
	Show,
} from 'solid-js'
import type { ParentComponent, JSX, Accessor, Setter } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import type { StrictModifiers, Options, Instance } from '@popperjs/core'
import * as css from './Popover.css'
import { Portal } from 'solid-js/web'
import { usePortal } from '@/components/ProviderPortal'

type PopoverState = {
	isShown: () => boolean
}

type Popover = PopoverState & {
	id: string
	groupId?: string
	setIsShown: Setter<boolean>
}

type InteractionMethod = 'hover' | 'click'

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

	function getOpenGroupMembers(groupId?: string): Popover[] {
		return popovers().filter(
			(p) => p.isShown() && Boolean(groupId) && p.groupId === groupId,
		)
	}

	function setPopoverShown(id: string, isShown: boolean) {
		const popover = getPopover(id)
		if (!popover) return

		getOpenGroupMembers(popover.groupId).forEach((p) => {
			p.setIsShown(false)
		})

		popover.setIsShown(isShown)
	}

	return {
		addPopover,
		removePopover,
		isPopoverShown,
		setPopoverShown,
		getOpenGroupMembers,
	}
})

const Popover: ParentComponent<{
	when?: boolean | InteractionMethod
	class?: string
	groupId?: string
	referenceTag?: string
	reference?: JSX.Element | ((state: PopoverState) => JSX.Element)
	options?: Partial<Options>
}> = (props) => {
	const _props = mergeProps({ referenceTag: 'div', hoverDelay: 400 }, props)

	const [mounts] = usePortal()

	const id = createUniqueId()

	const {
		addPopover,
		removePopover,
		isPopoverShown,
		setPopoverShown,
		getOpenGroupMembers,
	} = store

	addPopover(id, _props.groupId)

	let popper: Instance | undefined
	let referenceRef: HTMLDivElement | undefined

	const [contentRef, setContentRef] = createSignal<HTMLDivElement>()

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

	const modal = () => mounts().get('modal')

	function handleClick() {
		if (_props.when === 'click') {
			return setPopoverShown(id, !isShown())
		}
	}

	function handleHover(isIn: boolean) {
		if (_props.when === 'hover') {
			return setPopoverShown(id, isIn)
		}
		if (isIn && getOpenGroupMembers(_props.groupId).length) {
			return setPopoverShown(id, true)
		}
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
			window.addEventListener('pointerdown', handleClickOutsideToClose)
			window.addEventListener('keydown', handleEscapeToClose)
			return
		}
		window.removeEventListener('pointerdown', handleClickOutsideToClose)
		window.removeEventListener('keydown', handleEscapeToClose)
	}

	function handleClickOutsideToClose({ target }: Event) {
		if (!(target instanceof Node)) {
			return
		}

		const isOutsideReference = !referenceRef?.contains(target)
		const isOutsideContent = !contentRef()?.contains(target)

		if (isOutsideReference && isOutsideContent) {
			setPopoverShown(id, false)
		}
	}

	function handleEscapeToClose({ key }: KeyboardEvent) {
		if (key === 'Escape') {
			setPopoverShown(id, false)
		}
	}

	async function initPopper() {
		const _contentRef = contentRef()

		if (
			!(referenceRef instanceof Element) ||
			!(_contentRef instanceof HTMLElement)
		) {
			return
		}

		const { createPopper } = await import('@popperjs/core')

		popper = createPopper<StrictModifiers>(
			referenceRef,
			_contentRef,
			_props.options,
		)
	}

	createEffect(() => {
		if (mounts().get('modal') && contentRef() && !popper) {
			initPopper()
		}
	})

	createEffect(() => {
		if (isShown()) {
			toggleEventListeners(true)
			return popper?.update()
		}
		toggleEventListeners(false)
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
				onClick={handleClick}
				onFocusIn={[handleHover, true]}
				onFocusOut={[handleHover, false]}
				onMouseEnter={[handleHover, true]}
				onMouseLeave={[handleHover, false]}
			>
				{reference()}
			</Dynamic>
			<Show when={modal()}>
				<Portal mount={modal()}>
					<div
						class={css.contentVariants[contentVariant()]}
						ref={(ref) => setContentRef(ref)}
						id={id}
						role="tooltip"
					>
						<Show when={isShown()}>{_props.children}</Show>
					</div>
				</Portal>
			</Show>
		</>
	)
}

export default Popover
