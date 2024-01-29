import { FocusTrap } from '@/providers/FocusTrap'
import { usePortal } from '@/providers/Portal'
import { defaultProps } from '@/utils/solid'
import { computePosition } from '@floating-ui/dom'
import {
	type ParentComponent,
	Show,
	type Signal,
	createSignal,
	createUniqueId,
} from 'solid-js'
import { Portal } from 'solid-js/web'

type State = {
	a: number
}

export const Floating: ParentComponent<{
	reference: HTMLButtonElement
	state: Signal<State>
	mount?: string
	showArrow?: boolean
}> = (rawProps) => {
	const props = defaultProps(rawProps, {
		mount: 'modal',
		showArrow: false,
	})

	const { mounts } = usePortal()
	const id = createUniqueId()

	const [contentRef, setContentRef] = createSignal<HTMLDivElement>()

	const mount = () => mounts().get(props.mount)

	return (
		<Show when={mount()}>
			<Portal mount={mount()}>
				<div ref={setContentRef} id={id} role="tooltip">
					{/* <Show when={props.hasArrow}>
						<div ref={arrowRef} class={css.arrow}>
							<div class={css.arrowInner} />
						</div>
					</Show>
					<Show when={isShown()}>
						<FocusTrap when={isShown()}>{() => props.children}</FocusTrap>
					</Show> */}
				</div>
			</Portal>
		</Show>
	)
}
