import { Hono } from 'hono';
import {
	createCustomScheduleHandler,
	createUserScheduleHandler,
} from '../handlers';

const table = new Hono();

// Routes

table.get(
	'/:year/:semester/custom',
	...createCustomScheduleHandler(
		(customUserSchedule) => customUserSchedule.tableUrl
	)
);

table.get(
	'/:year/:semester/:uo',
	...createUserScheduleHandler((userSchedule) => userSchedule.tableUrl)
);

export default table;
