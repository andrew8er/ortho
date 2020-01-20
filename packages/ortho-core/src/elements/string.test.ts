import { test, expect } from 'vitest'

import { string } from './string.js'
import { toSource } from '../index.js'

test('Raw / Validates string', () => {
	expect(
		string().validateRaw('string')
	).toEqual('string');
})

test('Raw / Throws on invalid data type', () => {
	expect(() =>
		string().validateRaw(123)
	).toThrow()
})

test('Source / Validates string', () => {
	expect(
		string().validateSources(toSource('test', 'string')).raw
	).toEqual('string');
})

test('Source / Throws on invalid data type', () => {
	expect(() =>
		string().validateSources(toSource('test', 123))
	).toThrow()
})

test('Source / Merges two strings, uses highest priority value', () => {
	expect(
		string().validateSources(
			toSource('test', 'string-1'),
			toSource('test', 'string-2'),
		).raw
	).toBe('string-1')
})

test('Source / Merges two strings, ignores undefined value', () => {
	expect(
		string().validateSources(
			toSource('test', undefined),
			toSource('test', 'string-2'),
		).raw
	).toBe('string-2')
})

test('Source / Merges two strings, throws on undefined', () => {
	expect(() =>
		string().validateSources(
			toSource('test', undefined),
			toSource('test', undefined),
		)
	).toThrow()
})

test('Source / Redacts string', () => {
	expect(
		string({ redact: true }).validateSources(toSource('test', 'string')).redacted
	).toBeUndefined()
})
