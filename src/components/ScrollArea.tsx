import 'simplebar/dist/simplebar.css'
import {
	onMount,
	onCleanup,
	createSignal,
	type ParentComponent,
} from 'solid-js'
import * as css from './ScrollArea.css'
import { type ClassProps, defaultProps } from '@/utils/misc'
const importSimpleBar = () => import('simplebar')

const ScrollArea: ParentComponent<
	ClassProps & {
		minDistanceForOverflowX?: number
		minDistanceForOverflowY?: number
		shouldScrollHorizontally?: boolean
	}
> = (rawProps) => {
	const props = defaultProps(rawProps, {
		minDistanceForOverflowX: 0,
		minDistanceForOverflowY: 0,
		shouldScrollHorizontally: true,
		class: '',
	})

	let rootRef: HTMLDivElement | undefined
	let scrollElement: HTMLElement | undefined
	let simpleBarInstance: SimpleBar | undefined

	// Reactive scroll data

	const [isOverflowingTop, setIsOverflowingTop] = createSignal(false)
	const [isOverflowingBottom, setIsOverflowingBottom] = createSignal(false)
	const [isOverflowingLeft, setIsOverflowingLeft] = createSignal(false)
	const [isOverflowingRight, setIsOverflowingRight] = createSignal(false)

	function checkOverflow() {
		if (!scrollElement) {
			return
		}

		// Set overflow booleans for each side based on minimum distance values

		setIsOverflowingTop(scrollElement.scrollTop > props.minDistanceForOverflowY)
		setIsOverflowingBottom(
			scrollElement.scrollHeight -
				scrollElement.scrollTop -
				scrollElement.clientHeight >
				props.minDistanceForOverflowY,
		)
		setIsOverflowingLeft(
			scrollElement.scrollLeft > props.minDistanceForOverflowX,
		)
		setIsOverflowingRight(
			scrollElement.scrollWidth -
				scrollElement.scrollLeft -
				scrollElement.clientWidth >
				props.minDistanceForOverflowX,
		)
	}

	function scrollHorizontally(event: WheelEvent) {
		if (!scrollElement) return

		scrollElement.scrollLeft += event.deltaY
	}

	onMount(async () => {
		if (!rootRef) return

		const SimpleBar = (await importSimpleBar()).default

		simpleBarInstance = new SimpleBar(rootRef, {})

		scrollElement = simpleBarInstance?.getScrollElement()
		scrollElement?.addEventListener('scroll', checkOverflow)
		window.addEventListener('resize', checkOverflow)

		if (props.shouldScrollHorizontally) {
			scrollElement?.addEventListener('wheel', scrollHorizontally, {
				passive: true,
			})
		}

		checkOverflow()
	})

	onCleanup(() => {
		window.removeEventListener('resize', checkOverflow)
	})

	// Use expected SimpleBar markup

	return (
		<div
			ref={rootRef}
			data-simplebar
			class={`${css.root} ${props.class}`}
		>
			<div class="simplebar-wrapper">
				<div class="simplebar-height-auto-observer-wrapper">
					<div class="simplebar-height-auto-observer" />
				</div>
				<div class="simplebar-mask">
					<div class="simplebar-offset">
						<div class={`${css.scrollable} simplebar-content-wrapper`}>
							<div class="simplebar-content">{props.children}</div>
						</div>
					</div>
				</div>
				<div class="simplebar-placeholder" />
			</div>
			<div class="simplebar-track simplebar-horizontal">
				<div class="simplebar-scrollbar">
					<div class="simplebar-scrollbar-inner" />
				</div>
			</div>
			<div class="simplebar-track simplebar-vertical">
				<div class="simplebar-scrollbar">
					<div class="simplebar-scrollbar-inner" />
				</div>
			</div>
			<div class={css.overlay}>
				<div
					classList={{
						[css.overflowShadowTop]: true,
						[css.shown]: isOverflowingTop(),
					}}
				/>
				<div
					classList={{
						[css.overflowShadowBottom]: true,
						[css.shown]: isOverflowingBottom(),
					}}
				/>
				<div
					classList={{
						[css.overflowShadowLeft]: true,
						[css.shown]: isOverflowingLeft(),
					}}
				/>
				<div
					classList={{
						[css.overflowShadowRight]: true,
						[css.shown]: isOverflowingRight(),
					}}
				/>
			</div>
		</div>
	)
}

export default ScrollArea
