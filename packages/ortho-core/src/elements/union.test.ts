import { test, expect } from 'vitest'

import { number } from './number.js'
import { boolean } from './boolean.js'
import { union } from './union'
import { toSource } from '../index.js'

test('Raw / Validates union', () => {
	expect(
		union({}, number(), boolean()).validateRaw(123)
	).toEqual(123)
});

test('Raw / Throws on invalid data type', () => {
	expect(() =>
		union({}, number(), boolean()).validateRaw('12')
	).toThrow()
})

test('Source / Validates union', () => {
	expect(
		union({}, number(), boolean()).validateSources(toSource('test', 123)).raw
	).toEqual(123)
});

test('Source / Throws on invalid data type', () => {
	expect(() =>
		union({}, number(), boolean()).validateSources(toSource('test', '123'))
	).toThrow()
})

test('Source / Merges two unions, uses highest priority value', () => {
	expect(
		union({}, number(), boolean()).validateSources(
			toSource('test', 123),
			toSource('test', 345),
		).raw
	).toBe(123)
})

test('Source / Merges two unions, ignores undefined value', () => {
	expect(
		union({}, number(), boolean()).validateSources(
			toSource('test', undefined),
			toSource('test', 123),
		).raw
	).toBe(123)
})

test('Source / Merges two unions, throws on undefined', () => {
	expect(() =>
		union({}, number(), boolean()).validateSources(
			toSource('test', undefined),
			toSource('test', undefined),
		).raw
	).toThrow()
})

test('Source / Redacts union', () => {
	expect(
		union({ redact: true }, number(), boolean()).validateSources(toSource('test', 12)).redacted
	).toBeUndefined()
})
