import { Source, Result, Schema, Options, CoercionRules, Path } from '../types.js'
import { ElementBase } from '../base.js';

export class OptionalModifier<T> implements Schema<T | undefined> {
	constructor(private readonly type: ElementBase<T>) {
	}

	validateSource(path: Path, sources: Source[]): Result<T | undefined> {
		try {
			return this.type.validateSource(path, sources);
		} catch {}

		return new OptionalResult(this.type.options, undefined)
	}

	validateRaw(data: any, coercionRules?: CoercionRules): T | undefined {
		try {
			return this.type.validateRaw(data, coercionRules);
		} catch {}

		return data;
	}

	toString() { return `Optional: type='${this.type}'` }
}

class OptionalResult<T> implements Result<T | undefined> {
	constructor(
		public readonly options: Options,
		public readonly raw: T,
	) {}

	readonly sources = []

	get redacted(): any { return this.options.redact ? undefined : this.raw }
}