import { test, expect } from 'vitest'

import { object } from './object.js'
import { string } from './string.js'
import { toSource } from '../index.js'

test('Raw / Validates empty object', () => {
	expect(
		object({}).validateRaw({})
	).toEqual({})
})

test('Raw / Validates correct object content', () => {
	expect(
		object({
			p1: string(),
		}).validateRaw({
			p1: 'string-1',
		})
	).toEqual({
		p1: 'string-1'
	})
})

test('Raw / Throws on invalid data type', () => {
	expect(() =>
		object({}).validateRaw(123)
	).toThrow()
})

test('Raw / Throws on invalid object property data type', () => {
	expect(() =>
		object({
			p1: string(),
		}).validateRaw({
			p1: 123,
		})
	).toThrow()
})

test('Source / Validates empty object', () => {
	expect(
		object({}).validateSources(toSource('test', {})).raw
	).toEqual({});
})

test('Source / Validates correct object content', () => {
	expect(
		object({
			p1: string(),
		}).validateSources(toSource('test', {
			p1: 'string-1',
		})).raw
	).toEqual({
		p1: 'string-1'
	})
})

test('Source / Throws on invalid data type', () => {
	expect(() =>
		object({}).validateSources(toSource('test', 123))
	).toThrow()
})

test('Source / Throws on invalid object element data type', () => {
	expect(() =>
		object({
			p1: string(),
		}).validateSources(toSource('test', {
			p1: 123,
		})).raw
	).toThrow()
})

test('Source / Merges two objects, uses highest priority value for same property', () => {
	expect(
		object({
			p1: string(),
		}).validateSources(
			toSource('test', {
				p1: 'a1-1',
			}),
			toSource('test', {
				p1: 'a2-1',
			}),
		).raw
	).toStrictEqual({
		p1: 'a1-1'
	})
})

test('Source / Merges two objects, ignores undefined value for same property', () => {
	expect(
		object({
			p1: string(),
		}).validateSources(
			toSource('test', undefined),
			toSource('test', {
				p1: 'a2-1',
			}),
		).raw
	).toMatchObject({
		p1: 'a2-1'
	})
})

test('Source / Merges two objects, throws on undefined for a property', () => {
	expect(() =>
		object({
			p1: string(),
		}).validateSources(
			toSource('test', undefined),
			toSource('test', undefined),
		)
	).toThrow()
})

test('Source / Merges two objects, merge properties', () => {
	expect(
		object({
			p1: string(),
			p2: string(),
		}).validateSources(
			toSource('test', {
				p1: 'a1-1',
			}),
			toSource('test', {
				p2: 'a2-1',
			}),
		).raw
	).toStrictEqual({
		p1: 'a1-1',
		p2: 'a2-1'
	})
})

test('Source / Redacts object', () => {
	expect(
		object({}, { redact: true }).validateSources(toSource('test', {})).redacted
	).toBeUndefined()
})