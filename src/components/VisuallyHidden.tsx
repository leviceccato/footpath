import { Dynamic } from 'solid-js/web'
import { type ParentComponent } from 'solid-js'
import { defaults } from '@/utils/misc'
import * as css from './VisuallyHidden.css'

const VisuallyHidden: ParentComponent<{
	tag?: string
	isFocusable?: boolean
}> = (rawProps) => {
	const props = defaults(rawProps, { tag: 'span' })

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
