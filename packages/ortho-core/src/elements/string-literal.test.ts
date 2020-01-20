import { test, expect } from 'vitest'

import { stringLiteral } from './string-literal.js'
import { toSource } from '../index.js'

test('Raw / Validates string literal', () => {
	expect(
		stringLiteral('literal').validateRaw('literal')
	).toEqual('literal');
})

test('Raw / Throws on invalid data type', () => {
	expect(
		() => stringLiteral('literal').validateRaw(123)
	).toThrow()
})

test('Source / Validates string literal', () => {
	expect(
		stringLiteral('literal').validateSources(toSource('test', 'literal')).raw
	).toEqual('literal');
})

test('Source / Throws on invalid data type', () => {
	expect(
		() => stringLiteral('literal').validateSources(toSource('test', 123))
	).toThrow()
})

test('Source / Merges two string literals, uses highest priority value', () => {
	expect(
		stringLiteral('literal').validateSources(
			toSource('test', 'literal'),
			toSource('test', 'ignored'),
		).raw
	).toBe('literal')
})

test('Source / Merges two string literals, ignores undefined value', () => {
	expect(
		stringLiteral('literal').validateSources(
			toSource('test', undefined),
			toSource('test', 'literal'),
		).raw
	).toBe('literal')
})

test('Source / Merges two string literals, throws on undefined', () => {
	expect(() =>
		stringLiteral('literal').validateSources(
			toSource('test', undefined),
			toSource('test', undefined),
		)
	).toThrow()
})

test('Source / Redacts string literal', () => {
	expect(
		stringLiteral('literal', { redact: true }).validateSources(toSource('test', 'literal')).redacted
	).toBeUndefined()
})