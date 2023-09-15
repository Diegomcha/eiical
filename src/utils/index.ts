import { BASE_URL } from './constants';
import { Data, Env, List } from './types';

export function getData(url: URL): Data {
	const raw_params = url.pathname.split('/');
	return {
		url: url,
		year: raw_params[2] as `${number}-${number}`,
		semester: raw_params[3] as `s${number}`,
		user: raw_params[4] as `UO${number}`,
	};
}

export async function getList(data: Omit<Data, 'user'>, env: Env): Promise<List | number> {
	// Fetch list from cache
	const rawList = await env.eiical.get(`list_${data.year}_${data.semester}`);
	const list = !rawList ? await updateList(data, env) : (JSON.parse(rawList) as List);

	// Return list
	return list;
}

export default async function updateList(data: Omit<Data, 'user'>, env: Env): Promise<List | number> {
	// Builds the global calendar url
	const url = `${BASE_URL}?y=${data.year}&t=${data.semester}`;

	// Gets list
	const res = await fetch(url);
	const text = await res.text();

	// List is unavailable
	if (text === 'Error: No se puede leer la planificaciÃ³n indicada') return 503;

	// Parse list
	const list = Object.fromEntries(
		text.match(/(?<=<td> <a href=").+?UO\d+(?=<\/a>)/g)?.map((raw) => raw.split(/">/).reverse()) ?? [],
	) as List;

	// Save to the KV
	await env.eiical.put(`list_${data.year}_${data.semester}`, JSON.stringify(list), { expirationTtl: 604800 }); // Expires in 7 weeks

	// Return list
	return list;
}
