import { createSignal, createUniqueId, Index } from 'solid-js'
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
	const [theme] = useTheme()

	function setRandomColour() {
		theme().setColour(`#${Math.floor(Math.random() * 16777215).toString(16)}`)
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
					<Index each={Object.entries(t().language.all)}>
						{(item) => (
							<Button
								onClick={[language.set, item()[0]]}
								class={css.dropdownButton}
							>
								<Icon
									class={
										css.dropdownButtonIconVariant[
											language.get() === item()[0] ? 'shown' : 'hidden'
										]
									}
									name="check"
								/>
								<Text
									class={css.dropdownButtonText}
									variant="bodyXs"
								>
									{item()[1]._}{' '}
									{item()[1]._ === item()[1].untranslated
										? ''
										: `/ ${item()[1].untranslated}`}
								</Text>
							</Button>
						)}
					</Index>
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
					<Button class={css.dropdownButton}>
						<Icon
							class={
								css.dropdownButtonIconVariant[
									theme().colour() === '#FFFFFF' ? 'shown' : 'hidden'
								]
							}
							name="check"
						/>
						<Text
							class={css.dropdownButtonText}
							variant="bodyXs"
						>
							Light
						</Text>
					</Button>
					<Button class={css.dropdownButton}>
						<Icon
							class={
								css.dropdownButtonIconVariant[
									theme().colour() === '#000000' ? 'shown' : 'hidden'
								]
							}
							name="check"
						/>
						<Text
							class={css.dropdownButtonText}
							variant="bodyXs"
						>
							Dark
						</Text>
					</Button>
					<Button class={css.dropdownButton}>
						<Icon
							class={css.dropdownButtonIcon}
							name="check"
						/>
						<Text
							class={css.dropdownButtonText}
							variant="bodyXs"
						>
							System
						</Text>
					</Button>
					<Button class={css.dropdownButton}>
						<Icon
							class={css.dropdownButtonIcon}
							name="check"
						/>
						<Text
							class={css.dropdownButtonText}
							variant="bodyXs"
						>
							Custom
						</Text>
					</Button>
				</div>
			</Popover>
		</div>
	)
}

export default TheMenu
