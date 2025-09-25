import { zValidator as zv } from '@hono/zod-validator';
import { ValidationTargets } from 'hono';
import { flattenError, ZodType } from 'zod';

export const zValidator = <T extends ZodType>(
	target: keyof ValidationTargets,
	schema: T
) =>
	zv(target, schema, (r, c) => {
		if (!r.success) return c.json(flattenError(r.error).fieldErrors, 400);
	});
