import type { ParentComponent } from 'solid-js'
import * as css from './Button.css'
import { useI18n } from '@/components/I18n'

const Button: ParentComponent = (props) => {
	const [t] = useI18n()

	return (
		<button class={css.root}>
			{t().hello}
			{props.children}
		</button>
	)
}

export default Button
