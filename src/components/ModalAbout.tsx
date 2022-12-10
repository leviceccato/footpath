import type { Component } from 'solid-js'
import * as css from './ModalAbout.css'

import Modal from '@/components/Modal'
import type { ModalProps } from '@/components/Modal'

const ModalAbout: Component<{
	modal: ModalProps
}> = (props) => {
	return (
		<Modal {...props.modal}>
			<div class={css.root}></div>
		</Modal>
	)
}

export default ModalAbout
