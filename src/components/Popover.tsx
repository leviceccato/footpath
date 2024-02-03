import { FocusTrap } from '@/providers/FocusTrap'
import { usePortal } from '@/providers/Portal'
import { type GlobalWindow, sleep } from '@/utils/misc'
import { defaultProps } from '@/utils/solid'
import {
	type Instance,
	type Options,
	type StrictModifiers,
	type VirtualElement,
} from '@popperjs/core'
import {
	type Accessor,
	type ParentComponent,
	type Setter,
	Show,
	type Signal,
	createEffect,
	createRoot,
	createSignal,
	createUniqueId,
	onCleanup,
	onMount,
} from 'solid-js'
import { Portal } from 'solid-js/web'
import * as css from './Popover.css'
const importPopper = () => import('@popperjs/core')

export type PopoverState = {
	isShown: boolean
}

type Popover = {
	id: string
	groupId?: string
	isShown: Accessor<boolean>
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
		if (!popover) {
			return () => false
		}

		return popover.isShown
	}

	function getOpenGroupMembers(groupId?: string): Popover[] {
		return popovers().filter(
			(p) => p.isShown() && Boolean(groupId) && p.groupId === groupId,
		)
	}

	function setPopoverShown(id: string, isShown: boolean) {
		const popover = getPopover(id)
		if (!popover) {
			return
		}

		for (const groupMember of getOpenGroupMembers(popover.groupId)) {
			groupMember.setIsShown(false)
		}

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

export const Popover: ParentComponent<{
	element: Element | VirtualElement
	state: Signal<PopoverState | undefined>
	when?: boolean | 'hover' | 'click'
	groupId?: string
	options?: Partial<Options>
	hasArrow?: boolean
	hoverDelay?: number
	mount?: string
	onShown?: () => void
	onHidden?: () => void
	onUpdateInstance?: (_: Instance) => void
}> = (rawProps) => {
	const props = defaultProps(rawProps, {
		hoverDelay: 400,
		hasArrow: false,
		mount: 'modal',
	})

	const portal = usePortal()

	const [state, setState] = props.state

	const id = createUniqueId()

	store.addPopover(id, props.groupId)

	let popperInstance: Instance | undefined
	let arrowRef: HTMLDivElement | undefined
	let contentObserver: ResizeObserver | undefined

	const [contentRef, setContentRef] = createSignal<HTMLDivElement>()
	const [isHovered, setIsHovered] = createSignal(false)

	const contentVariant = (): keyof typeof css.contentVariants => {
		return state()?.isShown ? 'shown' : 'hidden'
	}

	const portalMount = () => portal.mounts().get(props.mount)

	function setPopoverShown(to: boolean): void {
		store.setPopoverShown(id, to)
	}

	function handleClick(): void {
		if (props.when === 'click') {
			setPopoverShown(!state()?.isShown)
		}
	}

	async function handleHover(isIn: boolean): Promise<void> {
		setIsHovered(isIn)

		if (props.when === 'hover') {
			await sleep(isHovered() ? props.hoverDelay : 0)
			return setPopoverShown(isHovered())
		}

		if (isHovered() && store.getOpenGroupMembers(props.groupId).length) {
			return setPopoverShown(true)
		}
	}

	function handleHoverOut(): void {
		handleHover(false)
	}

	function handleHoverIn(): void {
		handleHover(true)
	}

	function toggleEventListeners(enabled: boolean): void {
		popperInstance?.setOptions((options) => ({
			...options,
			modifiers: [
				...(options.modifiers || []),
				{ name: 'eventListeners', enabled },
			],
		}))
		if (enabled) {
			window.addEventListener('pointerdown', handleClickToClose)
			addIframeListeners()
			window.addEventListener('keydown', handleEscapeToClose)
			return
		}
		window.removeEventListener('pointerdown', handleClickToClose)
		window.removeEventListener('keydown', handleEscapeToClose)
	}

	function hideIfTargetOutside(
		maybeTarget: EventTarget | null,
		maybeWindow: GlobalWindow | null,
	): void {
		if (!maybeWindow) return
		if (!(maybeTarget instanceof maybeWindow.Node)) return

		const isOutsideReference =
			props.element instanceof Element && !props.element?.contains(maybeTarget)
		const isOutsideContent = !contentRef()?.contains(maybeTarget)

		if (isOutsideReference && isOutsideContent) {
			setPopoverShown(false)
		}
	}

	function addIframeListeners(): void {
		for (const iframe of document.querySelectorAll('iframe')) {
			if (!iframe.contentWindow) return

			iframe.contentWindow.document.addEventListener(
				'click',
				({ target }: Event) => {
					hideIfTargetOutside(target, iframe.contentWindow as GlobalWindow)
				},
				{
					once: true,
				},
			)
		}
	}

	function handleClickToClose({ target }: Event): void {
		hideIfTargetOutside(target, window)
	}

	function handleEscapeToClose({ key }: KeyboardEvent): void {
		if (key === 'Escape') {
			setPopoverShown(false)
		}
	}

	async function initPopper(): Promise<void> {
		const contentRefValue = contentRef()

		if (!(contentRefValue instanceof HTMLElement)) {
			return
		}

		/* Create popper instance */

		const { createPopper } = await importPopper()

		const options = structuredClone(props.options) ?? {}
		if (props.hasArrow) {
			options.modifiers = [
				...(options.modifiers || []),
				{
					name: 'arrow',
					options: {
						element: arrowRef,
					},
				},
			]
		}

		popperInstance = createPopper<StrictModifiers>(
			props.element,
			contentRefValue,
			options,
		)
		props.onUpdateInstance?.(popperInstance)

		/* Setup resize observer to update popper when content changes */

		contentObserver = new ResizeObserver(() => popperInstance?.update())

		contentObserver.observe(contentRefValue)
	}

	createEffect(() => {
		if (portalMount() && contentRef() && !popperInstance) {
			initPopper()
		}
	})

	createEffect(() => {
		setState({
			isShown: store.isPopoverShown(id)(),
		})
	})

	createEffect(() => {
		if (state()?.isShown) {
			toggleEventListeners(true)
			props.onShown?.()
			return popperInstance?.update()
		}
		props.onHidden?.()
		toggleEventListeners(false)
	})

	onMount(() => {
		if (props.element instanceof Element) {
			props.element.addEventListener('click', handleClick)
			props.element.addEventListener('focusin', handleHoverIn)
			props.element.addEventListener('focusout', handleHoverOut)
			props.element.addEventListener('mouseenter', handleHoverIn)
			props.element.addEventListener('mouseleave', handleHoverOut)
		}
	})

	onCleanup(() => {
		contentObserver?.disconnect()
		toggleEventListeners(false)
		store.removePopover(id)

		if (props.element instanceof Element) {
			props.element.removeEventListener('click', handleClick)
			props.element.removeEventListener('focusin', handleHoverIn)
			props.element.removeEventListener('focusout', handleHoverOut)
			props.element.removeEventListener('mouseenter', handleHoverIn)
			props.element.removeEventListener('mouseleave', handleHoverOut)
		}
	})

	return (
		<Show when={portalMount()}>
			<Portal mount={portalMount()}>
				<div
					class={css.contentVariants[contentVariant()]}
					ref={(ref) => setContentRef(ref)}
					id={id}
					role="tooltip"
				>
					<Show when={props.hasArrow}>
						<div ref={arrowRef} class={css.arrow}>
							<div class={css.arrowInner} />
						</div>
					</Show>
					<Show when={state()?.isShown}>
						<FocusTrap when={state()?.isShown || false}>
							{() => props.children}
						</FocusTrap>
					</Show>
				</div>
			</Portal>
		</Show>
	)
}
