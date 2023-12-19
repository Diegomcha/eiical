import HttpError from './HttpError';
import { BASE_URL } from './constants';
import { Env, List, Semester, Year } from './types';

/**
 * Gets a list containing the url for the schedule of each user
 * @param year Year to get the list of
 * @param semester Semester to get the list of
 * @param env Environment variables
 * @returns A list containing the url for the schedule of each user
 */
export async function getList(year: Year, semester: Semester, env: Env): Promise<List> {
	// Fetch list from cache if possible
	const rawList = await env.eiical.get(`list_${year}_${semester}`);
	const list = !rawList ? await updateList(year, semester, env) : (JSON.parse(rawList) as List);

	// Return list
	return list;
}

/**
 * Gets the official url to the list of schedules
 * @param year Year to get the list of
 * @param semester Semester to get the list of
 * @returns The url to the list of schedules
 */
export function getListUrl(year: Year, semester: Semester): string {
	return `${BASE_URL}?y=${year}&t=${semester}`;
}

/**
 * Updates the list which contains the schedule url for each user
 * @param year Year to get the list of
 * @param semester Semester to get the list of
 * @param env Environment variables
 * @returns A list containing the url for the schedule of each user
 */
async function updateList(year: Year, semester: Semester, env: Env): Promise<List> {
	// Builds the global calendar url
	const url = getListUrl(year, semester);

	// Gets list
	const res = await fetch(url);
	const text = await res.text();

	// List is unavailable
	if (text.includes('Error: No se puede leer')) throw new HttpError(503, 'The schedule is not available yet');

	// Parse list
	const list = Object.fromEntries(
		text.match(/(?<=<td> <a href=").+?UO\d+(?=<\/a>)/g)?.map((raw) => raw.split(/">/).reverse()) ?? [],
	) as List;

	// Save to the KV
	await env.eiical.put(`list_${year}_${semester}`, JSON.stringify(list), { expirationTtl: 604800 }); // Expires in 7 days

	// Return list
	return list;
}
