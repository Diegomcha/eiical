import { Hono } from 'hono';
import Schedule from '../model/Schedule';
import {
	createCustomScheduleHandler,
	createUserScheduleHandler,
} from '../util/handlers';
import { zValidator } from '../util/validator';
import { schema } from '../validators';

const official = new Hono();

// Routes

official.get('/:year/:semester', zValidator('param', schema), (ctx) => {
	// Validate parameters
	const { year, semester } = ctx.req.valid('param');

	const schedule = new Schedule(year, semester);
	return ctx.redirect(schedule.url, 301);
});

official.get(
	'/:year/:semester/custom',
	...createCustomScheduleHandler(
		(customUserSchedule) => customUserSchedule.webUrl
	)
);

official.get(
	'/:year/:semester/:uo',
	...createUserScheduleHandler((userSchedule) => userSchedule.webUrl)
);

export default official;
