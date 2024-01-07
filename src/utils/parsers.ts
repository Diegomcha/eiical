import HttpError from './HttpError';
import { User } from './types';
import { validateSemester, validateUser, validateYear } from './validators';

/**
 * Gets the year from the request
 * @param url Url from the request
 * @returns The year or response with an error if the year is invalid
 */
export function getYear(url: URL) {
	// Extract the parameters from the url
	const raw_params = url.pathname.split('/');

	// Validate the parameter
	if (!validateYear(raw_params[2])) throw new HttpError(400, 'Invalid year.\nThe year must have the format "YY-YY"');
	// Return the parameter

	return raw_params[2];
}

/**
 * Gets the semester from the request
 * @param url Url from the request
 * @returns The semester or response with an error if the semester is invalid
 */
export function getSemester(url: URL) {
	// Extract the parameters from the url
	const raw_params = url.pathname.split('/');

	// Lowercase the semester
	raw_params[3] = raw_params[3].toLowerCase();

	// Validate the parameter
	if (!validateSemester(raw_params[3])) throw new HttpError(400, 'Invalid semester.\nThe semester must be "s1" or "s2"');

	// Return the parameter
	return raw_params[3];
}

/**
 * Gets the user from the request
 * @param url Url from the request
 * @param allowEmpty If true, the user can be empty
 * @returns The user or response with an error if the user is invalid
 */
export function getUser<T = false>(url: URL, allowEmpty?: T): T extends true ? User | undefined : User {
	// Extract the parameters from the url
	const raw_params = url.pathname.split('/');

	// If the user is empty and it is allowed return undefined
	if (allowEmpty === true && (raw_params.length < 5 || raw_params[4].length === 0))
		return undefined as T extends true ? User | undefined : User;

	// Upercase the user
	raw_params[4] = raw_params[4].toUpperCase();

	// Validate the parameter
	if (!validateUser(raw_params[4])) throw new HttpError(400, 'Invalid user.\nThe user must have the format "UO" followed by a number');

	// Return the parameter
	return raw_params[4];
}

/**
 * Gets the alert if present from the request
 * @param url Url from the request
 * @returns The alert number if present or response with an error if the alert is invalid
 */
export function getAlert(url: URL) {
	// Gets the query
	let alert: string | number | null = url.searchParams.get('alert');

	// If there is no alert present return undefined
	if (alert == null) return;

	// Parse the alert
	alert = parseInt(alert);

	// Validates the query
	if (isNaN(alert)) throw new HttpError(400, 'Invalid alert.\nThe alert, if defined must be a positive number');

	// Return the alert
	return alert;
}
