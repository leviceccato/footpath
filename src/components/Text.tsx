import { type ClassProps, defaultProps } from '@/utils/solid'
import type { ParentComponent } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import * as css from './Text.css'

export const Text: ParentComponent<
	ClassProps & {
		tag?: string
		variant: keyof typeof css.variant
	}
> = (rawProps) => {
	const props = defaultProps(rawProps, { tag: 'span', class: '' })

	return (
		<Dynamic
			class={`${css.root} ${css.variant[props.variant]} ${props.class}`}
			component={props.tag}
		>
			{props.children}
		</Dynamic>
	)
}
