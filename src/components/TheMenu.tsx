import { createSignal, createUniqueId, For } from 'solid-js'
import type { Component } from 'solid-js'
import * as css from './TheMenu.css'
import { useIcons } from '@/components/ProviderIcons'
import { useTheme } from '@/components/ProviderTheme'
import { useI18n } from '@/components/ProviderI18n'

import Button from '@/components/Button'
import Text from '@/components/Text'
import Popover from '@/components/Popover'

const TheMenu: Component<{ class?: string }> = (props) => {
	const popoverGroupId = createUniqueId()

	const [Icon] = useIcons()
	const [t, language] = useI18n()
	const [_, setColour] = useTheme()

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
						{t().preferences}
					</Text>
				</Button>
			</div>
			<div class={css.buttonWrapper}>
				<Button class={css.button}>
					<Text
						class={css.buttonText}
						variant="bodyXs"
					>
						{t().about}
					</Text>
				</Button>
			</div>
			<Popover
				class={css.buttonWrapper}
				when="click"
				groupId={popoverGroupId}
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
							name="i18n"
						/>
					</Button>
				)}
			>
				<div class={css.dropdown}>
					<For each={Object.entries(t().language.all)}>
						{([key, { _: name, untranslated }]) => (
							<Button
								onClick={[language.set, key]}
								class={css.dropdownButton}
							>
								<Icon name="check" />
								<Text
									class={css.dropdownButtonText}
									variant="bodyXs"
								>
									{name} {name === untranslated ? '' : `/ ${untranslated}`}
								</Text>
							</Button>
						)}
					</For>
				</div>
			</Popover>
			<Popover
				class={css.buttonWrapper}
				when="click"
				groupId={popoverGroupId}
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
							name="palette"
						/>
					</Button>
				)}
			>
				<div class={css.dropdown}>
					<Button
						class={css.dropdownButton}
						text="Hello"
					/>
				</div>
			</Popover>
		</div>
	)
}

export default TheMenu
