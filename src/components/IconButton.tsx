import type { ParentComponent } from 'solid-js'

import Button from '@/components/Button'

const IconButton: ParentComponent = (props) => {
	return <Button>{props.children}</Button>
}

export default IconButton
