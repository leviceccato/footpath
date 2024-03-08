import { defaultProps } from '@/utils/solid'
import type { ParentComponent } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import * as css from './VisuallyHidden.css'

export const VisuallyHidden: ParentComponent<{
	tag?: string
	isFocusable?: boolean
}> = (rawProps) => {
	const props = defaultProps(rawProps, { tag: 'span' })

	return (
		<Dynamic
			component={props.tag}
			classList={{ [css.root]: true, [css.focusable]: props.isFocusable }}
		>
			{props.children}
		</Dynamic>
	)
}
