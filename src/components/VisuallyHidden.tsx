import { Dynamic } from 'solid-js/web'
import type { ParentComponent } from 'solid-js'
import { setDefaultProps } from '@/scripts/solid-helpers'
import * as css from './VisuallyHidden.css'

const VisuallyHidden: ParentComponent<{
	tag?: string
	isFocusable?: boolean
}> = (props) => {
	setDefaultProps(props, { tag: 'span' })

	return (
		<Dynamic
			component={props.tag}
			classList={{ [css.root]: true, [css.focusable]: props.isFocusable }}
		>
			{props.children}
		</Dynamic>
	)
}

export default VisuallyHidden
