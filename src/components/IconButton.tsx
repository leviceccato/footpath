import type { Component } from 'solid-js'
import { useIcons } from '@/components/ProviderIcons'
import type { IconName } from '@/components/ProviderIcons'

import Button from '@/components/Button'

const IconButton: Component<{ class?: string; name: IconName }> = (props) => {
	const [Icon] = useIcons()

	return (
		<Button class={props.class}>
			<Icon name={props.name} />
		</Button>
	)
}

export default IconButton
