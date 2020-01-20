import { test, expect } from 'vitest'

import { toSource } from './utils.js'

test('Wraps primitive value', () => {
	expect(
		toSource('source', 'string')
	).toStrictEqual(
		toSource('source', 'string')
	)
})

test('Wraps object properties', () => {
	expect(
		toSource('source', { p: 'string' })
	).toStrictEqual(
		toSource('source', { p: 'string' })
	)
})

test('Wraps array elements', () => {
	expect(
		toSource('source', [1, 2])
	).toStrictEqual(
		toSource('source', [1, 2])
	)
})

test('Wraps nested object', () => {
	expect(
		toSource('source', {
			p1: 'string',
			p2: [1, 2],
		})
	).toStrictEqual(
		toSource(
			'source', {
				p1: 'string',
				p2: [
					1,
					2,
				]
			}
		)
	)
})