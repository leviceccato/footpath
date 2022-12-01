import type { Component } from 'solid-js'
import { Show, splitProps } from 'solid-js'
import { useIcons } from '@/components/ProviderIcons'
import type { IconName } from '@/components/ProviderIcons'

import Button from '@/components/Button'
import type { ButtonProps } from '@/components/Button'
import Popover from '@/components/Popover'
import Text from '@/components/Text'
import VisuallyHidden from '@/components/VisuallyHidden'

const IconButton: Component<
	ButtonProps & {
		name: IconName
		tooltip: string
	}
> = (props) => {
	const [Icon] = useIcons()

	const [_props, buttonProps] = splitProps(props, ['name', 'tooltip', 'class'])

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
					<Icon name={_props.name} />
				</Button>
			)}
		>
			<Text variant="bodyXs">{_props.tooltip}</Text>
		</Popover>
	)
}

export default IconButton
