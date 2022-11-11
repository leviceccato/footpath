import { Dynamic } from 'solid-js/web'
import { mergeProps } from 'solid-js'
import type { ParentComponent } from 'solid-js'
import * as css from './VisuallyHidden.css'

const VisuallyHidden: ParentComponent<{
	tag?: string
	isFocusable?: boolean
}> = (props) => {
	const _props = mergeProps({ tag: 'span' }, props)

	return (
		<Dynamic
			component={_props.tag}
			classList={{ [css.root]: true, [css.focusable]: _props.isFocusable }}
		>
			{_props.children}
		</Dynamic>
	)
}

export default VisuallyHidden
