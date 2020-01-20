import { Source, Result, Schema, Options, CoercionRules, Path } from '../types.js'
import { ElementBase, defaultOptions, ValidationError } from '../base.js'

export const object = <T>(properties: ObjectProperties<T>, options?: Partial<Options>): ObjectElement<T> =>
	new ObjectElement(properties, options);

export type ObjectProperties<T> = { readonly [P in keyof T]: Schema<T[P]> } // TODO restrict to string keys

export class ObjectElement<T> extends ElementBase<T> {
	constructor(
		public readonly properties: ObjectProperties<T>,
		options?: Partial<Options>,
	) {
		super();
		this.options = Object.assign({}, defaultOptions, options);
	}

	readonly options: Options

	validateSource(path: Path, sources: Source[]): ObjectResult<T> {
		// all sources must contain objects or be undefined
		const objectSources = sources.filter(s => {
			if (typeof s.value === 'object' && s.value !== null && !Array.isArray(s.value)) {
				return true;
			} else if (s.value != undefined) {
				throw new ValidationError(`Object: Must be of type 'object', is '${typeof s}'`, {
					source: s,
					type: this,
					path: path,
				})
			}
		});

		if (objectSources.length > 0) {
			// check every defined property
			return new ObjectResult(
				objectSources.map(s => s.name),
				this.options,
				Object.keys(this.properties).reduce((acc, p) => {
					acc[p as keyof T] = this.properties[p as keyof T].validateSource(
						[...path, p.toString()],
						// find all sources that provide this property
						objectSources.reduce((acc, s) => {
							const v = s.value[p];
							if (v !== undefined) acc.push(v);
							return acc;
						}, [] as Source[])
					)
					return acc
				}, {} as { [P in keyof T]: Result<T[P]> })
			)
		} else {
			throw new ValidationError(`Object: Must be of type 'object', is 'undefined'`, {
				type: this,
				path: path,
			})
		}
	}

	validateRaw(data: any, coercionRules?: CoercionRules): T {
		if (data !== null && typeof data === 'object' && !Array.isArray(data)) {
			// check every defined property
			Object.keys(this.properties).reduce((acc, p) => {
				acc[p as keyof T] = this.properties[p as keyof T].validateRaw(data[p])
				return acc
			}, {} as { [P in keyof T]: T[P] })

			return data
		} else {
			throw new ValidationError(`Object: Must be of type 'object', is '${typeof data}'`);
		}
	}

	toString() { return `Object: ` }
}

export class ObjectResult<T> implements Result<T> {
	constructor(
		public readonly sources: string[],
		public readonly options: Options,
		public readonly result: { [P in keyof T]: Result<T[P]> },
	) {}

	get raw(): T {
		return Object.keys(this.result).reduce((acc, p) => {
			acc[p as keyof T] = this.result[p as keyof T].raw;
			return acc;
		}, {} as T)
	}

	get redacted(): any {
		return this.options.redact
			? undefined
			: Object.keys(this.result).reduce((acc, p) => {
				acc[p] = this.result[p as keyof T].redacted;
				return acc;
			}, {} as any)
		}
}