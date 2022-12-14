import { Show, createEffect } from 'solid-js'
import type { ParentComponent, Signal } from 'solid-js'
import { Portal } from 'solid-js/web'
import { usePortal } from '@/components/ProviderPortal'
import * as css from './Modal.css'

import ProviderFocusTrap from '@/components/ProviderFocusTrap'

export type ModalProps = {
	isShown: Signal<boolean>
	onShow?: () => void
	onHide?: () => void
}

const Modal: ParentComponent<ModalProps> = (props) => {
	const [isShown, setIsShown] = props.isShown

	const [mounts] = usePortal()

	const modal = () => mounts().get('modal')

	createEffect(() => {
		if (isShown()) {
			window.addEventListener('keydown', handleEscapeToClose)
			return props.onShow?.()
		}
		window.removeEventListener('keydown', handleEscapeToClose)
		props.onHide?.()
	})

	function handleEscapeToClose({ key }: KeyboardEvent) {
		if (key === 'Escape') {
			setIsShown(false)
		}
	}

	return (
		<Show when={isShown() && modal()}>
			<Portal mount={modal()}>
				<ProviderFocusTrap when={isShown()}>
					<div
						onClick={[setIsShown, false]}
						class={css.root}
					>
						<div class={css.main}>
							<div class={css.header}>Modal</div>
							{props.children}
						</div>
					</div>
				</ProviderFocusTrap>
			</Portal>
		</Show>
	)
}

export default Modal
