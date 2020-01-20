import { test, expect } from 'vitest'
import { toSource } from '@andrew8er/ortho-core'

import { environment, environmentDefaultOptions } from './index.js'

test('Errors with variable shadowing another', () => {
	cleanEnv('conf_');

	process.env.conf_part1 = 'test1';
	process.env.conf_part1_part2 = 'shadow';

	expect(
		() => environment({ prefix: 'conf_' })
	).toThrow();
});

test('Succeeds with valid environment', () => {
	cleanEnv('conf_');

	process.env.conf_part1_value1 = '_value1';
	process.env.conf_part1_value2 = '_value2';
	process.env.conf_value3 = '_value3';

	expect(
		environment({ prefix: 'conf_' })
	).toStrictEqual(
		toSource(
			'[environment]',
			{
				part1: {
					value1: '_value1',
					value2: '_value2',
				},
				value3: '_value3',
			},
			environmentDefaultOptions.coercion
		)
	);
});

function cleanEnv(prefix: string) {
	Object.keys(process.env).forEach(env => {
		if (env.startsWith(prefix)) {
			delete process.env[env];
		}
	});
}