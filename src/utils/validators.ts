import { Semester, User, Year } from './types';

/**
 * Validates a year string
 * @param year Year string to validate
 * @returns True if the year string is valid
 */
export function validateYear(year: string): year is Year {
	const regex = /^\d{2}-\d{2}$/;
	return regex.test(year);
}

/**
 * Validates a semester string
 * @param semester Semester string to validate
 * @returns True if the semester string is valid
 */
export function validateSemester(semester: string): semester is Semester {
	return semester === 's1' || semester === 's2';
}

/**
 * Validates a user string
 * @param user User string to validate
 * @returns True if the user string is valid
 */
export function validateUser(user: string): user is User {
	const regex = /^UO\d+$/;
	return regex.test(user);
}
