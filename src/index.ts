import { Hono } from 'hono';
import applyMiddleware from './middleware';
import csv from './routes/csv';
import ical from './routes/ical';
import official from './routes/official';
import table from './routes/table';

const app = new Hono();

applyMiddleware(app);

app.route('/official', official);
app.route('/csv', csv);
app.route('/ical', ical);
app.route('/table', table);

export default app;
