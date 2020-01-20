import {
	SchemaType,
	object, union, string, number, boolean, array,
	stringLiteral, ValidationError, toSource
} from '@andrew8er/ortho-core'

const subSchema = object({
	t1: string(),
	t2: number().optional(),
	// c: typeof subSchema,
})

const recSub = union({},
	number(),
	array(string()).optional(),
	string(),
);

type Rec = SchemaType<typeof recSub>

const schema = object({
	environment: union({ info: 'Environment this service is running in' },
		stringLiteral('staging'),
		stringLiteral('production'),
	),
	logging: object({
		level: union({ info: 'Log level', redact: true },
			stringLiteral('debug'),
			stringLiteral('info'),
			stringLiteral('warn'),
			stringLiteral('error'),
		)
	}),
	settings: object({
		token_key: string({
			info: 'Signing key for auth tokens',
			redact: true,
		}),
		signing_parameters: object({
			keylen: number({ info: 'Key length for signing' }),
			cost: number({ info: 'Cost factor' }),
		}),
	}),
});

const data: SchemaType<typeof schema> = {
	environment: 'production',
	logging: {
		level: 'info',
	},
	settings: {
		token_key: 'dlk3E%gdf0ds"F_S;pe',
		signing_parameters: {
			keylen: 512,
			cost: 12,
		}
	}
}
