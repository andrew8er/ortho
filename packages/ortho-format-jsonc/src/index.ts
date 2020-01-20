import { Parser, FileTypeSupport } from '@andrew8er/ortho-core'
import { jsonc } from 'jsonc'

export const jsoncFileHandler: Parser = async (content) => {
	if (typeof content === 'string') {
		return jsonc.parse(content);
	} else {
		throw new Error('JSON parser needs an utf8 string');
	}
}

export const jsoncFileSupport: FileTypeSupport = {
	match: /\.json$/,
	encoding: 'utf8',
	parser: jsoncFileHandler,
}
