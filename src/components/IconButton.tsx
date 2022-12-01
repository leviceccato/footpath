import type { Component } from 'solid-js'
import { Show, splitProps } from 'solid-js'
import { useIcons } from '@/components/ProviderIcons'
import type { IconName } from '@/components/ProviderIcons'
import * as css from './IconButton.css'

import Button from '@/components/Button'
import type { ButtonProps } from '@/components/Button'
import Popover from '@/components/Popover'
import Text from '@/components/Text'
import VisuallyHidden from '@/components/VisuallyHidden'

const IconButton: Component<
	ButtonProps & {
		class?: string
		name: IconName
		tooltip: string
		iconClass?: string
	}
> = (props) => {
	const [Icon] = useIcons()

	const [_props, buttonProps] = splitProps(props, [
		'class',
		'name',
		'tooltip',
		'iconClass',
	])

	return (
		<Popover
			class={_props.class}
			when="hover"
			options={{
				placement: 'bottom-end',
				modifiers: [{ name: 'offset', options: { offset: [0, 9] } }],
			}}
			reference={({ isShown }) => (
				<Button {...buttonProps}>
					<Show when={!isShown()}>
						<VisuallyHidden>{_props.tooltip}</VisuallyHidden>
					</Show>
					<Icon
						class={`${css.icon} ${_props.iconClass ?? ''}`}
						name={_props.name}
					/>
				</Button>
			)}
		>
			<Text variant="bodyXs">{_props.tooltip}</Text>
		</Popover>
	)
}

export default IconButton
