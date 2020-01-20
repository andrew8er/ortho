import { test, expect } from 'vitest'

import { boolean } from './boolean.js'
import { toSource } from '../index.js'

test('Raw / Validates boolean', () => {
	expect(
		boolean().validateRaw(true)
	).toEqual(true);
});

test('Raw / Throws on invalid data type', () => {
	expect(() =>
		boolean().validateRaw(123)
	).toThrow()
})

test('Source / Validates boolean', () => {
	expect(
		boolean().validateSources(toSource('test', true)).raw
	).toEqual(true);
});

test('Source / Throws on invalid data type', () => {
	expect(() =>
		boolean().validateSources(toSource('test', 123))
	).toThrow()
})

test('Source / Merges two booleans, uses highest priority value', () => {
	expect(
		boolean().validateSources(
			toSource('test', true),
			toSource('test', false),
		).raw
	).toBe(true)
})

test('Source / Merges two booleans, ignores undefined value', () => {
	expect(
		boolean().validateSources(
			toSource('test', undefined),
			toSource('test', true),
		).raw
	).toBe(true)
})

test('Source / Merges two booleans, throws on undefined', () => {
	expect(() =>
		boolean().validateSources(
			toSource('test', undefined),
			toSource('test', undefined),
		)
	).toThrow()
})

test('Source / Redacts boolean', () => {
	expect(
		boolean({ redact: true }).validateSources(toSource('test', true)).redacted
	).toBeUndefined()
})