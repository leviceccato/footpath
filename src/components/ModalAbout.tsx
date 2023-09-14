import { type Component } from 'solid-js'
import * as css from './ModalAbout.css'
import { Modal, type ModalProps } from '@/components/Modal'

export const ModalAbout: Component<{
	modal: ModalProps
}> = (props) => {
	return (
		<Modal {...props.modal}>
			<div class={css.root}></div>
		</Modal>
	)
}
