import type { Component } from 'solid-js'
import * as css from './TheMenu.css'
import { useIcons } from '@/components/ProviderIcons'

import Button from '@/components/Button'

const TheMenu: Component<{ class?: string }> = (props) => {
	const [Icon] = useIcons()

	return (
		<div class={`${css.root} ${props.class ?? ''}`}>
			<Button text={'Preferences'} />
			<Button text={'About'} />
			<Button>
				<Icon
					class={css.i18nIcon}
					name="i18n"
				/>
			</Button>
		</div>
	)
}

export default TheMenu
