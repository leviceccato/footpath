import { FocusTrap } from '@/providers/FocusTrap'
import { usePortal } from '@/providers/Portal'
import { defaultProps } from '@/utils/solid'
import { type ReferenceElement } from '@floating-ui/dom'
import {
	type ParentComponent,
	Show,
	type Signal,
	createEffect,
	createSignal,
	createUniqueId,
	onMount,
} from 'solid-js'
import { Portal } from 'solid-js/web'
import * as css from './Floating.css'
const importFloatingUi = () => import('@floating-ui/dom')

type State = {
	a: number
}

export const Floating: ParentComponent<{
	/* The reference element and state must be supplied externally, this is
	so we can support multiple floating elements using the same reference and 
	so the state can be two-way bound */
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

	let hasInitialised = false
	let arrowRef: HTMLDivElement | undefined
	let contentRef: HTMLDivElement | undefined

	const mount = () => mounts().get(props.mount)
	const isShown = () => true
	const contentVariant = () => (isShown() ? 'shown' : 'hidden')

	createEffect(async function initialise(): Promise<void> {
		if (hasInitialised || !mount() || !contentRef) {
			return
		}

		const floatingUi = await importFloatingUi()

		hasInitialised = true
	})

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
