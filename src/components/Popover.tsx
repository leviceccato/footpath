import { FocusTrap } from '@/providers/FocusTrap'
import { usePortal } from '@/providers/Portal'
import { roundByDpr, sleep } from '@/utils/misc'
import { defaultProps } from '@/utils/solid'
import {
	type ComputePositionReturn,
	type Placement,
	type VirtualElement,
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
import { type ButtonProps } from './Button'
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
	class?: string
	elementRef?: ButtonProps['refSignal']
	virtualElement?: Accessor<VirtualElement | undefined>
	state: Signal<PopoverState | undefined>
	when?: boolean | 'hover' | 'click'
	groupId?: string
	hasArrow?: boolean
	offset?: number
	shiftPadding?: number
	hoverDelay?: number
	placement?: Placement
	mount?: string
	onShown?: () => void
	onHidden?: () => void
	onUpdate?: (_: ComputePositionReturn) => void
}> = (rawProps) => {
	const props = defaultProps(rawProps, {
		placement: 'bottom-start',
		class: '',
		hoverDelay: 400,
		hasArrow: false,
		mount: 'modal',
		shiftPadding: 4,
		offset: 0,
	})

	const portal = usePortal()
	const [state, setState] = props.state
	const id = createUniqueId()

	store.addPopover(id, props.groupId)

	let stopAutoUpdate: (() => void) | undefined
	let update: (() => Promise<void>) | undefined
	const [contentRef, setContentRef] = createSignal<HTMLDivElement>()
	const [arrowRef, setArrowRef] = createSignal<HTMLDivElement>()
	const [isHovered, setIsHovered] = createSignal(false)
	const [x, setX] = createSignal(0)
	const [y, setY] = createSignal(0)
	const [arrowX, setArrowX] = createSignal(0)
	const [arrowY, setArrowY] = createSignal(0)

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
				{ placement: 'bottom-start', middleware },
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
			isShown: store.isPopoverShown(id)(),
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
			elementValue.addEventListener('click', handleClick)
			elementValue.addEventListener('focusin', handleHoverIn)
			elementValue.addEventListener('focusout', handleHoverOut)
			elementValue.addEventListener('mouseenter', handleHoverIn)
			elementValue.addEventListener('mouseleave', handleHoverOut)
		}
	})

	onCleanup(() => {
		stopAutoUpdate?.()
		toggleEventListeners(false)
		store.removePopover(id)

		const elementValue = element()
		if (elementValue instanceof HTMLButtonElement) {
			elementValue.removeEventListener('click', handleClick)
			elementValue.removeEventListener('focusin', handleHoverIn)
			elementValue.removeEventListener('focusout', handleHoverOut)
			elementValue.removeEventListener('mouseenter', handleHoverIn)
			elementValue.removeEventListener('mouseleave', handleHoverOut)
		}
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
