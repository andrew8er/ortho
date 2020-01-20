import { Source, Result, Options, CoercionRules, Path } from '../types.js'
import { ElementBase, defaultOptions, ValidationError } from '../base.js'
import { find } from '../utils.js'

export const boolean = (options?: Partial<Options>): BooleanElement =>
	new BooleanElement(options);

export class BooleanElement extends ElementBase<boolean> {
	constructor(options?: Partial<Options>) {
		super();
		this.options = Object.assign({}, defaultOptions, options);
	}

	readonly options: Options

	validateSource(path: Path, sources: Source[]): Result<boolean> {
		const result = find(sources, (s) => {
			try {
				const validated = this.validateRaw(s.value, s.coerce)

				if (validated !== undefined) {
					return new BooleanResult([s.name], this.options, validated);
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
			throw new ValidationError(`Must be 'boolean', is 'undefined'`, {
				type: this,
				path: path,
			});
		}
	}

	validateRaw(data: any, coercionRules?: CoercionRules): boolean {
		if (typeof data === 'boolean') {
			return data;
		} else if (data != undefined) {
			if (coercionRules?.coerceToBoolean) {
				const coerced = coercionRules.coerceToBoolean(data);

				if (coerced !== undefined) {
					return coerced;
				} else {
					throw new ValidationError(`Cannot coerce ${typeof coerced} "${coerced}" to 'boolean'`);
				}
			} else {
				throw new ValidationError(`Must be 'boolean', is '${typeof data}'`);
			}
		} else {
			throw new ValidationError(`Must be 'boolean', is 'undefined'`);
		}
	}

	toString() { return `Boolean:` }
}

class BooleanResult implements Result<boolean> {
	constructor(
		public readonly sources: string[],
		public readonly options: Options,
		public readonly raw: boolean,
	) {}

	get redacted(): any { return this.options.redact ? undefined : this.raw }
}