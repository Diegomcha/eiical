import { z } from 'zod';
import { Group, UO } from './types';

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

// Query validators

export const querySchema = z.object({
	alert: z
		.union([z.coerce.number().min(0), z.array(z.coerce.number().min(0))])
		.optional()
		.transform((val) => (val == null || Array.isArray(val) ? val : [val])),
	addGroup: z
		.union([
			z.string().regex(/^[^.]+\.[^.]+\.\d+$/),
			z.array(z.string().regex(/^[^.]+\.[^.]+\.\d+$/)),
		])
		.optional()
		.transform((val) => (Array.isArray(val) ? val : [val]))
		.transform((val) => val.map((g) => g as Group)),
	ignoreGroup: z
		.union([
			z.string().regex(/^[^.]+\.[^.]+\.\d+$/),
			z.array(z.string().regex(/^[^.]+\.[^.]+\.\d+$/)),
		])
		.optional()
		.transform((val) => (Array.isArray(val) ? val : [val]))
		.transform((val) => val.map((g) => g as Group)),
});
