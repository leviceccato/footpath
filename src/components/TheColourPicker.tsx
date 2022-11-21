import {
	mergeProps,
	createSignal,
	onMount,
	createEffect,
	onCleanup,
} from 'solid-js'
import { assignInlineVars } from '@vanilla-extract/dynamic'
import { clamp } from '@/scripts/utils'
import type { JSX, Component } from 'solid-js'
import { useTheme } from '@/components/ProviderTheme'
import * as css from './TheColourPicker.css'

type CanvasPointerEvent = PointerEvent & {
	currentTarget: HTMLCanvasElement
	target: Element
}

const TheColourPicker: Component<{ class?: string; spectrumSize?: number }> = (
	props,
) => {
	const _props = mergeProps({ spectrumSize: 180 }, props)

	let spectrumRef: HTMLCanvasElement | undefined
	let hueRangeRef: HTMLInputElement | undefined

	const [theme] = useTheme()

	const [hue, setHue] = createSignal(0)
	const [colourSelectorX, setColourSelectorX] = createSignal(0)
	const [colourSelectorY, setColourSelectorY] = createSignal(0)
	const [spectrumLeft, setSpectrumLeft] = createSignal(0)
	const [spectrumTop, setSpectrumTop] = createSignal(0)
	const [spectrumWidth, setSpectrumWidth] = createSignal(0)
	const [spectrumHeight, setSpectrumHeight] = createSignal(0)

	function _setHue(to: number) {
		setHue(to)
		drawSpectrum()
	}

	const handleHueRangeInput: JSX.EventHandler<HTMLInputElement, InputEvent> = (
		event,
	) => {
		const value = Number(event.currentTarget.value)
		_setHue(value)
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

		setSpectrumSize()
		setSpectrumRect()

		setColourSelectorPosition(event)
	}

	function setColourSelectorPosition(event: PointerEvent) {
		const x = clamp(0, event.clientX - spectrumLeft(), spectrumWidth())
		const y = clamp(0, event.clientY - spectrumTop(), spectrumHeight())

		setColourSelectorX(x)
		setColourSelectorY(y)
	}

	function registerWindowPointerMoveHandler() {
		window.addEventListener('pointermove', handlePointerMove)
		window.addEventListener('pointerup', unregisterWindowPointerMoveHandler)
	}

	function unregisterWindowPointerMoveHandler() {
		window.removeEventListener('pointermove', handlePointerMove)
	}

	function handlePointerMove(event: PointerEvent) {
		setColourSelectorPosition(event)
	}

	function setSpectrumSize() {
		if (!spectrumRef) return

		spectrumRef.width = _props.spectrumSize
		spectrumRef.height = _props.spectrumSize
	}

	function setSpectrumRect() {
		if (!spectrumRef) return

		const rect = spectrumRef.getBoundingClientRect()

		setSpectrumLeft(rect.left)
		setSpectrumTop(rect.top)
		setSpectrumWidth(rect.width)
		setSpectrumHeight(rect.height)
	}

	onMount(() => {
		setSpectrumSize()
		setSpectrumRect()
		drawSpectrum()
	})

	onCleanup(() => {
		unregisterWindowPointerMoveHandler()
	})

	return (
		<div
			class={`${css.root} ${_props.class ?? ''}`}
			style={assignInlineVars({ [css.hueVar]: String(hue()) })}
		>
			<div class={css.spectrumContainer}>
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
					onInput={handleHueRangeInput}
					ref={hueRangeRef}
					type="range"
					min="0"
					max="360"
					value="10"
				/>
			</div>
		</div>
	)
}

export default TheColourPicker
