import { BASE_URL } from './constants';
import { Data, List } from './types';

export function getData(url: URL): Data {
	const raw_params = url.pathname.split('/');
	return {
		url: url,
		year: raw_params[2] as `${number}-${number}`,
		semester: raw_params[3] as `s${number}`,
		user: raw_params[4] as `UO${number}`,
	};
}

export async function getList(data: Omit<Data, 'user'>): Promise<List | number> {
	// Builds the global calendar url
	const url = `${BASE_URL}?y=${data.year}&t=${data.semester}`;

	// Gets list
	const res = await fetch(url);
	const text = await res.text();

	// List is unavailable
	if (text === 'Error: No se puede leer la planificaciÃ³n indicada') return 503;
	// Return parsed list
	return Object.fromEntries(text.match(/(?<=<td> <a href=").+?UO\d+(?=<\/a>)/g)?.map((raw) => raw.split(/">/).reverse()) ?? []) as List;
}
