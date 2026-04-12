import { Hono } from 'hono';
import { rateLimiter } from 'hono-rate-limiter';
import { cache } from 'hono/cache';
import { secureHeaders } from 'hono/secure-headers';
import { timing } from 'hono/timing';
import { namespace } from '../config.json';

export default function applyMiddleware(app: Hono) {
	app.use(
		rateLimiter<{ Bindings: Env }>({
			binding: (c) => c.env.EIICAL_RATELIMITER,
			keyGenerator: (c) => c.req.header('CF-Connecting-IP') ?? '',
		}),
		secureHeaders(),
		cache({
			cacheName: namespace,
			// Default 1 day of cache
			cacheControl: 'public, max-age=86400',
		}),
		timing()
	);
}
