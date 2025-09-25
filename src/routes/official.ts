import { Hono } from 'hono';
import Schedule from '../model/Schedule';
import { zValidator } from '../util/validator';
import { schema, schemaWithUo } from '../validators';

const official = new Hono();

// Routes

official.get('/:year/:semester', zValidator('param', schema), (ctx) => {
	// Validate parameters
	const { year, semester } = ctx.req.valid('param');

	const schedule = new Schedule(year, semester);
	return ctx.redirect(schedule.url, 301);
});

// TODO: continue...
// official.get(
// 	'/:year/:semester/custom',
// 	zValidator('param', schema),
// 	zValidator('query', groupSchema),
// 	(ctx) => {
// 		// Validate parameters
// 		const { year, semester } = ctx.req.valid('param');
// 		const { group } = ctx.req.valid('query');

// 		const schedule = new Schedule(year, semester);
// 		const customUserSchedule = schedule.getCustomSchedule(group);

// 		return ctx.redirect(customUserSchedule.webUrl, 301);
// 	}
// );

official.get(
	'/:year/:semester/:uo',
	zValidator('param', schemaWithUo),
	async (ctx) => {
		// Validate parameters
		const { year, semester, uo } = ctx.req.valid('param');

		const schedule = new Schedule(year, semester);
		const userSchedule = (await schedule.fetchUserSchedules()).get(uo);

		if (!userSchedule) return ctx.notFound();
		return ctx.redirect(userSchedule.webUrl, 301);
	}
);

export default official;
