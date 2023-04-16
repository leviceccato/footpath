import { createSignal, Show } from 'solid-js'
import type { ParentComponent, JSX } from 'solid-js'
import type { ClassedComponent } from '@/utils/misc'
import { Dynamic } from 'solid-js/web'

type FieldTextProps = ClassedComponent & {
	value: string
	label: JSX.Element
	placeholder?: string
	isDisabled?: boolean
	rows?: number
	maxRows?: number
	isResizable?: boolean
}

const FieldText: ParentComponent<FieldTextProps> = (props) => {
	const [isFocused, setIsFocused] = createSignal(false)

	return (
		<label class={props.class ?? ''}>
			<Show when={props.label}>
				<div>{props.label}</div>
			</Show>
			<Dynamic
				component={'input'}
				onfocus={[setIsFocused, true]}
				onblur={[setIsFocused, false]}
			/>
		</label>
	)
}

export default FieldText
