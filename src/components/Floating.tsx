import { FocusTrap } from '@/providers/FocusTrap'
import { usePortal } from '@/providers/Portal'
import { defaultProps } from '@/utils/solid'
import { type ReferenceElement, computePosition } from '@floating-ui/dom'
import {
	type ParentComponent,
	Show,
	type Signal,
	createSignal,
	createUniqueId,
} from 'solid-js'
import { Portal } from 'solid-js/web'
import * as css from './Floating.css'

type State = {
	a: number
}

export const Floating: ParentComponent<{
	reference: ReferenceElement
	state: Signal<State>
	/* Override default mount location in case it needs to be
	positioned on another layer */
	mount?: string
	showArrow?: boolean
	tooltipClass?: string
}> = (rawProps) => {
	const props = defaultProps(rawProps, {
		mount: 'modal',
		showArrow: false,
		tooltipClass: '',
	})

	const { mounts } = usePortal()
	const id = createUniqueId()

	let arrowRef: HTMLDivElement | undefined
	let contentRef: HTMLDivElement | undefined

	const mount = () => mounts().get(props.mount)
	const isShown = () => true
	const contentVariant = () => (isShown() ? 'shown' : 'hidden')

	return (
		<Show when={mount()}>
			<Portal mount={mount()}>
				<div
					class={`${css.contentVariants[contentVariant()]} ${
						props.tooltipClass
					}`}
					ref={contentRef}
					id={id}
					role="tooltip"
				>
					<Show when={props.showArrow}>
						<div ref={arrowRef} class={css.arrow}>
							<div class={css.arrowInner} />
						</div>
					</Show>
					<Show when={isShown()}>
						<FocusTrap when={isShown()}>{() => props.children}</FocusTrap>
					</Show>
				</div>
			</Portal>
		</Show>
	)
}
