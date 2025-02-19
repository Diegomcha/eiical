import { Hono } from 'hono';
import Schedule from '../api/Schedule';
import { zValidator } from '../util/validator';
import { schemaWithUo } from '../validators';

const csv = new Hono();

// Routes

csv.get(
	'/:year/:semester/:uo',
	zValidator('param', schemaWithUo),
	async (ctx) => {
		// Validate parameters
		const { year, semester, uo } = ctx.req.valid('param');

		const schedule = new Schedule(year, semester);
		const userSchedule = (await schedule.fetchUserSchedules()).get(uo);

		if (!userSchedule) return ctx.notFound();
		return ctx.redirect(userSchedule.tableUrl, 301);
	}
);

export default csv;
