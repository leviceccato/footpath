import type { ParentComponent } from 'solid-js'
import * as css from './Button.css'
import { useI18n } from '@/components/I18n'

const Button: ParentComponent = (props) => {
	const [t, setLanguage] = useI18n()

	function setTranslationToTest() {
		setLanguage('test')
	}

	return (
		<button
			class={css.root}
			onClick={setTranslationToTest}
		>
			{t().hello}
			{props.children}
		</button>
	)
}

export default Button
