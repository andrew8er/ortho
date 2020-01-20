import { Source, CoercionRules, Path } from './types.js'

/**
 * Recursively wraps a data structure into a {@link Source} type for use in
 * {@link Schema.validateSource} calls.
 */
export const toSource = (name: string, value: unknown, coerce: CoercionRules = {}): Source =>
	toSourceRecursive([], name, value, coerce);

function toSourceRecursive(path: Path, name: string, value: unknown, coerce: CoercionRules): Source {
	if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
		return {
			name: name,
			coerce: coerce,
			value: Object.entries(value).reduce((acc, [property, value]) => {
				acc[property] = toSourceRecursive([...path, property], name, value, coerce);
				return acc;
			}, {} as any),
		};
	} else if (Array.isArray(value)) {
		return {
			name: name,
			coerce: coerce,
			value: value.map((value, i) => toSourceRecursive([...path, i], name, value, coerce)),
		};
	} else {
		return {
			name: name,
			coerce: coerce,
			value: value,
		};
	}
}

/**
 * Like Array.find(), but returns the value of the predicate if it returns anything else than undefined .
 */
 export function find<T, R>(arr: T[], predicate: (v: T) => R | undefined): R | undefined {
	for (let e of arr) {
		const value = predicate(e)

		if (value !== undefined) {
			return value;
		}
	}
}