import { type ClassProps, defaultProps } from '@/utils/solid'
import type { ParentComponent } from 'solid-js'
import * as css from './HeightExpander.css'

export const HeightExpander: ParentComponent<ClassProps & { when: boolean }> = (
	rawProps,
) => {
	const props = defaultProps(rawProps, { class: '' })

	const variant = (): keyof typeof css.variant =>
		props.when ? 'expanded' : 'unexpanded'

	return (
		<span class={`${css.root} ${variant()} ${props.class}`}>
			<span class={css.inner}>{props.children}</span>
		</span>
	)
}
