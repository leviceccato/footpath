import { type ParentComponent } from 'solid-js'
import * as css from './HeightExpander.css'
import { type ClassProps, defaults } from '@/utils/misc'

const HeightExpander: ParentComponent<ClassProps & { when: boolean }> = (
	rawProps,
) => {
	const props = defaults(rawProps, { class: '' })

	const variant = (): keyof typeof css.variant =>
		props.when ? 'expanded' : 'unexpanded'

	return (
		<span class={`${css.root} ${variant()} ${props.class}`}>
			<span class={css.inner}>{props.children}</span>
		</span>
	)
}

export default HeightExpander
