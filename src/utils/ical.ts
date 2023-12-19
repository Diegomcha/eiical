import { v5 as uuid } from 'uuid';
import dayjs from 'dayjs';
import customFormat from 'dayjs/plugin/customParseFormat';
import utc from 'dayjs/plugin/utc';
import { Alert, Semester, User, Year } from './types';
import { NAMESPACE } from './constants';

dayjs.extend(customFormat);
dayjs.extend(utc);

function computeUuid(title: string, startDate: string): string {
	return uuid(title + startDate, NAMESPACE);
}

function parseCsv(str: string): string[][] {
	return str
		.split('\n')
		.slice(2, -1)
		.map((event) => event.split(',').map((field) => field.trim()));
}

function parseEvent(raw: string[], alert?: Alert): string {
	const start = dayjs(`${raw[1]} ${raw[2]}`, 'DD/MM/YYYY H.mm').format('YYYYMMDD[T]HHmmss');
	const end = dayjs(`${raw[3]} ${raw[4]}`, 'DD/MM/YYYY H.mm').format('YYYYMMDD[T]HHmmss');

	return [
		'BEGIN:VEVENT',
		`UID:${computeUuid(raw[0], start)}`,
		`SUMMARY:${raw[0]}`,
		`DESCRIPTION:${raw[5]}`,
		`LOCATION:${raw[6]}`,
		`DTSTAMP:${dayjs().format('YYYYMMDD[T]HHmmss')}`,
		`DTSTART:${start}`,
		`DTEND:${end}`,
		...(alert != null ? ['BEGIN:VALARM', `TRIGGER:-PT${alert}M`, 'ACTION:DISPLAY', `DESCRIPTION:${raw[0]}`, 'END:VALARM'] : []),
		'END:VEVENT',
	].join('\r\n');
}

function parseEvents(raw: string[][], alert?: Alert) {
	return raw.map((rawEvent) => parseEvent(rawEvent, alert)).join('\r\n');
}

export function generateIcalString(year: Year, semester: Semester, user: User, csvData: string, alert?: Alert): string {
	const events = parseEvents(parseCsv(csvData), alert);
	return [
		'BEGIN:VCALENDAR',
		'VERSION:2.0',
		'PRODID:-//EII-CAL//eii-cal//EN',
		`NAME:[${year}|${semester}] Calendario EII de ${user}`,
		`X-WR-CALNAME:[${year}|${semester}] Calendario EII de ${user}`,
		'TIMEZONE-ID:Europe/Madrid',
		'X-WR-TIMEZONE:Europe/Madrid',
		events,
		'END:VCALENDAR',
	].join('\r\n');
}
