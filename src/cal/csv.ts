import { Data, Env } from '../utils/types';
import { getList } from '../utils';
import { invalidPeriod, userNotFound } from '../utils/errors';

export default async function calCsv(data: Data, env: Env) {
	// Fetch list
	const list = await getList(data, env);
	if (typeof list === 'number') return invalidPeriod(list);

	// Get user url
	const userUrl = list[data.user];
	if (!userUrl) return userNotFound();

	// Redirect
	return Response.redirect(userUrl.slice(0, -3) + 'csv');
}
