import { type ClassProps, defaultProps } from '@/utils/solid'
import { type JSX, type ParentComponent, Show, createSignal } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import * as css from './FieldText.css'

export type FieldTextProps = ClassProps & {
	value: string
	onInput?: JSX.EventHandler<HTMLInputElement | HTMLTextAreaElement, InputEvent>
	label?: JSX.Element
	placeholder?: string
	isDisabled?: boolean
	rows?: number
	isResizable?: boolean
}

export const FieldText: ParentComponent<FieldTextProps> = (rawProps) => {
	const props = defaultProps(rawProps, { rows: 1, class: '' })

	const [_, setIsFocused] = createSignal(false)

	const tag = () => {
		if (props.isResizable || props.rows > 1) {
			return 'textarea'
		}
		return 'input'
	}

	return (
		<label class={`${css.root} ${props.class}`}>
			<Show when={props.label}>
				<div>{props.label}</div>
			</Show>
			<Dynamic
				class={css.input}
				component={tag()}
				value={props.value}
				oninput={props.onInput}
				placeholder={props.placeholder}
				disabled={props.isDisabled}
				onfocus={[setIsFocused, true]}
				onblur={[setIsFocused, false]}
			/>
		</label>
	)
}
