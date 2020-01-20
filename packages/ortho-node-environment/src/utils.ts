export function merge<T1, T2>(t: T1, s1: T2): T1 & T2
export function merge<T1, T2, T3>(t: T1, s1: T2, s2: T3): T1 & T2 & T3
export function merge(target: any, ...sources: any[]): any {
	return sources.reduce((acc, current) => mergeObject(acc, current), target);
}

export function mergeObject<T1 extends object, T2 extends object>(target: T1, source: T2): T1 & T2 {
	for (let key of Object.keys(source)) {
		const targetProperty = (target as any)[key];
		const sourceProperty = (source as any)[key];

		if (typeof sourceProperty === 'object') {
			if (typeof targetProperty === 'object') {
				const merged = {}
				// merge both into target
				mergeObject(merged, targetProperty);
				mergeObject(merged, sourceProperty);

				(target as any)[key] = merged;
			}
			else {
				// overwrite source property
				(target as any)[key] = mergeObject({}, sourceProperty);
			}
		}
		else {
			// source is primitive
			(target as any)[key] = sourceProperty;
		}
	}
	return target as T1 & T2;
}
