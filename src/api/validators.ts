import { z } from 'zod';
import { Group, UO } from '../types';

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

// Query parameter validators

const groupSchema = z
	.union([
		z.string().regex(/^[^.]+\.[^.]+\.(I-)?\d+$/),
		z.array(z.string().regex(/^[^.]+\.[^.]+\.(I-)?\d+$/)),
	])
	.optional()
	.transform((val) => (val == null || Array.isArray(val) ? val : [val])) // ensure array or undefined
	.transform((val) => val?.map((g) => g as Group)); // cast to Group

const alertSchema = z
	.union([z.coerce.number().min(0), z.array(z.coerce.number().min(0))])
	.optional()
	.transform((val) => (val == null || Array.isArray(val) ? val : [val]));

// Query validators

export const querySchema = z.object({
	addGroup: groupSchema,
	ignoreGroup: groupSchema,
});

export const querySchemaWithAlert = querySchema.extend({
	alert: alertSchema,
});

export const customQuerySchema = z.object({
	group: groupSchema.nonoptional(),
});

export const customQuerySchemaWithAlert = customQuerySchema.extend({
	alert: alertSchema,
});
