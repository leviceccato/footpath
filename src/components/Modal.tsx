import { IconButton } from '@/components/IconButton'
import { Text } from '@/components/Text'
import { FocusTrap } from '@/providers/FocusTrap'
import { useI18n } from '@/providers/I18n'
import { usePortal } from '@/providers/Portal'
import {
	type ParentComponent,
	Show,
	type Signal,
	createEffect,
	createMemo,
} from 'solid-js'
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

	const modal = createMemo(() => mounts().get('modal'))

	createEffect(() => {
		if (isShown()) {
			window.addEventListener('keydown', handleEscapeToClose)
			return props.onShow?.()
		}
		window.removeEventListener('keydown', handleEscapeToClose)
		props.onHide?.()
	})

	function handleRootClick({ target }: MouseEvent) {
		/* Ignore clicks inside main modal content */
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
					{(focus) => (
						<div onClick={handleRootClick} class={css.root}>
							{t('languageSetTo', 'what')}
							<div ref={containerRef} class={css.container}>
								<div
									{...focus.unreachableFocusableProps}
									class={`${css.header} ${focus.unreachableFocusableProps.class}`}
								>
									<Text variant="bodyS">Modal</Text>
									<IconButton
										name="close"
										tooltip={t('close')}
										onClick={() => setIsShown(false)}
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
