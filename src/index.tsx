import { Hono } from 'hono';
import api from './api';
import Home from './pages/Home';

const app = new Hono();

// TODO: Add middleware for the main app if needed

app.route('/api', api);
app.get('/', (ctx) => ctx.html(<Home />));

export default app;
