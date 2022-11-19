import { createSignal, createUniqueId, Index } from 'solid-js'
import type { Component } from 'solid-js'
import * as css from './TheMenu.css'
import { colourDark, colourLight } from '@/data/colours'
import { useIcons } from '@/components/ProviderIcons'
import { useTheme } from '@/components/ProviderTheme'
import { useI18n } from '@/components/ProviderI18n'

import Button from '@/components/Button'
import Text from '@/components/Text'
import Popover from '@/components/Popover'

type ThemeOption = 'light' | 'dark' | 'system' | 'custom'

const TheMenu: Component<{ class?: string }> = (props) => {
	const popoverGroupId = createUniqueId()

	const [Icon] = useIcons()
	const [t, language] = useI18n()
	const [theme] = useTheme()
	const [previousColour, setPreviousColour] = createSignal(theme().colour())

	const selectedThemeOption = (): ThemeOption => {
		if (theme().shouldUseSystem()) {
			return 'system'
		}
		if (theme().colour() === colourDark) {
			return 'dark'
		}
		if (theme().colour() === colourLight) {
			return 'light'
		}
		return 'custom'
	}

	function setRandomColour() {
		theme().setColour(`#${Math.floor(Math.random() * 16777215).toString(16)}`)
	}

	function setColour(colour: string) {
		setPreviousColour(theme().colour())
		theme().setColour(colour)
		theme().setShouldUseSystem(false)
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
					<Button
						onClick={[setColour, colourLight]}
						class={css.dropdownButton}
					>
						<Icon
							class={
								css.dropdownButtonIconVariant[
									selectedThemeOption() === 'light' ? 'shown' : 'hidden'
								]
							}
							name="check"
						/>
						<Text
							class={css.dropdownButtonText}
							variant="bodyXs"
						>
							{t().light}
						</Text>
					</Button>
					<Button
						onClick={[setColour, colourDark]}
						class={css.dropdownButton}
					>
						<Icon
							class={
								css.dropdownButtonIconVariant[
									selectedThemeOption() === 'dark' ? 'shown' : 'hidden'
								]
							}
							name="check"
						/>
						<Text
							class={css.dropdownButtonText}
							variant="bodyXs"
						>
							{t().dark}
						</Text>
					</Button>
					<Button
						onClick={[theme().setShouldUseSystem, true]}
						class={css.dropdownButton}
					>
						<Icon
							class={
								css.dropdownButtonIconVariant[
									selectedThemeOption() === 'system' ? 'shown' : 'hidden'
								]
							}
							name="check"
						/>
						<Text
							class={css.dropdownButtonText}
							variant="bodyXs"
						>
							{t().system}
						</Text>
					</Button>
					<Button
						onClick={[theme().setShouldUseSystem, true]}
						class={css.dropdownButton}
					>
						<Icon
							class={
								css.dropdownButtonIconVariant[
									selectedThemeOption() === 'custom' ? 'shown' : 'hidden'
								]
							}
							name="check"
						/>
						<Text
							class={css.dropdownButtonText}
							variant="bodyXs"
						>
							{t().custom}
						</Text>
					</Button>
				</div>
			</Popover>
		</div>
	)
}

export default TheMenu
