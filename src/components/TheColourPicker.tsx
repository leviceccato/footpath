import type { Component } from 'solid-js'
import * as css from './TheColourPicker.css'

const TheColourPicker: Component = (props) => {
	let canvasRef: HTMLCanvasElement | undefined

	return (
		<div class={css.root}>
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
