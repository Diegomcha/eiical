import { Hono } from 'hono';
import applyMiddleware from './middleware';
import csv from './routes/csv';
import ical from './routes/ical';
import official from './routes/official';
import table from './routes/table';

const api = new Hono();

applyMiddleware(api);

api.route('/official', official);
api.route('/csv', csv);
api.route('/ical', ical);
api.route('/table', table);

export default api;
