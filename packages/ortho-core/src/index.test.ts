import { test, expect } from 'vitest'

import { array, toSource, stringLiteral, string, union, object, number } from './index.js'

test('Validates complex object 1', () => {
	expect(
		object({
			p1: union({},
				stringLiteral('literal-1'),
				stringLiteral('literal-2'),
			).optional(),
			p2: string(),
			nest: object({
				p22: string().optional()
			}),
			arr1: array(string())
		}).validateSources(toSource('test', {
			p1: 'literal-1',
			p2: 'string',
			nest: {
				p22: 'string',
			},
			arr1: ['string'],
		})).raw
	).toEqual({
		p1: 'literal-1',
		p2: 'string',
		nest: {
			p22: 'string',
		},
		arr1: ['string']
	})
})

const s = object({
	environment: union({ info: 'Environment this service is running in' },
		stringLiteral('staging'),
		stringLiteral('production'),
	),
	logging: object({
		level: union({ info: 'Log level', redact: true },
			stringLiteral('debug'),
			stringLiteral('info'),
			stringLiteral('warn'),
			stringLiteral('error'),
		)
	}),
	settings: object({
		token_key: string({
			info: 'Signing key for auth tokens',
			redact: true,
		}),
		signing_parameters: object({
			keylen: number({ info: 'Key length for signing' }).default(254),
			cost: number({ info: 'Cost factor' }).default(4096),
		}),
	}),
});

test('Validates complex object 2', () => {
	expect(
		object({
			environment: union({ info: 'Environment this service is running in' },
				stringLiteral('staging'),
				stringLiteral('production'),
			),
			logging: object({
				level: union({ info: 'Log level', redact: true },
					stringLiteral('debug'),
					stringLiteral('info'),
					stringLiteral('warn'),
					stringLiteral('error'),
				)
			}),
			settings: object({
				token_key: string({
					info: 'Signing key for auth tokens',
					redact: true,
				}),
				signing_parameters: object({
					keylen: number({ info: 'Key length for signing' }).default(254),
					cost: number({ info: 'Cost factor' }).default(4096),
				}),
			}),
		}).validateSources(toSource('source', {
			environment: 'staging',
			logging: {
				level: 'info',
			},
			settings: {
				token_key: '3jl!ds1*o980j_#3',
				signing_parameters: {
					keylen: 512,
					cost: 4096,
				},
			},
		})).raw
	).toStrictEqual({
		environment: 'staging',
		logging: {
			level: 'info',
		},
		settings: {
			token_key: '3jl!ds1*o980j_#3',
			signing_parameters: {
				keylen: 512,
				cost: 4096,
			},
		},
	})
})
