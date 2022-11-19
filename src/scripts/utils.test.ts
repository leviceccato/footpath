import { describe, assert, expect, test } from 'vitest'
import {
	lastSegmentFromPath,
	decimalToPercentage,
	createRandomColour,
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
		const got = createRandomColour()

		expect(got).toBeTypeOf('string')
		expect(got).toHaveLength(7)

		const [hash, ...colours] = got
		expect(got[0]).toBe('#')

		colours
			.join('')
			.match(/.{1, 2}/g)
			?.forEach((colour) => {
				expect(isNaN(parseInt(colour, 16))).toBe(false)
			})
	})
})
