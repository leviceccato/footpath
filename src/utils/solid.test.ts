import { describe, expect, test } from 'bun:test'
import { defaultValues } from './solid'

describe('solid', () => {
	test('defaultValues', () => {
		const rawObj: {
			foo: string
			bar: string
			baz?: string
		} = {
			foo: 'foo',
			bar: 'bar',
			baz: undefined,
		}

		const obj = defaultValues(rawObj, { baz: 'baz' })
		expect(obj.foo).toBe('foo')
		expect(obj.bar).toBe('bar')
		expect(obj.baz).toBe('baz')
	})
})
