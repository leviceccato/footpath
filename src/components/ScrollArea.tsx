import SimpleBar from 'simplebar'
import { onMount, onCleanup, createSignal, mergeProps } from 'solid-js'
import type { ParentComponent } from 'solid-js'
import * as css from './ScrollArea.css'

const ScrollArea: ParentComponent<{
	minDistanceForOverflowX?: number
	minDistanceForOverflowY?: number
}> = (props) => {
	const _props = mergeProps(
		{ minDistanceForOverflowX: 0, minDistanceForOverflowY: 0 },
		props,
	)

	let rootRef: HTMLDivElement | undefined

	const [simpleBar, setSimpleBar] = createSignal<SimpleBar>()

	// Reactive scroll data

	const [scrollTop, setScrollTop] = createSignal(0)
	const [scrollLeft, setScrollLeft] = createSignal(0)
	const [isOverflowingTop, setIsOverflowingTop] = createSignal(false)
	const [isOverflowingBottom, setIsOverflowingBottom] = createSignal(false)
	const [isOverflowingLeft, setIsOverflowingLeft] = createSignal(false)
	const [isOverflowingRight, setIsOverflowingRight] = createSignal(false)

	function checkOverflow(event: Event) {
		const target = event.target
		if (!target || !(target instanceof HTMLElement)) {
			return
		}

		const {
			scrollTop,
			scrollLeft,
			scrollHeight,
			scrollWidth,
			clientHeight,
			clientWidth,
		} = target

		setScrollTop(scrollTop)
		setScrollLeft(scrollLeft)

		// Set overflow booleans for each side based on minimum distance values

		setIsOverflowingTop(scrollTop > _props.minDistanceForOverflowY)
		setIsOverflowingBottom(
			scrollHeight - scrollTop - clientHeight > _props.minDistanceForOverflowY,
		)
		setIsOverflowingLeft(scrollLeft > _props.minDistanceForOverflowX)
		setIsOverflowingRight(
			scrollWidth - scrollLeft - clientWidth > _props.minDistanceForOverflowX,
		)
	}

	onMount(() => {
		if (!rootRef) return

		setSimpleBar(new SimpleBar(rootRef, {}))
		const scrollElement = simpleBar()?.getScrollElement()
		scrollElement?.addEventListener('scroll', checkOverflow)
	})

	onCleanup(() => {
		simpleBar()?.unMount()
	})

	// Use expected SimpleBar markup

	return (
		<div
			ref={rootRef}
			classList={{
				[css.root]: true,
				[css.rootVariant.overflowTop]: isOverflowingTop(),
				[css.rootVariant.overflowBottom]: isOverflowingBottom(),
				[css.rootVariant.overflowLeft]: isOverflowingLeft(),
				[css.rootVariant.overflowRight]: isOverflowingRight(),
			}}
		>
			<div class="simplebar-wrapper">
				<div class="simplebar-height-auto-observer-wrapper">
					<div class="simplebar-height-auto-observer" />
				</div>
				<div class="simplebar-mask">
					<div class="simplebar-offset">
						<div class="simplebar-content-wrapper">
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
		</div>
	)
}

export default ScrollArea
