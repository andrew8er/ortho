import { toSource, Source, CoercionRules } from '@andrew8er/ortho-core'

import { merge } from './utils.js'
import { coerceStringToBoolean, coerceStringToNumber } from './coerce.js'

export const environmentSourceName: string = '[environment]';

export interface EnvironmentOptions {
	name: string;
	prefix: string;
	delimiter: string;
	coercion: CoercionRules;
}

export const environmentDefaultOptions: EnvironmentOptions = {
	name: environmentSourceName,
	prefix: 'conf_',
	delimiter: '__',
	coercion: {
		coerceToBoolean: coerceStringToBoolean,
		coerceToNumber: coerceStringToNumber,
	}
}

/**
 * Parse the process environment for ortho variables.
 *
 * @throws if an invalid environment variable configuration exists.
 */
export function environment(options: Partial<EnvironmentOptions>): Source {
	const opts = merge({}, environmentDefaultOptions, options);

	return toSource(opts.name, environmentRecursive(opts), opts.coercion);
}

const environmentRecursive = (options: EnvironmentOptions): object => Object.entries(process.env)
	.reduce((result, [name, value]) => {
		if (name.startsWith(options.prefix)) {
			const nameParts = name.slice(options.prefix.length).split('_');
			let branch = result;

			nameParts.forEach((part, index) => {
				const current = `${options.prefix}${nameParts.slice(0, index + 1)}`;

				if (index === nameParts.length - 1) { // Last part
					if (typeof branch[part] !== 'object') {
						branch[part] = value;
					} else {
						throw new Error(`Environment variables '${name}' and '${current}' cannot co-exist`);
					}
				} else { // Intermediate part
					if (branch[part] === undefined) {
						branch[part] = {};
					} else {
						if (typeof branch[part] !== 'object') {
							throw new Error(`Environment variables '${name}' and '${current}' cannot co-exist`);
						}
					}

					branch = branch[part];
				}
			});
		}

		return result;
	}, {} as any);
