import { Show, createSignal, createEffect } from 'solid-js'
import type { ParentComponent } from 'solid-js'
import { Portal } from 'solid-js/web'
import { usePortal } from '@/components/ProviderPortal'
import * as css from './Modal.css'

import ProviderFocusTrap from '@/components/ProviderFocusTrap'

const Modal: ParentComponent<{
	isShown: boolean
	onShow: () => void
	onHide: () => void
}> = (props) => {
	const [portal] = usePortal()

	const [isShown, setIsShown] = createSignal(props.isShown)

	createEffect(() => {
		setIsShown(props.isShown)
	})

	createEffect(() => {
		if (isShown()) {
			return props?.onShow()
		}
		props?.onHide()
	})

	return (
		<Portal mount={portal().get('modal')}>
			<Show when={isShown()}>
				<ProviderFocusTrap when={isShown()}>
					<div class={css.header}>Modal</div>
					{props.children}
				</ProviderFocusTrap>
			</Show>
		</Portal>
	)
}

export default Modal
