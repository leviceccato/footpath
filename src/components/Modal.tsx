import type { ParentComponent } from 'solid-js'
import { Portal } from 'solid-js/web'
import { usePortal } from '@/components/ProviderPortal'

const Modal: ParentComponent = (props) => {
	const [portal] = usePortal()

	return <Portal mount={portal.get('modal')}>{props.children}</Portal>
}

export default Modal
