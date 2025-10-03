import { Hono } from 'hono';
import Schedule from '../model/Schedule';
import { zValidator } from '../util/validator';
import {
	customQuerySchemaWithAlert,
	querySchemaWithAlert,
	schema,
	schemaWithUo,
} from '../validators';

const ical = new Hono();

// Routes

ical.get(
	'/:year/:semester/custom',
	zValidator('param', schema),
	zValidator('query', customQuerySchemaWithAlert),
	async (ctx) => {
		// Validate parameters
		const { year, semester } = ctx.req.valid('param');
		const { group: groups, alert: alerts } = ctx.req.valid('query');

		const schedule = new Schedule(year, semester);
		const customUserSchedule = schedule.getCustomSchedule(groups);

		// Transforming & sending calendar
		return ctx.body(
			(await customUserSchedule.fetchCalendar({ alerts: alerts }))
				.toIcal()
				.url(ctx.req.url)
				.toString(),
			{
				headers: {
					'Content-Type': 'text/calendar',
					'Content-Disposition': `attachment; filename="cal_${year.toString()}s${semester.toString()}_${groups.join('-')}.ics"`,
				},
			}
		);
	}
);

ical.get(
	'/:year/:semester/:uo',
	zValidator('param', schemaWithUo),
	zValidator('query', querySchemaWithAlert),
	async (ctx) => {
		// Validate parameters
		const { year, semester, uo } = ctx.req.valid('param');
		const {
			alert: alerts,
			addGroup: addGroups,
			ignoreGroup: ignoreGroups,
		} = ctx.req.valid('query');

		// Getting schedule
		const schedule = new Schedule(year, semester);
		const userSchedule = (await schedule.fetchUserSchedules()).get(uo);
		if (userSchedule == null) return ctx.notFound();

		// Modifying groups
		if (addGroups != null) userSchedule.addGroups(addGroups);
		if (ignoreGroups != null) userSchedule.ignoreGroups(ignoreGroups);

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
