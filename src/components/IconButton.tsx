import type { Component } from 'solid-js'
import { Show } from 'solid-js'
import { useIcons } from '@/components/ProviderIcons'
import type { IconName } from '@/components/ProviderIcons'

import Button from '@/components/Button'
import Popover from '@/components/Popover'
import Text from '@/components/Text'
import VisuallyHidden from '@/components/VisuallyHidden'

const IconButton: Component<{
	class?: string
	name: IconName
	tooltip: string
}> = (props) => {
	const [Icon] = useIcons()

	return (
		<Popover
			class={props.class}
			when="hover"
			options={{
				placement: 'bottom-end',
				modifiers: [{ name: 'offset', options: { offset: [0, 9] } }],
			}}
			reference={({ isShown }) => (
				<Button class={props.class}>
					<Show when={!isShown()}>
						<VisuallyHidden>{props.tooltip}</VisuallyHidden>
					</Show>
					<Icon name={props.name} />
				</Button>
			)}
		>
			<Text variant="bodyXs">{props.tooltip}</Text>
		</Popover>
	)
}

export default IconButton
