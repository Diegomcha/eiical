import { Hono } from 'hono';
import Schedule from '../api/Schedule';
import { zValidator } from '../util/validator';
import { schema, schemaWithUo } from '../validators';

const official = new Hono();

// Routes

official.get('/:year/:semester', zValidator('param', schema), async (ctx) => {
	// Validate parameters
	const { year, semester } = ctx.req.valid('param');

	const schedule = new Schedule(year, semester);
	return ctx.redirect(schedule.url, 301);
});

official.get(
	'/:year/:semester/:uo',
	zValidator('param', schemaWithUo),
	async (ctx) => {
		// Validate parameters
		const { year, semester, uo } = ctx.req.valid('param');

		const schedule = new Schedule(year, semester);
		const userSchedule = (await schedule.fetchUserSchedules()).get(uo);

		if (!userSchedule) return ctx.notFound();
		return ctx.redirect(userSchedule.url, 301);
	}
);

export default official;
