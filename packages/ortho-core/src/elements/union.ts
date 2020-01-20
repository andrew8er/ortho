import { Source, Result, Schema, Options, CoercionRules, Path } from '../types.js'
import { ElementBase, defaultOptions, ValidationError } from '../base.js'

export function union<T1, T2>(options: Partial<Options>, a1: Schema<T1>, a2: Schema<T2>): UnionElement<T1 | T2>
export function union<T1, T2, T3>(options: Partial<Options>, a1: Schema<T1>, a2: Schema<T2>, a3: Schema<T3>): UnionElement<T1 | T2 | T3>
export function union<T1, T2, T3, T4>(options: Partial<Options>, a1: Schema<T1>, a2: Schema<T2>, a3: Schema<T3>, a4: Schema<T4>): UnionElement<T1 | T2 | T3 | T4>
export function union<T1, T2, T3, T4, T5>(options: Partial<Options>, a1: Schema<T1>, a2: Schema<T2>, a3: Schema<T3>, a4: Schema<T4>, a5: Schema<T5>): UnionElement<T1 | T2 | T3 | T4 | T5>
export function union<T1, T2, T3, T4, T5, T6>(options: Partial<Options>, a1: Schema<T1>, a2: Schema<T2>, a3: Schema<T3>, a4: Schema<T4>, a5: Schema<T5>, a6: Schema<T6>): UnionElement<T1 | T2 | T3 | T4 | T5 | T6>
export function union<T1, T2, T3, T4, T5, T6, T7>(options: Partial<Options>, a1: Schema<T1>, a2: Schema<T2>, a3: Schema<T3>, a4: Schema<T4>, a5: Schema<T5>, a6: Schema<T6>, a7: Schema<T7>): UnionElement<T1 | T2 | T3 | T4 | T5 | T6 | T7>
export function union<T1, T2, T3, T4, T5, T6, T7, T8>(options: Partial<Options>, a1: Schema<T1>, a2: Schema<T2>, a3: Schema<T3>, a4: Schema<T4>, a5: Schema<T5>, a6: Schema<T6>, a7: Schema<T7>, a8: Schema<T8>): UnionElement<T1 | T2 | T3 | T4 | T5 | T6 | T7 | T8>
export function union<T1, T2, T3, T4, T5, T6, T7, T8, T9>(options: Partial<Options>, a1: Schema<T1>, a2: Schema<T2>, a3: Schema<T3>, a4: Schema<T4>, a5: Schema<T5>, a6: Schema<T6>, a7: Schema<T7>, a8: Schema<T8>, a9: Schema<T9>): UnionElement<T1 | T2 | T3 | T4 | T5 | T6 | T7 | T8 | T9>
export function union(options: Partial<Options>, ...types: Schema<NonNullable<any>>[]) {
	return new UnionElement(types, options);
}

export class UnionElement<T> extends ElementBase<T> {
	constructor(
		public readonly types: Schema<NonNullable<any>>[],
		options: Partial<Options>
	) {
		super();
		this.options = Object.assign({}, defaultOptions, options);
	}

	readonly options: Options

	validateSource(path: Path, sources: Source[]): UnionResult<T> {
		for (let s of sources) {
			if (s.value != undefined) {
				for (let type of this.types) {
					try {
						return new UnionResult([s.name], this.options, type.validateSource(path, [s]))
					} catch {
					}
				}
			}
		}

		throw new ValidationError(`union: None matches`, {
			type: this,
			path: path,
		});
	}

	validateRaw(data: any, coercionRules?: CoercionRules): T {
		for (let type of this.types) {
			try {
				return type.validateRaw(data, coercionRules);
			} catch {
			}
		}

		throw new ValidationError(`union: None matches`);
	}

	toString() { return `Union: ${this.types.join(', ')}` }
}

export class UnionResult<T> implements Result<T> {
	constructor(
		public readonly sources: string[],
		public readonly options: Options,
		public readonly result: Result<T>,
	) {}

	get raw(): T { return this.result.raw }
	get redacted(): any { return this.options.redact ? undefined : this.result.redacted }
}