import { Source, Result, Options, CoercionRules, Path } from '../types.js'
import { ElementBase, defaultOptions, ValidationError } from '../base.js'
import { find } from '../utils.js'

export const string = (options?: Partial<Options>): StringElement =>
	new StringElement(options);

export class StringElement extends ElementBase<string> {
	constructor(options?: Partial<Options>) {
		super();
		this.options = Object.assign({}, defaultOptions, options);
	}

	readonly options: Options

	validateSource(path: Path, sources: Source[]): Result<string> {
		const result = find(sources, (s) => {
			try {
				const validated = this.validateRaw(s.value, s.coerce)

				if (validated !== undefined) {
					return new StringResult([s.name], this.options, validated);
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
			throw new ValidationError(`Must be 'string', is 'undefined'`, {
				type: this,
				path: path,
			});
		}
	}

	validateRaw(data: any, coercionRules?: CoercionRules): string {
		if (typeof data === 'string') {
			return data;
		} else {
			if (coercionRules?.coerceToString) {
				const coerced = coercionRules.coerceToString(data);

				if (coerced !== undefined) {
					return coerced;
				} else {
					throw new ValidationError(`Cannot coerce ${typeof coerced} "${coerced}" to 'string'`);
				}
			} else {
				throw new ValidationError(`Must be 'string', is '${typeof data}'`);
			}
		}
	}

	toString() { return `String:` }
}

class StringResult implements Result<string>  {
	constructor(
		public readonly sources: string[],
		public readonly options: Options,
		public readonly raw: string,
	) {}

	get redacted(): any { return this.options.redact ? undefined : this.raw }
}