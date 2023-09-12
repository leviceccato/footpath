import {
	createSignal,
	Show,
	mergeProps,
	type ParentComponent,
	type JSX,
	type Signal,
} from 'solid-js'
import { type ClassProps } from '@/utils/misc'
import { Dynamic } from 'solid-js/web'
import * as css from './FieldText.css'

type FieldTextProps = ClassProps & {
	value: Signal<string>
	label?: JSX.Element
	placeholder?: string
	isDisabled?: boolean
	rows?: number
	isResizable?: boolean
}

const FieldText: ParentComponent<FieldTextProps> = (props) => {
	const _props = mergeProps({ rows: 1 }, props)
	const [value, setValue] = _props.value

	const [_, setIsFocused] = createSignal(false)

	const tag = () => {
		if (_props.isResizable || _props.rows > 1) {
			return 'textarea'
		}
		return 'input'
	}

	const handleInput: JSX.EventHandler<
		HTMLInputElement | HTMLTextAreaElement,
		InputEvent
	> = (event) => {
		setValue(event.currentTarget.value)
	}

	return (
		<label class={`${css.root} ${props.class ?? ''}`}>
			<Show when={props.label}>
				<div>{props.label}</div>
			</Show>
			<Dynamic
				class={css.input}
				component={tag()}
				value={value()}
				oninput={handleInput}
				placeholder={_props.placeholder}
				disabled={_props.isDisabled}
				onfocus={[setIsFocused, true]}
				onblur={[setIsFocused, false]}
			/>
		</label>
	)
}

export default FieldText
