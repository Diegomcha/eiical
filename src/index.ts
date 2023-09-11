import cal from './cal';
import calCsv from './cal/csv';
import calIcal from './cal/ical';
import { getData } from './utils';

export default {
	async fetch(req: Request): Promise<Response> {
		try {
			const data = getData(new URL(req.url));

			// Home
			if (data.url.pathname === '/') return new Response('Home'); //TODO: Explain the routes of the api

			// Calendar routes
			if (/^\/cal\/\d\d-\d\d\/s\d\/UO\d+\/?(ical|csv)?\/?$/gi.test(data.url.pathname)) {
				// Ical route
				if (data.url.pathname.includes('ical')) return calIcal(data);
				// Csv route
				if (data.url.pathname.includes('csv')) return calCsv(data);
				// Index route
				return cal(data);
			}

			// Route not found
			return new Response('Not found', { status: 404 });
		} catch (err) {
			// Default error handler
			//TODO: Improve
			console.error(err);
			return new Response('Internal Server Error', { status: 500 });
		}
	},
};
