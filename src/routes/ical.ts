import { Hono } from 'hono';
import Schedule from '../model/Schedule';
import { zValidator } from '../util/validator';
import { querySchema, schemaWithUo } from '../validators';

const ical = new Hono();

// Routes

ical.get(
	'/:year/:semester/:uo',
	zValidator('param', schemaWithUo),
	zValidator('query', querySchema),
	async (ctx) => {
		// Validate parameters
		const { year, semester, uo } = ctx.req.valid('param');
		const {
			alert: alerts,
			addGroup: addGroups,
			ignoreGroup: ignoreGroups,
		} = ctx.req.valid('query');

		const schedule = new Schedule(year, semester);
		const userSchedule = (await schedule.fetchUserSchedules()).get(uo);

		if (!userSchedule) return ctx.notFound();

		// Modifying groups
		userSchedule.addGroups(addGroups);
		userSchedule.ignoreGroups(ignoreGroups);

		// Transforming & sending calendar
		return ctx.body(
			(await userSchedule.fetchCalendar({ alerts: alerts }))
				.toIcal()
				.url(ctx.req.url)
				.toString(),
			{
				headers: {
					'Content-Type': 'text/calendar',
					'Content-Disposition': `attachment; filename="cal_${year.toString()}s${semester.toString()}_${uo}.ics"`,
				},
			}
		);
	}
);

export default ical;
