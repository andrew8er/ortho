/** A path describes a location within an arbitrary data structure */
export type Path = Array<string|number>;

/**
 * A schema defines the desired structure and provides methods to validate any
 * data against this structure. The result is a valid return type if the given
 * data conforms to the schema, otherwise an exception will be thrown.
 */
export interface Schema<T> {
	/** Validates data sources against this schema and returns a result wrapper on success. */
	validateSource(path: Path, sources: Source[]): Result<T>;

	/** Validates raw data against this schema and returns raw result data on success. */
	validateRaw(data: any, coercionRules?: CoercionRules): T;
}

export type SchemaType<T extends Schema<any>> = ReturnType<T['validateRaw']>;

/**
 * Meta data and options for all schema elements.
 */
export interface Options {
	/** A short description string for this schema element. */
	info: string;
	/** A longer description string for this schema element. */
	doc: string;
	/** This schema element contains sensitive data and should be redacted. */
	redact: boolean;
}

/**
 * A collection of optional coercion functions, useful for data sources that have a limited set
 * of value data types, such as environment variables, which can only contain string values. If
 * a schema type demands a data type other than the data source's actual type, the appropriate
 * coercion function is used to convert the data to this type.
 */
export interface CoercionRules {
	coerceToString?: (v: any) => string | undefined;
	coerceToNumber?: (c: any) => number | undefined;
	coerceToBoolean?: (v: any) => boolean | undefined;
	coerceToArray?: (v: any) => any[] | undefined;
}

/**
 * A Source is a wrapper object around an arbitrary data structure (available in the {@link value}
 * property) and some meta data for validating with {@link Schema.validateSources}.
 */
export interface Source {
	name: string;
	value: any;
	coerce: CoercionRules;
}

type DeepPartial<T> = T extends object
	? { [P in keyof T]?: DeepPartial<T[P]> }
	: T;

/**
 * A Result is a wrapper around a successfully validated data structure returned by
 * {@link Schema.validateSources}.
 */
export interface Result<T> {
	readonly sources: string[];

	/** The {@link Options} used for this schema element. */
	readonly options: Readonly<Options>;

	/**
	 * Raw value of the result.
	 *
	 * @remarks
	 *
	 * This value contains all elements marked as `redact` intact, for writing data to console or logs,
	 * consider using {@link redacted} instead.
	 */
	readonly raw: T;

	/** Raw value of the result, but all elements marked as `redact` replaced with `undefined`. */
	readonly redacted: DeepPartial<T> | undefined;
}

/** A parser function takes a string or Buffer and converts it to a data structure */
export type Parser = (content: string | Buffer) => any

export interface FileTypeSupport {
	match: RegExp;
	encoding: 'utf8' | null;
	parser: Parser;
}