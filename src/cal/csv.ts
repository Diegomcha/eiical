import { Data } from '../utils/types';
import { getList } from '../utils';

export default async function calCsv(data: Data) {
	// Fetch list
	const list = await getList(data);
	if (typeof list === 'number') return new Response(null, { status: list });

	// Get user url
	const userUrl = list[data.user];
	if (!userUrl) new Response(null, { status: 404 });

	// Redirect
	return Response.redirect(userUrl.slice(0, -3) + 'csv');
}
