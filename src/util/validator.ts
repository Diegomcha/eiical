import { zValidator as zv } from '@hono/zod-validator';
import { ValidationTargets } from 'hono';
import { ZodSchema } from 'zod';

export const zValidator = <
	T extends ZodSchema,
	Target extends keyof ValidationTargets,
>(
	target: Target,
	schema: T
) =>
	zv(target, schema, (r, c) => {
		if (!r.success) return c.json(r.error.flatten().fieldErrors, 400);
	});
