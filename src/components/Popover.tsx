import { FocusTrap } from '@/providers/FocusTrap'
import { usePortal } from '@/providers/Portal'
import { roundByDpr, sleep } from '@/utils/misc'
import { defaultProps, useEventListener } from '@/utils/solid'
import type {
	ComputePositionReturn,
	OffsetOptions,
	Placement,
	VirtualElement,
} from '@floating-ui/dom'
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
import type { ButtonProps } from './Button'
import * as css from './Popover.css'
const importFloatingUi = () => import('@floating-ui/dom')

export type PopoverState = {
	isShown: boolean
}

type Popover = {
	id: string
	groupId?: string
	isShown: Accessor<boolean>
	setIsShown: Setter<boolean>
}

const popoverStore = createRoot(() => {
	const [popovers, setPopovers] = createSignal<Popover[]>([])

	function add(id: string, groupId?: string) {
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

	function remove(id: string) {
		setPopovers(popovers().filter((p) => p.id !== id))
	}

	function get(id: string): Popover | undefined {
		return popovers().find((p) => p.id === id)
	}

	function isShown(id: string): Accessor<boolean> {
		const popover = get(id)
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

	function setIsShown(id: string, isShown: boolean) {
		const popover = get(id)
		if (!popover) {
			return
		}

		for (const groupMember of getOpenGroupMembers(popover.groupId)) {
			groupMember.setIsShown(false)
		}

		popover.setIsShown(isShown)
	}

	return {
		add,
		remove,
		isShown,
		setIsShown,
		getOpenGroupMembers,
	}
})

export type PopoverProps = {
	class?: string
	elementRef?: ButtonProps['refSignal']
	virtualElement?: Accessor<VirtualElement | undefined>
	state?: Signal<PopoverState | undefined>
	when?: boolean | 'hover-reference' | 'click'
	groupId?: string
	hasArrow?: boolean
	offset?: OffsetOptions
	shiftPadding?: number
	hoverShowDelay?: number
	hoverHideDelay?: number
	placement?: Placement
	mount?: string
	onShown?: () => void
	onHidden?: () => void
	onUpdate?: (_: ComputePositionReturn) => void
}

export const Popover: ParentComponent<PopoverProps> = (rawProps) => {
	const props = defaultProps(rawProps, {
		placement: 'right',
		class: '',
		hoverShowDelay: 400,
		/* This should never be zero. A small delay is required here to prevent flickering
		as floating UI attempts to position itself */
		hoverHideDelay: 10,
		hasArrow: false,
		mount: 'modal',
		shiftPadding: 4,
		offset: 4,
		state: createSignal(),
	})

	const portal = usePortal()
	const [state, setState] = props.state
	const id = createUniqueId()

	popoverStore.add(id, props.groupId)

	let stopAutoUpdate: (() => void) | undefined
	let update: (() => Promise<void>) | undefined
	const [contentRef, setContentRef] = createSignal<HTMLDivElement>()
	const [arrowRef, setArrowRef] = createSignal<HTMLDivElement>()
	const [isReferenceHovered, setIsReferenceHovered] = createSignal(false)
	const [x, setX] = createSignal(0)
	const [y, setY] = createSignal(0)
	const [arrowX, setArrowX] = createSignal(0)
	const [arrowY, setArrowY] = createSignal(0)

	/*
	We need to explicity track if the mouse has triggered a Popover. This is for a very 
	specific situation: say we have two Popovers bound to an element, one is with hover and
	the other with click and it includes focusable elements. When we initially hover the
	element, the hover Popover will be shown. When we click, the click Popover will be shown
	BUT the hover Popover gets hidden. This is because we are actually focusing inside the
	click Popover which the hover Popover is reacting to.
	
	By introducing this state we can track if the mouse is inside element and prevent the
	Popover from being hidden if a focusout event occurs.
	*/
	const [isMouseWithin, setIsMouseWithin] = createSignal(false)

	const contentVariant = (): keyof typeof css.contentVariants => {
		return state()?.isShown ? 'shown' : 'hidden'
	}

	const portalMount = () => portal.mounts().get(props.mount)

	const element = () => {
		const virtualElement = props.virtualElement?.()
		if (virtualElement) {
			return virtualElement
		}

		if (!props.elementRef) {
			return undefined
		}

		return props.elementRef[0]()
	}

	function setPopoverShown(to: boolean): void {
		popoverStore.setIsShown(id, to)
	}

	function handleReferenceClick(): void {
		if (props.when === 'click') {
			setPopoverShown(!state()?.isShown)
		}
	}

	async function handleReferenceHover(isIn: boolean): Promise<void> {
		setIsReferenceHovered(isIn)

		if (props.when === 'hover-reference') {
			await sleep(
				isReferenceHovered() ? props.hoverShowDelay : props.hoverHideDelay,
			)
			return setPopoverShown(isReferenceHovered())
		}

		if (
			isReferenceHovered() &&
			popoverStore.getOpenGroupMembers(props.groupId).length
		) {
			return setPopoverShown(true)
		}
	}

	function handleReferenceHoverOut(event: Event): void {
		if (isMouseWithin() && event.type === 'focusout') {
			return
		}
		handleReferenceHover(false)
		setIsMouseWithin(false)
	}

	function handleReferenceHoverIn(event: Event): void {
		if (event.type === 'mouseenter') {
			setIsMouseWithin(true)
		}
		handleReferenceHover(true)
	}

	function toggleEventListeners(enabled: boolean): void {
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
		maybeWindow: Window | null,
	): void {
		if (!maybeWindow || !(maybeTarget instanceof Node)) {
			return
		}

		const elementValue = element()
		const isOutsideReference =
			elementValue instanceof Element && !elementValue?.contains(maybeTarget)
		const isOutsideContent = !contentRef()?.contains(maybeTarget)

		if (isOutsideReference && isOutsideContent) {
			setPopoverShown(false)
		}
	}

	function addIframeListeners(): void {
		for (const iframe of document.querySelectorAll('iframe')) {
			if (!iframe.contentWindow) {
				return
			}

			iframe.contentWindow.document.addEventListener(
				'click',
				({ target }: Event) => {
					hideIfTargetOutside(target, iframe.contentWindow)
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

	async function initFloatingUi(): Promise<void> {
		const contentRefValue = contentRef()
		const elementValue = element()
		if (!elementValue || !contentRefValue) {
			return
		}

		/* Start Floating UI */

		const floatingUi = await importFloatingUi()

		const middleware = [
			floatingUi.offset(props.offset),
			floatingUi.flip(),
			floatingUi.shift({
				padding: props.shiftPadding,
			}),
		]

		const arrowRefValue = arrowRef()
		if (props.hasArrow && arrowRefValue) {
			middleware.push(floatingUi.arrow({ element: arrowRefValue }))
		}

		update = async (): Promise<void> => {
			const elementValue = element()
			if (!elementValue) {
				return
			}

			const data = await floatingUi.computePosition(
				elementValue,
				contentRefValue,
				{ placement: props.placement, middleware },
			)

			setX(roundByDpr(data.x))
			setY(roundByDpr(data.y))
			setArrowX(roundByDpr(data.middlewareData.arrow?.x ?? 0))
			setArrowY(roundByDpr(data.middlewareData.arrow?.y ?? 0))

			props.onUpdate?.(data)
		}

		stopAutoUpdate = floatingUi.autoUpdate(
			elementValue,
			contentRefValue,
			update,
		)
	}

	createEffect(function maybeInitFloatingUi() {
		if (portalMount() && contentRef() && !stopAutoUpdate) {
			initFloatingUi()
		}
	})

	createEffect(function triggerUpdate() {
		if (props.virtualElement?.()) {
			update?.()
		}
	})

	createEffect(function updateState() {
		setState({
			isShown: popoverStore.isShown(id)(),
		})
	})

	createEffect(function handleIsShownUpdate() {
		if (state()?.isShown) {
			toggleEventListeners(true)
			props.onShown?.()
			return
		}
		props.onHidden?.()
		toggleEventListeners(false)
	})

	onMount(() => {
		const elementValue = element()
		if (elementValue instanceof HTMLButtonElement) {
			useEventListener({
				target: elementValue,
				eventName: 'click',
				listener: handleReferenceClick,
			})
			useEventListener({
				target: elementValue,
				eventName: 'focusin',
				listener: handleReferenceHoverIn,
			})
			useEventListener({
				target: elementValue,
				eventName: 'focusout',
				listener: handleReferenceHoverOut,
			})
			useEventListener({
				target: elementValue,
				eventName: 'mouseenter',
				listener: handleReferenceHoverIn,
			})
			useEventListener({
				target: elementValue,
				eventName: 'mouseleave',
				listener: handleReferenceHoverOut,
			})
		}
	})

	onCleanup(() => {
		stopAutoUpdate?.()
		toggleEventListeners(false)
		popoverStore.remove(id)
	})

	return (
		<Show when={portalMount()}>
			<Portal mount={portalMount()}>
				<div
					class={`${props.class} ${css.contentVariants[contentVariant()]}`}
					ref={(ref) => setContentRef(ref)}
					id={id}
					role="tooltip"
					style={`transform: translate(${x()}px, ${y()}px)`}
				>
					<Show when={props.hasArrow}>
						<div
							class={css.arrow}
							ref={(ref) => setArrowRef(ref)}
							style={`transform: translate(${arrowX()}px, ${arrowY()}px)`}
						>
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
