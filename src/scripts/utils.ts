import type { HslColor } from 'polished/lib/types/color'

type HsvColour = {
	hue: number
	saturation: number
	value: number
}

export function lastSegmentFromPath(path: string): string {
	const lastSegment = path.substring(path.lastIndexOf('/') + 1)
	const lastSegmentWithoutExtension = lastSegment.split('.')[0]
	return lastSegmentWithoutExtension
}

export function decimalToPercentage(decimal: number): string {
	return `${Math.round(decimal * 100)}%`
}

export function createRandomColour(): string {
	return '#' + (Math.random() * 0xfffff * 1000000).toString(16).slice(0, 6)
}

export function clamp(min: number, value: number, max: number): number {
	return Math.min(Math.max(value, min), max)
}

export function hslToHsv(colour: HslColor): HsvColour {
	let { hue, saturation, lightness } = colour
	const value = lightness + saturation * Math.min(lightness, 1 - lightness)

	if (value !== 0) {
		saturation = 2 * (1 - lightness / value)
	}

	return { hue, saturation, value }
}

export function hsvToHsl(colour: HsvColour): HslColor {
	let { hue, saturation, value } = colour
	const lightness = value * (1 - saturation / 2)

	if (lightness !== 1 && lightness !== 0) {
		saturation = (value - lightness) / Math.min(lightness, 1 - lightness)
	}

	return { hue, saturation, lightness }
}
