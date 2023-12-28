import { Button } from '@/components/Button'
import { ColourPicker } from '@/components/ColourPicker'
import { ModalAbout } from '@/routes/ModalAbout'
import { Popover } from '@/components/Popover'
import { useI18n } from '@/providers/I18n'
import { useIcons } from '@/providers/Icons'
import { useTheme } from '@/providers/Theme'
import { Text } from '@/components/Text'
import { colourDark, colourLight } from '@/data/colours'
import { createRandomColour } from '@/utils/misc'
import { type ClassProps, defaultProps } from '@/utils/misc'
import { parseToHsl } from 'polished'
import { type HslColor, type HslaColor } from 'polished/lib/types/color'
import { type Component, Index, createSignal, createUniqueId } from 'solid-js'
import * as css from './Menu.css'

type ThemeOption = 'light' | 'dark' | 'system' | 'custom'

export const Menu: Component<ClassProps> = (rawProps) => {
	const props = defaultProps(rawProps, { class: '' })

	const popoverGroupId = createUniqueId()

	const [Icon] = useIcons()
	const [t, language] = useI18n()
	const [theme] = useTheme()
	const [_, setPreviousColour] = createSignal(theme().colour())
	const [isAboutModalShown, setIsAboutModalShown] = createSignal(false)

	const selectedThemeOption = (): ThemeOption => {
		if (theme().useSystem().value) {
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

	function getRandomColour(): HslColor | HslaColor {
		const colour = parseToHsl(createRandomColour())

		const isDefaultColour = colour === colourDark || colour === colourLight
		const isOutsideColourRange = colour.lightness * (colour.saturation + 1) > 1

		if (isDefaultColour || isOutsideColourRange) {
			return getRandomColour()
		}
		return colour
	}

	function setRandomColour() {
		setColour(getRandomColour())
	}

	function setColour(colour: HslColor | HslaColor) {
		setPreviousColour(theme().colour())
		theme().setColour(colour)
	}

	return (
		<div class={`${css.root} ${props.class}`}>
			<Button class={css.buttonVariant.default}>
				<Text
					class={css.buttonText}
					variant="bodyXs"
				>
					{t().preferences}
				</Text>
			</Button>
			<Button
				onClick={[setIsAboutModalShown, true]}
				class={css.buttonVariant.default}
			>
				<Text
					class={css.buttonText}
					variant="bodyXs"
				>
					{t().about}
				</Text>
			</Button>
			<ModalAbout
				modal={{ isShown: [isAboutModalShown, setIsAboutModalShown] }}
			/>
			<Popover
				class={css.buttonVariant.default}
				isShownClass={css.buttonVariant.dropdownOpen}
				when="click"
				groupId={popoverGroupId}
				hasArrow={true}
				options={{
					placement: 'bottom-end',
					modifiers: [{ name: 'offset', options: { offset: [0, 13] } }],
				}}
				reference={() => (
					<Icon
						class={css.icon}
						name="i18n"
					/>
				)}
			>
				<div class={css.dropdown}>
					<div class={css.dropdownButtonContainer}>
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
										{item()[1].untranslated}{' '}
										{item()[1].untranslated === item()[1]._
											? ''
											: `/ ${item()[1]._}`}
									</Text>
								</Button>
							)}
						</Index>
					</div>
				</div>
			</Popover>
			<Popover
				class={css.buttonVariant.default}
				isShownClass={css.buttonVariant.dropdownOpen}
				when="click"
				groupId={popoverGroupId}
				hasArrow={true}
				options={{
					placement: 'bottom-end',
					modifiers: [{ name: 'offset', options: { offset: [0, 13] } }],
				}}
				reference={() => (
					<Icon
						class={css.icon}
						name="palette"
					/>
				)}
			>
				<div class={css.dropdown}>
					<div class={css.dropdownButtonContainer}>
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
							onClick={[theme().setUseSystem, { value: true }]}
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
							onClick={setRandomColour}
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
					<div class={css.colourPickerContainer}>
						<ColourPicker
							class={css.colourPicker}
							spectrumSize={148}
						/>
					</div>
				</div>
			</Popover>
		</div>
	)
}
