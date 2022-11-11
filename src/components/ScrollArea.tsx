import 'simplebar/dist/simplebar.css'

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

	function checkOverflow({ target }: Event) {
		if (!target || !(target instanceof HTMLElement)) {
			return
		}

		setScrollTop(target.scrollTop)
		setScrollLeft(target.scrollLeft)

		// Set overflow booleans for each side based on minimum distance values

		setIsOverflowingTop(target.scrollTop > _props.minDistanceForOverflowY)
		setIsOverflowingBottom(
			target.scrollHeight - target.scrollTop - target.clientHeight >
				_props.minDistanceForOverflowY,
		)
		setIsOverflowingLeft(target.scrollLeft > _props.minDistanceForOverflowX)
		setIsOverflowingRight(
			target.scrollWidth - target.scrollLeft - target.clientWidth >
				_props.minDistanceForOverflowX,
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
			class={css.root}
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
			<div class={css.overlay}>
				<div
					classList={{
						[css.overflowShadow]: true,
						[css.overflowShadowVariant.top]: isOverflowingTop(),
					}}
				/>
				<div
					classList={{
						[css.overflowShadow]: true,
						[css.overflowShadowVariant.bottom]: isOverflowingBottom(),
					}}
				/>
				<div
					classList={{
						[css.overflowShadow]: true,
						[css.overflowShadowVariant.left]: isOverflowingLeft(),
					}}
				/>
				<div
					classList={{
						[css.overflowShadow]: true,
						[css.overflowShadowVariant.right]: isOverflowingRight(),
					}}
				/>
			</div>
		</div>
	)
}

export default ScrollArea
