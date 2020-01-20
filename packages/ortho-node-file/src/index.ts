import { Source, toSource, FileTypeSupport } from '@andrew8er/ortho-core'
import { readFile, stat } from 'node:fs/promises'
import { dirname, join, resolve, sep } from 'node:path'

export async function read(path: string, encoding?: null): Promise<Buffer>
export async function read(path: string, encoding?: 'utf8'): Promise<string>
export async function read(path: string, encoding: 'utf8' | null = 'utf8'): Promise<string | Buffer> {
	return readFile(path, { encoding: encoding });
}

/**
 * Creates a {@link FileFinder} object with {@link FileTypeSupport} configuration objects.
 */
export const withFileTypes =
	(...fileTypes: FileTypeSupport[]) => new FileFinder(fileTypes)

class FileFinder {
	constructor(private fileTypes: FileTypeSupport[]) {}

	/**
	 * Find one file among the list of provided paths and return it as {@link Source} object.
	 * Paths will be tried in the given order. If no file was found, return `undefined`.
	 */
	async findOneOptional(paths: string[]): Promise<Source | undefined> {
		for (let path of paths) {
			const result = await this.tryWithFileTypes(path);

			if (result !== undefined) {
				return result;
			}
		}
	}

	/**
	 * Find one file among the list of provided paths and return it as {@link Source} object.
	 * Paths will be tried in the given order. If no file was found, throw an error.
	 */
	async findOneRequired(paths: string[]): Promise<Source> {
		const result = await this.findOneOptional(paths);

		if (result !== undefined) {
			return result;
		} else {
			throw new Error('Could not find a valid file'); // TODO error
		}
	}

	async findManyOptional(paths: string[]): Promise<Source[]> {
		const results: Source[] = [];

		for (let path of paths) {
			const result = await this.tryWithFileTypes(path);

			if (result !== undefined) {
				results.push(result);
			}
		}

		return results;
	}

	async findManyRequired(paths: string[]): Promise<Source[]> {
		const results = await this.findManyOptional(paths);

		if (results.length > 0) {
			return results;
		} else {
			throw new Error('Could not find any valid file');
		}
	}

	private async tryWithFileTypes(path: string): Promise<Source | undefined> {
		// try with all file types
		for (let {match, parser} of this.fileTypes) {
			if (match.test(path)) {
				try {
					return toSource(path, await parser(await read(path)));
				} catch (err) {
					if ((err as NodeJS.ErrnoException).code !== 'ENOENT') { // Ignore ENOENT errors
						throw err;
					}
				}
			}
		}

		// if none matched, examine if we even have a file, and if not, return undefined
		try {
			await stat(path);
		} catch (err) {
			if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
				return;
			} else {
				throw err;
			}
		}

		throw new Error(`Path "${path}" found, but no file type matched`);
	}
}

export function dirAndUpward(fromDirPath: string = process.cwd()): string[] {
	const pathElements = [];
	const start = resolve(fromDirPath)

	for (let e = start; e !== sep; e = dirname(e)) {
		pathElements.push(e)
	}

	return pathElements;
}

export function filesIn(fileNames: string | string[], directories: string[]): string[] {
	const filesArray = Array.isArray(fileNames)
		? fileNames
		: [ fileNames ];

	const paths = [];

	for (let d of directories) {
		for (let n of filesArray) {
			paths.push(join(d, n))
		}
	}

	return paths;
}
