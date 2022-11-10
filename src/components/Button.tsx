import { setDefaultProps } from '@/scripts/solid-helpers'
import type { ParentComponent } from 'solid-js'
import * as css from './Button.css'
import { useI18n } from '@/components/I18n'

const Button: ParentComponent<{ test?: string }> = (props) => {
	setDefaultProps(props, { test: 'asd' })

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
			Hello from {t().language} {props.test}
		</button>
	)
}

export default Button
