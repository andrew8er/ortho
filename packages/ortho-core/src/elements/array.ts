import { Source, Result, Schema, Options, CoercionRules, Path } from '../types.js'
import { ElementBase, defaultOptions, ValidationError } from '../base.js'

export const array = <T>(type: Schema<NonNullable<T>>, options?: Partial<Options>): ArrayElement<T> =>
	new ArrayElement(type, options);

export class ArrayElement<T> extends ElementBase<T[]> {
	constructor(
		public readonly type: Schema<NonNullable<T>>,
		options?: Partial<Options>,
	) {
		super();
		this.options = Object.assign({}, defaultOptions, options);
	}

	readonly options: Options

	validateSource(path: Path, sources: Source[]): ArrayResult<T> {
		const result = sources.find(s => Array.isArray(s.value));

		if (result != undefined) {
			return new ArrayResult(
				[result.name],
				this.options,
				(result.value as any[]).map(s => this.type.validateSource(path, [s]))
			);
		} else {
			throw new ValidationError(`Array: Must be of type 'Array' is undefined`, {
				type: this,
				path: path,
			});
		}
	}

	validateRaw(data: any, coercionRules?: CoercionRules): T[] {
		if (Array.isArray(data)) {
			return data.map(s => this.type.validateRaw(s))
		} else {
			throw new ValidationError(`Array: Must be of type 'Array' is '${typeof data}'`)
		}
	}

	toString() { return `Array: type='${this.type}'` }
}

export class ArrayResult<T> implements Result<T[]> {
	constructor(
		public readonly sources: string[],
		public readonly options: Options,
		public readonly results: Result<T>[],
	) {}

	get raw(): T[] { return this.results.map(e => e.raw) }

	get redacted(): any { return this.options.redact ? undefined : this.results.map(e => e.redacted) }
}