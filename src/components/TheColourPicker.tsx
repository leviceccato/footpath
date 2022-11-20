import { mergeProps, createSignal, onMount } from 'solid-js'
import type { Component } from 'solid-js'
import { useTheme } from '@/components/ProviderTheme'
import * as css from './TheColourPicker.css'

const TheColourPicker: Component<{ class?: string; canvasSize?: number }> = (
	props,
) => {
	const _props = mergeProps({ canvasSize: 180 }, props)

	let canvasRef: HTMLCanvasElement | undefined

	const [theme] = useTheme()

	const [hue, setHue] = createSignal(0)

	function drawSpectrum() {
		const context = canvasRef?.getContext('2d')
		if (!context) return

		// Create hue to white gradient

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

		// Create transparent to black gradient

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
		<div class={`${css.root} ${_props.class ?? ''}`}>
			<div class={css.canvasContainer}>
				<canvas
					ref={canvasRef}
					class={css.canvas}
				/>
				<div class={css.colourSelector} />
			</div>
			<div class={css.hueRangeContainer}>
				<input
					class={css.hueRange}
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
