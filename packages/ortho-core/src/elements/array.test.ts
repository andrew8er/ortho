import { test, expect } from 'vitest'

import { array } from './array.js'
import { string } from './string.js'
import { toSource } from '../index.js';

test('Raw / Validates empty array', () => {
	expect(
		array(string()).validateRaw([])
	).toEqual([]);
});

test('Raw / Throws on invalid data type', () => {
	expect(() =>
		array(string()).validateRaw(123)
	).toThrow()
})

test('Source / validates empty array', () => {
	expect(
		array(string()).validateSources(toSource('test', [])).raw
	).toEqual([]);
});

test('Source / Throws on invalid data type', () => {
	expect(() =>
		array(string()).validateSources(toSource('test', 123))
	).toThrow()
})

test('Source / Throws on invalid array element data type', () => {
	expect(() =>
		array(string()).validateSources(toSource('test', [ 123 ]))
	).toThrow()
})

test('Source / Throws on invalid array element data type', () => {
	expect(() =>
		array(string()).validateRaw([ 123 ])
	).toThrow()
})

test('Source / Merges two arrays, uses highest priority value', () => {
	expect(
		array(string()).validateSources(
			toSource('test', [ 'a1-1' ]),
			toSource('test', [ 'a2-1' ]),
		).raw
	).toStrictEqual([ 'a1-1' ])
})

test('Source / Merges two arrays, ignores undefined value', () => {
	expect(
		array(string()).validateSources(
			toSource('test', undefined),
			toSource('test', [ 'a2-1' ]),
		).raw
	).toStrictEqual(['a2-1'])
})

test('Source / Merges two arrays, throws on undefined', () => {
	expect(() =>
		array(string()).validateSources(
			toSource('test', undefined),
			toSource('test', undefined),
		).raw
	).toThrow()
})

test('Source / Redacts array', () => {
	expect(
		array(string(), { redact: true }).validateSources(toSource('test', [])).redacted
	).toBeUndefined()
})
