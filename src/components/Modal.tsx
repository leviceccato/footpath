import { Show, createSignal, createEffect } from 'solid-js'
import type { ParentComponent } from 'solid-js'
import { Portal } from 'solid-js/web'
import { usePortal } from '@/components/ProviderPortal'
import * as css from './Modal.css'

import ProviderFocusTrap from '@/components/ProviderFocusTrap'

export type ModalProps = {
	isShown: boolean
	onShow?: () => void
	onHide?: () => void
}

const Modal: ParentComponent<ModalProps> = (props) => {
	const [mounts] = usePortal()

	const [isShown, setIsShown] = createSignal(props.isShown)

	const modal = () => mounts().get('modal')

	createEffect(() => {
		setIsShown(props.isShown)
	})

	createEffect(() => {
		if (isShown()) {
			return props.onShow?.()
		}
		props.onHide?.()
	})

	return (
		<Show when={isShown() && modal()}>
			<Portal mount={modal()}>
				<ProviderFocusTrap when={isShown()}>
					<div class={css.header}>Modal</div>
					{props.children}
				</ProviderFocusTrap>
			</Portal>
		</Show>
	)
}

export default Modal
