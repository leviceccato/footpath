import { mergeProps, createSignal, onMount, createEffect } from 'solid-js'
import { assignInlineVars } from '@vanilla-extract/dynamic'
import type { JSX, Component } from 'solid-js'
import { useTheme } from '@/components/ProviderTheme'
import * as css from './TheColourPicker.css'

const TheColourPicker: Component<{ class?: string; canvasSize?: number }> = (
	props,
) => {
	const _props = mergeProps({ canvasSize: 180 }, props)

	let spectrumRef: HTMLCanvasElement | undefined
	let hueRangeRef: HTMLInputElement | undefined

	const [theme] = useTheme()

	const [hue, setHue] = createSignal(0)

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

	onMount(() => {
		drawSpectrum()
	})

	return (
		<div
			class={`${css.root} ${_props.class ?? ''}`}
			style={assignInlineVars({ [css.hueVar]: String(hue()) })}
		>
			<div class={css.spectrumContainer}>
				<canvas
					ref={spectrumRef}
					class={css.spectrum}
				/>
				<div class={css.colourSelector} />
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
