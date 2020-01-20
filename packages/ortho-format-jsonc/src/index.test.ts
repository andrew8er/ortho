import { test, expect } from 'vitest'
import { toSource } from '@andrew8er/ortho-core'
import { withFileTypes } from '@andrew8er/ortho-node-file'

import { jsoncFileSupport } from './index.js'

test('Throws when trying to find .json file without jsonFileSupport', async () => {
	await expect(
		withFileTypes().findOneRequired(['./test/json_1.json'])
	).rejects.toThrow()
})

test('Finds and parses .json file with jsonFileSupport', async () => {
	await expect(
		withFileTypes(jsoncFileSupport).findOneRequired(['./test/json_1.json'])
	).resolves.toStrictEqual(
		toSource('./test/json_1.json', { p1: 'test_1' })
	)
})
