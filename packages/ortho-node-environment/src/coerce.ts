export function coerceStringToNumber(value: unknown): number | undefined {
	if (typeof value === 'string') {
		return Number.parseFloat(value)
	}
}

export function coerceStringToBoolean(value: any): boolean | undefined {
	if (typeof value === 'string') {
		if (value.toLowerCase().startsWith('true') || value.startsWith('1'))
			return true;
		else if (value.toLowerCase().startsWith('false') || value.startsWith('0'))
			return false;
	}
}

export const coerceStringToArray = (delimiter: string) => (value: any) => {
	// if ()
}