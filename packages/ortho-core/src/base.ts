import { DefaultModifier } from './modifiers/default.js'
import { OptionalModifier } from './modifiers/optional.js'
import { Schema, Options, Result, Source, CoercionRules, Path } from './types.js'

export abstract class ElementBase<T> implements Schema<T> {
	/** Make an element optional. */
	optional(): Schema<T | undefined> { return new OptionalModifier(this) }

	/** Make an element optional, but use a default value, so the result is always defined. */
	default(defaultValue: NonNullable<T>): DefaultModifier<T> { return new DefaultModifier(this, defaultValue) }

	/**
	 * Validate a list of sources against this schema. Sources are listed from highest to lowest priority.
	 */
	validateSources(...sources: Source[]): Result<T> { return this.validateSource([], sources) }

	abstract readonly options: Options;

	/**
	 * Validate a list of sources against this schema. Sources are listed from highest to lowest priority.
	 * This is an internal method, use {@link ElementBase.validateSources} instead.
	 *
	 * @internal
	 */
	abstract validateSource(path: Path, sources: Source[]): Result<T>;

	/**
	 * Validate any data object against this schema.
	 */
	abstract validateRaw(data: any, coercionRules?: CoercionRules): T;
}

/** Meta data for {@link ValidationError}. */
export interface ValidationErrorMeta {
	path: Path;
	source?: Source;
	type: Schema<any>;
}

/** A validation exception class. */
export class ValidationError extends Error {
	constructor(
		message: string,
		public meta?: ValidationErrorMeta,
	) {
		super(message);
	}
}

export const defaultOptions: Options = {
	doc: '',
	info: '',
	redact: false,
}
