import type { ParentComponent } from 'solid-js'
import * as css from './Button.css'
import { useI18n } from '@/components/I18n'

const Button: ParentComponent = (props) => {
	const [t, language] = useI18n()

	function toggleLanguage() {
		if (language.get() === '_default') {
			return language.set('test')
		}
		language.set('_default')
	}

	return (
		<button
			class={css.root}
			onClick={toggleLanguage}
		>
			{t().hello}
			{props.children}
		</button>
	)
}

export default Button
