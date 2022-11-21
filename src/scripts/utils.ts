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
