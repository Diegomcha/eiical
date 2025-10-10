import { createFactory } from 'hono/factory';
import Schedule, { UserSchedule } from '../model/Schedule';
import { zValidator } from '../util/validator';
import {
	customQuerySchema,
	querySchema,
	schema,
	schemaWithUo,
} from './validators';

const factory = createFactory();

export const createUserScheduleHandler = (
	getRedirectUrl: (userSchedule: UserSchedule) => string
) =>
	factory.createHandlers(
		zValidator('param', schemaWithUo),
		zValidator('query', querySchema),
		async (ctx) => {
			// Validate parameters
			const { year, semester, uo } = ctx.req.valid('param');
			const { addGroup: addGroups, ignoreGroup: ignoreGroups } =
				ctx.req.valid('query');

			// Getting schedule
			const schedule = new Schedule(year, semester);
			const userSchedule = (await schedule.fetchUserSchedules()).get(uo);
			if (userSchedule == null) return ctx.notFound();

			// Modifying groups
			if (addGroups != null) userSchedule.addGroups(addGroups);
			if (ignoreGroups != null) userSchedule.ignoreGroups(ignoreGroups);

			return ctx.redirect(getRedirectUrl(userSchedule), 301);
		}
	);

export const createCustomScheduleHandler = (
	getRedirectUrl: (customUserSchedule: UserSchedule) => string
) =>
	factory.createHandlers(
		zValidator('param', schema),
		zValidator('query', customQuerySchema),
		(ctx) => {
			// Validate parameters
			const { year, semester } = ctx.req.valid('param');
			const { group: groups } = ctx.req.valid('query');

			const schedule = new Schedule(year, semester);
			const customUserSchedule = schedule.getCustomSchedule(groups);

			return ctx.redirect(getRedirectUrl(customUserSchedule), 301);
		}
	);
