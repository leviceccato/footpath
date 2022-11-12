import 'simplebar/dist/simplebar.css'

import { onMount, onCleanup, createSignal, mergeProps } from 'solid-js'
import type { ParentComponent } from 'solid-js'
import * as css from './ScrollArea.css'

const ScrollArea: ParentComponent<{
	minDistanceForOverflowX?: number
	minDistanceForOverflowY?: number
	shouldScrollHorizontally?: boolean
	class?: string
}> = (props) => {
	const _props = mergeProps(
		{
			minDistanceForOverflowX: 0,
			minDistanceForOverflowY: 0,
			shouldScrollHorizontally: true,
		},
		props,
	)

	let rootRef: HTMLDivElement | undefined
	let scrollElement: HTMLElement | undefined

	const [simpleBar, setSimpleBar] = createSignal<SimpleBar>()

	// Reactive scroll data

	const [scrollTop, setScrollTop] = createSignal(0)
	const [scrollLeft, setScrollLeft] = createSignal(0)
	const [isOverflowingTop, setIsOverflowingTop] = createSignal(false)
	const [isOverflowingBottom, setIsOverflowingBottom] = createSignal(false)
	const [isOverflowingLeft, setIsOverflowingLeft] = createSignal(false)
	const [isOverflowingRight, setIsOverflowingRight] = createSignal(false)

	function checkOverflow() {
		if (!scrollElement) {
			return
		}

		setScrollTop(scrollElement.scrollTop)
		setScrollLeft(scrollElement.scrollLeft)

		// Set overflow booleans for each side based on minimum distance values

		setIsOverflowingTop(
			scrollElement.scrollTop > _props.minDistanceForOverflowY,
		)
		setIsOverflowingBottom(
			scrollElement.scrollHeight -
				scrollElement.scrollTop -
				scrollElement.clientHeight >
				_props.minDistanceForOverflowY,
		)
		setIsOverflowingLeft(
			scrollElement.scrollLeft > _props.minDistanceForOverflowX,
		)
		setIsOverflowingRight(
			scrollElement.scrollWidth -
				scrollElement.scrollLeft -
				scrollElement.clientWidth >
				_props.minDistanceForOverflowX,
		)
	}

	function scrollHorizontally(event: WheelEvent) {
		if (!scrollElement) return

		event.preventDefault()

		scrollElement.scrollLeft += event.deltaY
	}

	onMount(async () => {
		if (!rootRef) return

		const SimpleBar = (await import('simplebar')).default

		setSimpleBar(new SimpleBar(rootRef, {}))

		scrollElement = simpleBar()?.getScrollElement()
		scrollElement?.addEventListener('scroll', checkOverflow)
		window.addEventListener('resize', checkOverflow)

		if (_props.shouldScrollHorizontally) {
			scrollElement?.addEventListener('wheel', scrollHorizontally)
		}

		checkOverflow()
	})

	onCleanup(() => {
		simpleBar()?.unMount()

		window.removeEventListener('resize', checkOverflow)
	})

	// Use expected SimpleBar markup

	return (
		<div
			ref={rootRef}
			class={`${css.root} ${_props.class ?? ''}`}
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
