import type { Component } from 'solid-js'
import { useIcons } from '@/components/ProviderIcons'
import type { IconName } from '@/components/ProviderIcons'

import Button from '@/components/Button'
import Popover from '@/components/Popover'
import Text from '@/components/Text'

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
			reference={() => (
				<Button class={props.class}>
					<Icon name={props.name} />
				</Button>
			)}
		>
			<Text variant="bodyXs">{props.tooltip}</Text>
		</Popover>
	)
}

export default IconButton
