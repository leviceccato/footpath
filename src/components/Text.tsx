import { Dynamic } from 'solid-js/web'
import { mergeProps } from 'solid-js'
import type { ParentComponent } from 'solid-js'
import * as css from './Text.css'
import type { ClassProps } from '@/utils/misc'

const Text: ParentComponent<
	ClassProps & {
		tag?: string
		variant: keyof typeof css.variant
	}
> = (props) => {
	const _props = mergeProps({ tag: 'span' }, props)

	return (
		<Dynamic
			class={`${css.root} ${css.variant[_props.variant]} ${_props.class ?? ''}`}
			component={_props.tag}
		>
			{_props.children}
		</Dynamic>
	)
}

export default Text
