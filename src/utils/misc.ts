import { type HslColor } from 'polished/lib/types/color'
import { mergeProps } from 'solid-js'

// For working with iframe.contentWindow
export type GlobalWindow = Window & typeof globalThis

export type ClassProps = { class?: string }

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

// Run promises in sequence
export async function sequence<TItem>(
	items: TItem[],
	callback: (item: TItem) => Promise<void>,
): Promise<void> {
	return items.reduce(
		(result, current) => result.then(() => callback(current)),
		Promise.resolve(),
	)
}

type PickOptionals<TValue> = {
	[TKey in keyof TValue as TValue extends Record<TKey, TValue[TKey]>
		? never
		: TKey]-?: TValue[TKey]
}

// Make default prop declarations cleaner and more type-safe
export function defaultProps<
	TProps,
	TdefaultProps extends Partial<PickOptionals<TProps>>,
>(props: TProps, defaultProps: TdefaultProps) {
	return mergeProps(defaultProps, props)
}

// Similar to defaultProps, except it works for regular objects
export function defaultValues<
	TObject,
	TDefaultProperties extends Partial<PickOptionals<TObject>>,
>(
	object: TObject,
	defaultProperties: TDefaultProperties,
): Required<TDefaultProperties> & TObject {
	return { ...object, ...defaultProperties } as Required<TDefaultProperties> &
		TObject
}
