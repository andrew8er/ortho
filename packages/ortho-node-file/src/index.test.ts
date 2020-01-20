import { test, expect, beforeEach } from 'vitest'
import { toSource, FileTypeSupport } from '@andrew8er/ortho-core'
import { filesIn, withFileTypes } from './index.js'

const readTxt: FileTypeSupport = {
	match: /\.txt$/,
	encoding: 'utf8',
	parser: (c) => c,
}

test('find*() throws if file exists, but no extension matched', async () => {
	await expect(
		withFileTypes({
			match: /\.foo$/,
			encoding: 'utf8',
			parser: (f) => f,
		}).findOneOptional([
			'./test/text_1.txt',
		])
	).rejects.toThrow();
});

test('find*() throws if path exists, but is not a file', async () => {
	await expect(
		withFileTypes(readTxt).findOneOptional([
			'./test/dir',
		])
	).rejects.toThrow();
});

test('findOneOptional() finds file', async () => {
	await expect(
		withFileTypes(readTxt).findOneOptional([
			'./test/text_1.txt',
		])
	).resolves.toStrictEqual(
		toSource('./test/text_1.txt', 'text_1')
	);
});

test('findOneOptional() returns undefined if not found', async () => {
	await expect(
		withFileTypes(readTxt).findOneOptional([
			'./test/does_not_exist.txt',
		])
	).resolves.toBeUndefined()
});

test('findOneRequired() finds file', async () => {
	await expect(
		withFileTypes(readTxt).findOneRequired([
			'./test/text_1.txt',
		])
	).resolves.toStrictEqual(
		toSource('./test/text_1.txt', 'text_1')
	);
});

test('findOneRequired() throws if not found', async () => {
	await expect(
		withFileTypes(readTxt).findOneRequired([
			'./test/does_not_exist.txt',
		])
	).rejects.toThrow();
});

test('findManyOptional() finds multiples files', async () => {
	await expect(
		withFileTypes(readTxt).findManyOptional([
			'./test/text_1.txt',
			'./test/text_2.txt',
		])
	).resolves.toStrictEqual([
		toSource('./test/text_1.txt', 'text_1'),
		toSource('./test/text_2.txt', 'text_2')
	]);
});

test('findManyOptional() returns empty array if none found', async () => {
	await expect(
		withFileTypes(readTxt).findManyOptional([
			'./test/does_not_exist.txt',
		])
	).resolves.toStrictEqual([]);
});

test('findManyRequired() finds multiples files', async () => {
	await expect(
		withFileTypes(readTxt).findManyRequired([
			'./test/text_1.txt',
			'./test/text_2.txt',
		])
	).resolves.toStrictEqual([
		toSource('./test/text_1.txt', 'text_1'),
		toSource('./test/text_2.txt', 'text_2')
	]);
});

test('findManyRequired() throws if none found', async () => {
	await expect(
		withFileTypes(readTxt).findManyRequired([
			'./test/does_not_exist.txt',
		])
	).rejects.toThrow();
});

test('findManyRequired', async () => {
	const fileTypes = withFileTypes(readTxt);

	await expect(
		fileTypes.findManyRequired(
			filesIn('./test/does_not_exist.txt', [])
		)
	).rejects.toThrow();
});
