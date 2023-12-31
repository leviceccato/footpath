import { Button, type ButtonProps } from '@/components/Button'
import { FocusTrap } from '@/providers/FocusTrap'
import { usePortal } from '@/providers/Portal'
import { type GlobalWindow, sleep } from '@/utils/misc'
import { type ClassProps, defaultProps } from '@/utils/solid'
import {
	type Instance,
	type Options,
	type StrictModifiers,
	type VirtualElement,
} from '@popperjs/core'
import {
	type Accessor,
	type JSX,
	type ParentComponent,
	type Setter,
	Show,
	createEffect,
	createRoot,
	createSignal,
	createUniqueId,
	onCleanup,
} from 'solid-js'
import { Portal } from 'solid-js/web'
import * as css from './Popover.css'
const importPopper = () => import('@popperjs/core')

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

const defaultRect = new DOMRect()

export const Popover: ParentComponent<
	ButtonProps &
		ClassProps & {
			when?: boolean | 'hover' | 'click'
			isShownClass?: string
			groupId?: string
			reference: (state: PopoverState) => JSX.Element
			virtualReference?: {
				getBoundingClientRect: VirtualElement['getBoundingClientRect'] | null
			}
			options?: Partial<Options>
			hasArrow?: boolean
			hoverDelay?: number
			tooltipClass?: string
			mount?: string
			onShown?: () => void
			onHidden?: () => void
			onUpdateInstance?: (_: Instance) => void
		}
> = (rawProps) => {
	const props = defaultProps(rawProps, {
		hoverDelay: 400,
		hasArrow: false,
		mount: 'modal',
		tooltipClass: '',
		class: '',
		isShownClass: '',
	})

	const { mounts } = usePortal()

	const id = createUniqueId()

	const {
		addPopover,
		removePopover,
		isPopoverShown,
		setPopoverShown,
		getOpenGroupMembers,
	} = store

	addPopover(id, props.groupId)

	let popperInstance: Instance | undefined
	let referenceRef: HTMLButtonElement | undefined
	let arrowRef: HTMLDivElement | undefined
	let contentObserver: ResizeObserver | undefined

	const [contentRef, setContentRef] = createSignal<HTMLDivElement>()
	const [isHovered, setIsHovered] = createSignal(false)

	const isShown = () => isPopoverShown(id)()

	const contentVariant = (): keyof typeof css.contentVariants => {
		return isShown() ? 'shown' : 'hidden'
	}

	const mount = () => mounts().get(props.mount)

	function _setPopoverShown(to: boolean): void {
		setPopoverShown(id, to)
	}

	function handleClick(
		event: MouseEvent & {
			currentTarget: HTMLButtonElement
			target: Element
		},
	): void {
		if (typeof props.onClick === 'function') {
			props.onClick(event)
		}
		if (props.when === 'click') {
			return _setPopoverShown(!isShown())
		}
	}

	async function handleHover(isIn: boolean): Promise<void> {
		setIsHovered(isIn)

		if (props.when === 'hover') {
			await sleep(isHovered() ? props.hoverDelay : 0)

			return _setPopoverShown(isHovered())
		}

		if (isHovered() && getOpenGroupMembers(props.groupId).length) {
			return _setPopoverShown(true)
		}
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
		target: EventTarget | null,
		_window: GlobalWindow | null,
	): void {
		if (!_window) return
		if (!(target instanceof _window.Node)) return

		const isOutsideReference = !referenceRef?.contains(target)
		const isOutsideContent = !contentRef()?.contains(target)

		if (isOutsideReference && isOutsideContent) {
			_setPopoverShown(false)
		}
	}

	function addIframeListeners(): void {
		document.querySelectorAll('iframe').forEach((iframe) => {
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
		})
	}

	function handleClickToClose({ target }: Event): void {
		hideIfTargetOutside(target, window)
	}

	function handleEscapeToClose({ key }: KeyboardEvent): void {
		if (key === 'Escape') {
			_setPopoverShown(false)
		}
	}

	function getReferenceRect(): DOMRect {
		const getRect = props.virtualReference?.getBoundingClientRect
		if (getRect) {
			return getRect()
		}
		if (referenceRef) {
			return referenceRef.getBoundingClientRect()
		}
		return defaultRect
	}

	async function initPopper(): Promise<void> {
		const _contentRef = contentRef()

		if (!(_contentRef instanceof HTMLElement)) {
			return
		}

		// Create popper instance

		const { createPopper } = await importPopper()

		const options = {
			...props.options,
		}

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
			{
				getBoundingClientRect: getReferenceRect,
			},
			_contentRef,
			options,
		)
		props.onUpdateInstance?.(popperInstance)

		// Setup resize observer to update popper when content changes

		contentObserver = new ResizeObserver(() => popperInstance?.update())

		contentObserver.observe(_contentRef)
	}

	function handleMouseLeave(
		event: MouseEvent & { currentTarget: HTMLButtonElement; target: Element },
	): void {
		if (typeof props.onMouseLeave === 'function') {
			props.onMouseLeave(event)
		}
		handleHover(false)
	}

	createEffect(() => {
		if (mount() && contentRef() && !popperInstance) {
			initPopper()
		}
	})

	createEffect(() => {
		if (isShown()) {
			toggleEventListeners(true)
			props.onShown?.()
			return popperInstance?.update()
		}
		props.onHidden?.()
		toggleEventListeners(false)
	})

	onCleanup(() => {
		contentObserver?.disconnect()
		toggleEventListeners(false)
		removePopover(id)
	})

	return (
		<>
			<Button
				class={`${props.class} ${isShown() ? props.isShownClass : ''}`}
				ref={referenceRef}
				aria-describedby={id}
				onClick={handleClick}
				onFocusIn={[handleHover, true]}
				onFocusOut={[handleHover, false]}
				onMouseEnter={[handleHover, true]}
				onMouseLeave={handleMouseLeave}
				onMouseMove={props.onMouseMove}
			>
				{props.reference({ isShown })}
			</Button>
			<Show when={mount()}>
				<Portal mount={mount()}>
					<div
						class={`${css.contentVariants[contentVariant()]} ${
							props.tooltipClass
						}`}
						ref={(ref) => setContentRef(ref)}
						id={id}
						role="tooltip"
					>
						<Show when={props.hasArrow}>
							<div
								ref={arrowRef}
								class={css.arrow}
							>
								<div class={css.arrowInner} />
							</div>
						</Show>
						<Show when={isShown()}>
							<FocusTrap when={isShown()}>{() => props.children}</FocusTrap>
						</Show>
					</div>
				</Portal>
			</Show>
		</>
	)
}
