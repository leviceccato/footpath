import { type HslColor } from 'polished/lib/types/color'

/* For working with iframe.contentWindow */
export type GlobalWindow = Window & typeof globalThis

type HsvColour = {
	hue: number
	saturation: number
	value: number
}

export function lastSegmentFromPath(path: string): string {
	const lastSegment = path.substring(path.lastIndexOf('/') + 1)
	const [lastSegmentWithoutExtension] = lastSegment.split('.')

	return lastSegmentWithoutExtension
}

export function decimalToPercentage(decimal: number): string {
	return `${decimal * 100}%`
}

export function createRandomColour(): string {
	return `#${(Math.random() * 0xfffff * 1000000).toString(16).slice(0, 6)}`
}

export function clamp(min: number, value: number, max: number): number {
	return Math.min(Math.max(value, min), max)
}

export function hslToHsv(colour: HslColor): HsvColour {
	const value =
		colour.lightness +
		colour.saturation * Math.min(colour.lightness, 1 - colour.lightness)

	if (value !== 0) {
		colour.saturation = 2 * (1 - colour.lightness / value)
	}

	return { hue: colour.hue, saturation: colour.saturation, value }
}

export function hsvToHsl(colour: HsvColour): HslColor {
	const lightness = colour.value * (1 - colour.saturation / 2)

	if (lightness !== 1 && lightness !== 0) {
		colour.saturation =
			(colour.value - lightness) / Math.min(lightness, 1 - lightness)
	}

	return { hue: colour.hue, saturation: colour.saturation, lightness }
}

export function sleep(duration: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, duration))
}

export function isInIframe(): boolean {
	return window.location !== window.parent.location
}

/* Run promises in sequence */
export async function sequence<TItem>(
	items: TItem[],
	callback: (item: TItem) => Promise<void>,
): Promise<void> {
	return items.reduce(
		(result, current) => result.then(() => callback(current)),
		Promise.resolve(),
	)
}

export function roundByDpr(value: number): number {
	const dpr = window.devicePixelRatio
	return Math.round(value * dpr) / dpr
}
