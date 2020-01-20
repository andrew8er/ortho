import { Source, Result, Schema, Options, CoercionRules, Path } from '../types.js'
import { ElementBase } from '../base.js';

export const defaultSourceName = '[default]';

export class DefaultModifier<T> implements Schema<NonNullable<T>> {
	constructor(
		private readonly type: ElementBase<T>,
		private readonly defaultValue: NonNullable<T>,
	) {
	}

	validateSource(path: Path, sources: Source[]): Result<NonNullable<T>> {
		const result = this.type.validateSource(path, sources);

		return isNonNullable(result)
			? result
			: new WithDefaultResult(this.type.options, this.defaultValue);
	}

	validateRaw(data: any, coercionRules?: CoercionRules): NonNullable<T> {
		const result = this.type.validateRaw(data, coercionRules);

		return result !== undefined && result !== null
			? result
			: this.defaultValue
	}

	toString() { return `Default: type='${this.type}'` }
}

function isNonNullable<T>(data: Result<T>): data is Result<NonNullable<T>> {
	return data !== undefined && data !== null
}

class WithDefaultResult<T> implements Result<NonNullable<T>> {
	constructor(
		public readonly options: Options,
		public readonly raw: NonNullable<T>,
	) {}

	readonly sources = [ defaultSourceName ]

	get redacted(): any { return this.options.redact ? undefined : this.raw }
}