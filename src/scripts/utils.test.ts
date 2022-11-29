import { describe, expect, test } from 'vitest'
import {
	lastSegmentFromPath,
	decimalToPercentage,
	createRandomColour,
	clamp,
} from './utils'

describe('utils', () => {
	test('lastSegmentFromPath', () => {
		expect(lastSegmentFromPath('/hello/path.ext')).toBe('path')
		expect(lastSegmentFromPath('https://www.hello.com/nested/thing.test')).toBe(
			'thing',
		)
		expect(lastSegmentFromPath('C:/Users/Someone/Somefolder/who')).toBe('who')
	})

	test('decimalToPercentage', () => {
		expect(decimalToPercentage(0.1)).toBe('10%')
		expect(decimalToPercentage(0.9)).toBe('90%')
		expect(decimalToPercentage(2)).toBe('200%')
		expect(decimalToPercentage(-3)).toBe('-300%')
	})

	test('createRandomColour', () => {
		// Create hex colour with hash, e.g. '#FF00AA'

		const got = createRandomColour()

		expect(got).toBeTypeOf('string')
		expect(got).toHaveLength(7)

		const [first, ...rest] = got
		expect(first).toBe('#')

		// Assert each hexadecimal value to be valid

		rest
			.join('')
			.match(/.{1, 2}/g)
			?.forEach((pair) => {
				expect(isNaN(parseInt(pair, 16))).toBe(false)
			})
	})

	test('clamp', () => {
		expect(clamp(0, 1, 2)).toBe(1)
		expect(clamp(-5, -60, 3)).toBe(-5)
		expect(clamp(20, 80, 60)).toBe(60)
		expect(clamp(-1, -1, -1)).toBe(-1)
	})
})
