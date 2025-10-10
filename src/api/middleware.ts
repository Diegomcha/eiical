import { Hono } from 'hono';
import { cache } from 'hono/cache';
import { secureHeaders } from 'hono/secure-headers';
import { timing } from 'hono/timing';
import { namespace } from '../../config.json';

export default function applyMiddleware(app: Hono) {
	app.use(
		secureHeaders(),
		cache({
			cacheName: namespace,
			// Default 1 day of cache
			cacheControl: 'public, max-age=86400',
		}),
		timing()
	);
}
