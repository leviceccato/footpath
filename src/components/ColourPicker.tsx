import {
	createSignal,
	createEffect,
	onCleanup,
	type Component,
	type JSX,
} from 'solid-js'
import { assignInlineVars } from '@vanilla-extract/dynamic'
import {
	clamp,
	hslToHsv,
	hsvToHsl,
	defaults,
	type ClassProps,
} from '@/utils/misc'
import { type HslColor, type HslaColor } from 'polished/lib/types/color'
import { useTheme } from '@/components/ProviderTheme'
import * as css from './ColourPicker.css'
import { useFocus } from '@/components/ProviderFocusTrap'
import { hslToColorString } from 'polished'
import FieldText from '@/components/FieldText'

type CanvasPointerEvent = PointerEvent & {
	currentTarget: HTMLCanvasElement
	target: Element
}

const TheColourPicker: Component<ClassProps & { spectrumSize?: number }> = (
	rawProps,
) => {
	const props = defaults(rawProps, { spectrumSize: 180, class: '' })

	let spectrumRef: HTMLCanvasElement | undefined
	let hueRangeRef: HTMLInputElement | undefined

	const [theme] = useTheme()
	const [focusableProps] = useFocus()

	const [hue, setHue] = createSignal(0)
	const [isSpectrumFocused, setIsSpectrumFocused] = createSignal(false)
	const [shouldEcho, setShouldEcho] = createSignal(true)
	const [colourSelectorX, setColourSelectorX] = createSignal(0)
	const [colourSelectorY, setColourSelectorY] = createSignal(0)
	const [spectrumLeft, setSpectrumLeft] = createSignal(0)
	const [spectrumTop, setSpectrumTop] = createSignal(0)
	const [spectrumWidth, setSpectrumWidth] = createSignal(0)
	const [spectrumHeight, setSpectrumHeight] = createSignal(0)
	const hexColour = createSignal(hslToColorString(theme().colour()))

	function _setHue(to: number, shouldUpdate = true) {
		setHue(to)
		drawSpectrum()

		if (shouldUpdate) {
			updateColour()
		} else if (hueRangeRef) {
			hueRangeRef.value = String(to)
		}
	}

	const handleHueRangeInput: JSX.EventHandler<HTMLInputElement, InputEvent> = (
		event,
	) => {
		setShouldEcho(false)
		_setHue(event.currentTarget.valueAsNumber)
		setShouldEcho(true)
	}

	function drawSpectrum() {
		const context = spectrumRef?.getContext('2d')
		if (!context) return

		// Create white to hue gradient (base)

		let gradientWhiteToHue = context.createLinearGradient(
			0,
			0,
			context.canvas.width,
			0,
		)
		gradientWhiteToHue.addColorStop(0, 'hsla(0 0% 100%)')
		gradientWhiteToHue.addColorStop(1, `hsla(${hue()} 100% 50%)`)
		context.fillStyle = gradientWhiteToHue
		context.fillRect(0, 0, context.canvas.width, context.canvas.height)

		// Create transparent to black gradient (overlay)

		let gradientTransparentToBlack = context.createLinearGradient(
			0,
			0,
			0,
			context.canvas.height,
		)
		gradientTransparentToBlack.addColorStop(0, 'hsla(0 0% 0% / 0)')
		gradientTransparentToBlack.addColorStop(1, 'hsla(0 0% 0% / 1)')
		context.fillStyle = gradientTransparentToBlack
		context.fillRect(0, 0, context.canvas.width, context.canvas.height)
	}

	function handleCanvasPointerDown(event: CanvasPointerEvent) {
		event.preventDefault()
		event.stopPropagation()

		registerWindowPointerMoveHandler()

		setSpectrumRect()

		const { clientX, clientY } = event
		setColourSelectorPosition(clientX, clientY)
	}

	function updateColour() {
		const height = spectrumHeight() || 1
		const width = spectrumWidth() || 1

		const saturation = colourSelectorX() / width
		const value = (height - colourSelectorY()) / height

		const colour = hsvToHsl({ hue: hue(), saturation, value })

		theme().setColour(colour)
	}

	function setColourSelectorPosition(x: number, y: number) {
		const _x = clamp(0, x - spectrumLeft(), spectrumWidth())
		const _y = clamp(0, y - spectrumTop(), spectrumHeight())

		setColourSelectorX(_x)
		setColourSelectorY(_y)

		updateColour()
	}

	function setColourSelectorPositionFromColour(colour: HslColor | HslaColor) {
		const { hue, saturation, value } = hslToHsv(colour)

		const width = spectrumWidth() || 1
		const height = spectrumHeight() || 1

		const y = clamp(0, height - value * height, height)
		const x = clamp(0, saturation * width, width)

		setColourSelectorX(x)
		setColourSelectorY(y)

		_setHue(hue, false)
	}

	function registerWindowPointerMoveHandler() {
		window.addEventListener('pointermove', handlePointerMove)
		window.addEventListener('pointerup', unregisterWindowPointerMoveHandler)
	}

	function unregisterWindowPointerMoveHandler() {
		window.removeEventListener('pointermove', handlePointerMove)
	}

	function handlePointerMove(event: PointerEvent) {
		const { clientX, clientY } = event
		setColourSelectorPosition(clientX, clientY)
	}

	function setSpectrumSize(size: number) {
		if (!spectrumRef) return

		spectrumRef.width = size
		spectrumRef.height = size
	}

	function setSpectrumRect() {
		if (!spectrumRef) return

		const rect = spectrumRef.getBoundingClientRect()

		setSpectrumLeft(rect.left)
		setSpectrumTop(rect.top)
		setSpectrumWidth(rect.width)
		setSpectrumHeight(rect.height)
	}

	function handleSpectrumArrowKeydown({ key }: KeyboardEvent) {
		let x = spectrumLeft() + colourSelectorX()
		let y = spectrumTop() + colourSelectorY()

		switch (key) {
			case 'ArrowUp':
				y--
				break
			case 'ArrowDown':
				y++
				break
			case 'ArrowLeft':
				x--
				break
			case 'ArrowRight':
				x++
		}

		setColourSelectorPosition(x, y)
	}

	createEffect(() => {
		setSpectrumSize(props.spectrumSize)
		setSpectrumRect()
		drawSpectrum()
	})

	createEffect(() => {
		if (!shouldEcho()) return

		setColourSelectorPositionFromColour(theme().colour())
	})

	createEffect(() => {
		if (isSpectrumFocused()) {
			document.addEventListener('keydown', handleSpectrumArrowKeydown)
			return
		}
		document.removeEventListener('keydown', handleSpectrumArrowKeydown)
	})

	onCleanup(() => {
		unregisterWindowPointerMoveHandler()
		document.removeEventListener('keydown', handleSpectrumArrowKeydown)
	})

	return (
		<div
			class={`${css.root} ${props.class}`}
			style={assignInlineVars({ [css.hueVar]: String(hue()) })}
		>
			<div
				class={css.spectrumContainer}
				{...focusableProps}
				onFocus={[setIsSpectrumFocused, true]}
				onBlur={[setIsSpectrumFocused, false]}
			>
				<canvas
					ref={spectrumRef}
					onPointerDown={handleCanvasPointerDown}
					class={css.spectrum}
				/>
				<div
					class={css.colourSelector}
					style={{
						transform: `translate(${colourSelectorX()}px, ${colourSelectorY()}px)`,
					}}
				/>
			</div>
			<div class={css.hueRangeContainer}>
				<input
					class={css.hueRange}
					{...focusableProps}
					onInput={handleHueRangeInput}
					ref={hueRangeRef}
					type="range"
					min="0"
					max="360"
					value="10"
				/>
			</div>
			<FieldText value={hexColour} />
		</div>
	)
}

export default TheColourPicker
