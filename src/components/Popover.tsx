import {
	createUniqueId,
	onMount,
	onCleanup,
	mergeProps,
	createSignal,
	createEffect,
} from 'solid-js'
import type { ParentComponent, JSX, FlowProps, Accessor } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import type { StrictModifiers, Options, Instance } from '@popperjs/core'
import * as css from './Popover.css'

const Popover: ParentComponent<{
	when?: boolean | 'hover' | 'click'
	class?: string
	referenceTag?: string
	contentTag?: string
	reference?:
		| JSX.Element
		| ((state: {
				isToggled: Accessor<boolean>
				isFocused: Accessor<boolean>
				isHovered: Accessor<boolean>
				isShown: () => boolean
		  }) => JSX.Element)
	options?: Partial<Options>
}> = (props) => {
	const _props = mergeProps({ referenceTag: 'div', contentTag: 'div' }, props)

	const id = createUniqueId()

	let popper: Instance | undefined
	let referenceRef: HTMLDivElement | undefined
	let contentRef: HTMLDivElement | undefined

	const [isHovered, setIsHovered] = createSignal(false)
	const [isFocused, setIsFocused] = createSignal(false)
	const [isToggled, setIsToggled] = createSignal(false)

	const isShown = (): boolean => {
		if (_props.when === 'hover') {
			return isHovered() || isFocused()
		}
		if (_props.when === 'click') {
			return isToggled()
		}
		return Boolean(_props.when)
	}

	const reference = () => {
		if (typeof _props.reference === 'function') {
			return _props.reference({ isHovered, isFocused, isToggled, isShown })
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
			setIsToggled(false)
		}
	}

	function handleEscapeToClose({ key }: KeyboardEvent) {
		if (key === 'Escape') {
			setIsToggled(false)
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
	})

	return (
		<>
			<Dynamic
				component={_props.referenceTag}
				class={_props.class ?? ''}
				ref={referenceRef}
				aria-describedby={id}
				onClick={() => setIsToggled((v) => !v)}
				focusin={[setIsFocused, true]}
				focusout={[setIsFocused, false]}
				mouseenter={[setIsHovered, true]}
				mouseleave={[setIsHovered, false]}
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
