import { createSignal } from 'solid-js'
import type { Component } from 'solid-js'
import * as css from './TheMenu.css'
import { useIcons } from '@/components/ProviderIcons'
import { useTheme } from '@/components/ProviderTheme'

import Button from '@/components/Button'
import Text from '@/components/Text'
import Popover from '@/components/Popover'

const TheMenu: Component<{ class?: string }> = (props) => {
	const [Icon] = useIcons()
	const [_, setColour] = useTheme()
	const [activeMenuDropdown, setActiveMenuDropdown] = createSignal<
		string | null
	>(null)

	function setRandomColour() {
		setColour(`#${Math.floor(Math.random() * 16777215).toString(16)}`)
	}

	return (
		<div class={`${css.root} ${props.class ?? ''}`}>
			<div class={css.buttonWrapper}>
				<Button class={css.button}>
					<Text
						class={css.buttonText}
						variant="bodyXs"
					>
						Preferences
					</Text>
				</Button>
			</div>
			<div class={css.buttonWrapper}>
				<Button class={css.button}>
					<Text
						class={css.buttonText}
						variant="bodyXs"
					>
						About
					</Text>
				</Button>
			</div>
			<Popover
				class={css.buttonWrapper}
				when="click"
				options={{
					placement: 'bottom-end',
					modifiers: [{ name: 'offset', options: { offset: [0, 9] } }],
				}}
				reference={(state) => (
					<Button
						class={
							css.buttonVariant[state.isShown() ? 'dropdownOpen' : 'default']
						}
					>
						<Icon
							class={css.icon}
							name={state.isHovered() ? 'logoLacy' : 'i18n'}
						/>
					</Button>
				)}
			>
				<div class={css.dropdown}>
					<Button text="English" />
					<Button text="Español / Spanish" />
				</div>
			</Popover>
			<Popover
				class={css.buttonWrapper}
				when="click"
				options={{
					placement: 'bottom-end',
					modifiers: [{ name: 'offset', options: { offset: [0, 9] } }],
				}}
				reference={
					<Button class={css.button}>
						<Icon
							class={css.icon}
							name="palette"
						/>
					</Button>
				}
			>
				<div class={css.dropdown}>
					<Text variant="bodyXs">Hello</Text>
				</div>
			</Popover>
		</div>
	)
}

export default TheMenu
