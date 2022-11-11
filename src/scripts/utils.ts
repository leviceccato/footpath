export function lastSegmentFromPath(path: string): string {
	const lastSegment = path.substring(path.lastIndexOf('/') + 1)
	const lastSegmentWithoutExtension = lastSegment.split('.')[0]
	return lastSegmentWithoutExtension
}

export function decimalToPercentage(decimal: number): string {
	return `${Math.round(decimal * 100)}%`
}
