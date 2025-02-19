import { Hono } from 'hono';
import Schedule from '../api/Schedule';
import Calendar from '../model/Calendar';
import { CsvInput, ICalTransformer } from '../parsers/CsvParser';
import { zValidator } from '../util/validator';
import { schemaWithUo } from '../validators';

const ical = new Hono();

// Routes

ical.get(
	'/:year/:semester/:uo',
	zValidator('param', schemaWithUo),
	async (ctx) => {
		// Validate parameters
		const { year, semester, uo } = ctx.req.valid('param');

		const schedule = new Schedule(year, semester);
		const userSchedule = (await schedule.fetchUserSchedules()).get(uo);

		if (!userSchedule) return ctx.notFound();
		const csv = await userSchedule.fetchCsv();

		// Transforming calendar
		const events = new CsvInput().process(csv);
		const cal = new Calendar(
			`[${schedule.year.join('-')}|${semester}] Calendario EII de ${uo}`,
			'Europe/Madrid',
			events
		);

		const ical = new ICalTransformer().process(cal);
		return ctx.text(ical, {
			headers: {
				'Content-Type': 'text/calendar',
				'Content-Disposition': 'attachment; filename="cal.ics"',
			},
		});
	}
);

export default ical;
