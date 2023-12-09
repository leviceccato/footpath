import { Modal, type ModalProps } from '@/components/Modal'
import { type Component } from 'solid-js'
import * as css from './ModalAbout.css'

export const ModalLogin: Component<{
	modal: ModalProps
}> = (props) => {
	return (
		<Modal {...props.modal}>
			<div class={css.root} />
		</Modal>
	)
}
