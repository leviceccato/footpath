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

	let containerRef: HTMLDivElement | undefined

	const modal = () => mounts().get('modal')

	createEffect(() => {
		if (isShown()) {
			window.addEventListener('keydown', handleEscapeToClose)
			return props.onShow?.()
		}
		window.removeEventListener('keydown', handleEscapeToClose)
		props.onHide?.()
	})

	function handleRootClick({ target }: MouseEvent) {
		// Ignore clicks inside main modal content
		if (target instanceof Node && containerRef?.contains(target)) {
			return
		}

		setIsShown(false)
	}

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
						onClick={handleRootClick}
						class={css.root}
					>
						<div
							ref={containerRef}
							class={css.container}
						>
							<div class={css.header}>Modal</div>
							<div class={css.main}>{props.children}</div>
						</div>
					</div>
				</ProviderFocusTrap>
			</Portal>
		</Show>
	)
}

export default Modal
