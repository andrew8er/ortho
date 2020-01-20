# ortho

`ortho` is a library for validating data structures, especially suited (but not limited) to configuration data.

> Note: data structure here is any combination of JavaScript core data types, such as strings, numbers, booleans, arrays and objects.

It can merge multiple data sources and validate them against a _schema_. Schemas can optionally define documentation data, default values and mark elements as sensitive, so they will get redacted in debug logs.

It has full TypeScript integration, meaning that the schema's data type can be fully inferred from the definition. A successful validation guarantees that the result conforms to the schema's data type.

`ortho` has two modes of operation:

##### Fast path
`Schema.validateRaw()` validates one raw data structure against a given schema. Omits detailed error reporting. Useful for validating incoming data for services with as little overhead as possible.

##### Detailed
`Schema.validateSources()` validates one or more data sources wrapped in `Source` objects. This mode merges data sources according to their priority and enables detailed error reporting in case the merged result does not confirm to the schema. Returns validated data as `Result<Schema>` types, which includes meta data on the sources that contributed to each element and `raw` and `redacted` views on the result data. Useful for validating configuration data.

### Other features:

- Explicit: no default paths, file names, format support. Load only files where you expect them to be, in the order you specified, in those formats you need.
- Modular: functionality is split into several packages, install only those you really need.
- Minimal: this project uses only a few, well maintained dependencies.

### Example:
```js
import { object, union, string, stringLiteral, number } from '@andrew8er/ortho-core'

// define a schema

const schema = object({
    environment: union({ info: 'Environment this service is running in' },
        stringLiteral('staging'),
        stringLiteral('production'),
    ),
    logging: object({
        level: union({ info: 'Log level' },
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

type Schema = typeof schema;

type Schema = {

}


// validate against multiple data sources

function start(ortho: TypeOfSchema<schema>): void {
    //
}

try {
    const result = schema.validate(environment, configFile);

    // use the raw result to get a plain object, types are inferred
    start(result.raw);

    // log a redacted version, omitting sensitive values
    console.log(result.redacted);
} catch (error) {
    if (error is ValidationError) {
        // handle error here
    }
}

```
