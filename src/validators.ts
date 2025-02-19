import { z } from 'zod';
import { UO } from './types';

export const schema = z.object({
	year: z
		.string()
		.regex(/^(20)?\d\d$/, 'Year must be a valid year')
		.transform((v) => parseInt(v)),
	semester: z
		.string()
		.regex(/^[12]$/, 'Semester must be 1 or 2')
		.transform((v) => parseInt(v) as 1 | 2),
});

export const schemaWithUo = schema.extend({
	uo: z
		.string()
		.regex(/^UO\d+/i, 'UO must be a valid UO identifier')
		.transform((v) => v.toUpperCase() as UO),
});
