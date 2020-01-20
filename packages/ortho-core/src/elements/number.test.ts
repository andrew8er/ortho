import { test, expect } from 'vitest'

import { number } from './number.js'
import { toSource } from '../index.js'

test('Raw / Validates number', () => {
	expect(
		number().validateRaw(123)
	).toEqual(123);
});

test('Raw / Throws on invalid data type', () => {
	expect(() =>
		number().validateRaw('123')
	).toThrow()
})

test('Source / Validates number', () => {
	expect(
		number().validateSources(toSource('test', 123)).raw
	).toEqual(123);
});

test('Source / Throws on invalid data type', () => {
	expect(() =>
		number().validateSources(toSource('test', '123'))
	).toThrow()
})

test('Source / Merges two numbers, uses highest priority value', () => {
	expect(
		number().validateSources(
			toSource('test', 123),
			toSource('test', 345),
		).raw
	).toBe(123)
})

test('Source / Merges two numbers, ignores undefined value', () => {
	expect(
		number().validateSources(
			toSource('test', undefined),
			toSource('test', 123),
		).raw
	).toBe(123)
})

test('Source / Merges two numbers, throws on undefined', () => {
	expect(() =>
		number().validateSources(
			toSource('test', undefined),
			toSource('test', undefined),
		)
	).toThrow()
})

test('Source / Redacts number', () => {
	expect(
		number({ redact: true }).validateSources(toSource('test', 34)).redacted
	).toBeUndefined()
})