import { Source, Result, Options, CoercionRules, Path } from '../types.js'
import { ElementBase, defaultOptions, ValidationError } from '../base.js'
import { find } from '../utils.js'

export const number = (options?: Partial<Options>): NumberElement =>
	new NumberElement(options);

export class NumberElement extends ElementBase<number> {
	constructor(options?: Partial<Options>) {
		super();
		this.options = Object.assign({}, defaultOptions, options);
	}

	readonly options: Options

	validateSource(path: Path, sources: Source[]): Result<number> {
		const result = find(sources, (s) => {
			try {
				const validated = this.validateRaw(s.value, s.coerce)

				if (validated !== undefined) {
					return new NumberResult([s.name], this.options, validated);
				}
			} catch (err) {
				if (err instanceof ValidationError) {
					err.meta = {
						source: s,
						type: this,
						path: path,
					}
				}
			}
		});

		if (result !== undefined) {
			return result;
		} else {
			throw new ValidationError(`Must be 'number', is 'undefined'`, {
				type: this,
				path: path,
			});
		}
	}

	validateRaw(data: any, coercionRules?: CoercionRules): number {
		if (typeof data === 'number') {
			return data;
		} else if (data != undefined) {
			if (coercionRules?.coerceToNumber) {
				const coerced = coercionRules.coerceToNumber(data);

				if (coerced !== undefined) {
					return coerced;
				} else {
					throw new ValidationError(`Cannot coerce ${typeof coerced} "${coerced}" to 'number'`);
				}
			} else {
				throw new ValidationError(`Must be 'number', is '${typeof data}' and cannot coerce`);
			}
		} else {
			throw new ValidationError(`Must be 'number', is 'undefined'`);
		}
	}

	toString() { return `Number:` }
}

class NumberResult implements Result<number> {
	constructor(
		public readonly sources: string[],
		public readonly options: Options,
		public readonly raw: number,
	) {}

	get redacted(): any { return this.options.redact ? undefined : this.raw }
}