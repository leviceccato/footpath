import type { HslColor } from 'polished/lib/types/color'

export type GlobalWindow = Window & typeof globalThis

type HsvColour = {
	hue: number
	saturation: number
	value: number
}

export function lastSegmentFromPath(path: string): string {
	const lastSegment = path.substring(path.lastIndexOf('/') + 1)
	const [lastSegmentWithoutExtension, ..._] = lastSegment.split('.')

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

export function sleep(duration: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, duration))
}

export function isInIframe(): boolean {
	return window.location !== window.parent.location
}

export async function sequence<T>(promises: Promise<T>[]): Promise<T[]> {
	let results: T[] = []
	for (const promise of promises) {
		results.push(await promise)
	}
	return results
}
