import type { Component } from 'solid-js'
import * as css from './TheMenu.css'

import Button from '@/components/Button'

const TheMenu: Component<{ class?: string }> = (props) => {
	return (
		<div class={`${css.root} ${props.class ?? ''}`}>
			<Button>Preferences</Button>
		</div>
	)
}

export default TheMenu
