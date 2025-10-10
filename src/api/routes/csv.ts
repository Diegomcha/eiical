import { Hono } from 'hono';
import {
	createCustomScheduleHandler,
	createUserScheduleHandler,
} from '../handlers';

const csv = new Hono();

// Routes

csv.get(
	'/:year/:semester/custom',
	...createCustomScheduleHandler(
		(customUserSchedule) => customUserSchedule.csvUrl
	)
);

csv.get(
	'/:year/:semester/:uo',
	...createUserScheduleHandler((userSchedule) => userSchedule.csvUrl)
);

export default csv;
