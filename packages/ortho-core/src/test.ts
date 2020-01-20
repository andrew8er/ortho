import { SchemaType, number, object, union, string, stringLiteral, boolean } from 'index';

const subSchema = object({
	t1: string(),
})

const recSub = union({},
	number(),
	// array(string())
	string(),
	boolean()
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
			keylen: number({ info: 'Key length for signing' }).default(254),
			cost: number({ info: 'Cost factor' }).default(4096),
		}),
	}).default({ token_key: '3', signing_parameters: { keylen: 12, cost: 3} }),
});

type Schema = SchemaType<typeof schema>

let d: Schema = {
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
