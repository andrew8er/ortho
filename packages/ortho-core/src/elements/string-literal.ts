import { Source, Result, Options, CoercionRules, Path } from '../types.js'
import { ElementBase, defaultOptions, ValidationError } from '../base.js'
import { find } from '../utils.js'

export const stringLiteral = <T extends string>(literal: T, options?: Partial<Options>): StringLiteralElement<T> =>
	new StringLiteralElement(literal, options);

export class StringLiteralElement<T extends string> extends ElementBase<string> {
	constructor(
		public readonly literal: T,
		options?: Partial<Options>,
	) {
		super();
		this.options = Object.assign({}, defaultOptions, options);
	}

	readonly options: Options

	validateSource(path: Path, sources: Source[]): Result<T> {
		const result = find(sources, (s) => {
			try {
				const validated = this.validateRaw(s.value, s.coerce)

				if (validated !== undefined) {
					return new StringLiteralResult([s.name], this.options, validated);
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
			throw new ValidationError(`Must be string literal '${this.literal}', is 'undefined'`, {
				type: this,
				path: path,
			});
		}
	}

	validateRaw(data: any, coercionRules?: CoercionRules): T {
		if (data === this.literal) {
			return data;
		} else {
			if (coercionRules?.coerceToString) {
				const coerced = coercionRules.coerceToString(data);

				if (coerced === this.literal) {
					return coerced as T;
				} else {
					throw new ValidationError(`Cannot coerce ${typeof coerced} '${coerced}' to '${this.literal}'`);
				}
			} else {
				throw new ValidationError(`Must be string literal '${this.literal}', is '${typeof data}'`);
			}
		}
	}

	toString() { return `StringLiteral: literal=${this.literal}` }
}

class StringLiteralResult<T extends string> implements Result<T> {
	constructor(
		public readonly sources: string[],
		public readonly options: Options,
		public readonly raw: T,
	) {}

	get redacted(): any { return this.options.redact ? undefined : this.raw }
}

