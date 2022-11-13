import type { Component } from 'solid-js'
import * as css from './TheMenu.css'
import { useIcons } from '@/components/ProviderIcons'
import { useTheme } from '@/components/ProviderTheme'

import Button from '@/components/Button'
import Text from '@/components/Text'

const TheMenu: Component<{ class?: string }> = (props) => {
	const [Icon] = useIcons()
	const [_, setColour] = useTheme()

	function setRandomColour() {
		setColour(`#${Math.floor(Math.random() * 16777215).toString(16)}`)
	}

	return (
		<div class={`${css.root} ${props.class ?? ''}`}>
			<Button class={css.button}>
				<Text
					class={css.buttonText}
					variant="bodyXs"
				>
					Preferences
				</Text>
			</Button>
			<Button class={css.button}>
				<Text
					class={css.buttonText}
					variant="bodyXs"
				>
					About
				</Text>
			</Button>
			<Button class={css.button}>
				<Icon
					class={css.icon}
					name="i18n"
				/>
			</Button>
			<Button
				class={css.button}
				onClick={setRandomColour}
			>
				<Icon
					class={css.icon}
					name="palette"
				/>
			</Button>
		</div>
	)
}

export default TheMenu
