import { IconButton } from '@/components/IconButton'
import { FocusTrap } from '@/providers/FocusTrap'
import { useI18n } from '@/providers/I18n'
import { usePortal } from '@/providers/Portal'
import { Text } from '@/components/Text'
import { type ParentComponent, Show, type Signal, createEffect } from 'solid-js'
import { Portal } from 'solid-js/web'
import * as css from './Modal.css'

export type ModalProps = {
	isShown: Signal<boolean>
	onShow?: () => void
	onHide?: () => void
}

export const Modal: ParentComponent<ModalProps> = (props) => {
	const [isShown, setIsShown] = props.isShown

	const { mounts } = usePortal()
	const [t] = useI18n()

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
				<FocusTrap when={isShown()}>
					{([_, unreachableFocusableProps]) => (
						<div
							onClick={handleRootClick}
							class={css.root}
						>
							<div
								ref={containerRef}
								class={css.container}
							>
								<div
									{...unreachableFocusableProps}
									class={`${css.header} ${unreachableFocusableProps.class}`}
								>
									<Text variant="bodyS">Modal</Text>
									<IconButton
										onClick={() => setIsShown(false)}
										name="close"
										tooltip={t().close}
									/>
								</div>
								<div class={css.main}>{props.children}</div>
							</div>
						</div>
					)}
				</FocusTrap>
			</Portal>
		</Show>
	)
}
