import { createSignal, Show, mergeProps } from 'solid-js'
import type { ParentComponent, JSX, Signal } from 'solid-js'
import type { ClassProps } from '@/utils/misc'
import { Dynamic } from 'solid-js/web'

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

	const [isFocused, setIsFocused] = createSignal(false)

	const tag = () => {
		if (_props.isResizable || _props.rows > 1) {
			return 'textarea'
		}
		return 'input'
	}

	return (
		<label class={props.class ?? ''}>
			<Show when={props.label}>
				<div>{props.label}</div>
			</Show>
			<Dynamic
				component={tag()}
				placeholder={_props.placeholder}
				disabled={_props.isDisabled}
				onfocus={[setIsFocused, true]}
				onblur={[setIsFocused, false]}
			/>
		</label>
	)
}

export default FieldText
