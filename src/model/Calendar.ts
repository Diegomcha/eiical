import dayjs from 'dayjs';
import customFormat from 'dayjs/plugin/customParseFormat';
import ical, {
	ICalAlarmType,
	ICalEventBusyStatus,
	ICalEventStatus,
	ICalEventTransparency,
} from 'ical-generator';
import CalEvent from './CalEvent';

// Extend dayjs with plugins
dayjs.extend(customFormat);

export interface CalendarOpts {
	alerts?: number[];
}

export default class Calendar {
	readonly name: string;
	readonly description: string;
	readonly timezone: string;
	readonly events: CalEvent[];

	readonly source: string | undefined;
	readonly opts: CalendarOpts | undefined;

	private constructor(
		name: string,
		description: string,
		timezone: string,
		events: CalEvent[],
		source?: string,
		opts?: CalendarOpts
	) {
		this.name = name;
		this.description = description;
		this.source = source;
		this.timezone = timezone;
		this.events = events;

		this.opts = opts;
	}

	static fromCsv(
		name: string,
		description: string,
		source: string,
		csv: string,
		opts?: CalendarOpts
	): Calendar {
		return new Calendar(
			name,
			description,
			'Europe/Madrid',
			csv
				// Split rows
				.split('\n')
				// Remove header
				.slice(2, -1)
				.map((event) => {
					// Split fields
					const fields = event.split(',').map((field) => field.trim());
					return new CalEvent(
						fields[0],
						fields[5],
						fields[6],
						dayjs(`${fields[1]} ${fields[2]}`, 'DD/MM/YYYY H.mm').toDate(),
						dayjs(`${fields[3]} ${fields[4]}`, 'DD/MM/YYYY H.mm').toDate()
					);
				}),
			source,
			opts
		);
	}

	toIcal() {
		return ical({
			name: this.name,
			description: this.description,
			source: this.source,
			timezone: this.timezone,
			prodId: {
				company: 'diegomcha',
				product: 'eiical',
				language: 'ES',
			},
			events: this.events.map((event) => ({
				id: event.uuid,
				start: event.start,
				end: event.end,
				created: event.created,
				summary: event.title,
				description: event.description,
				location: event.location,
				transparency: ICalEventTransparency.OPAQUE,
				busystatus: ICalEventBusyStatus.BUSY,
				lastModified: new Date(),
				status: ICalEventStatus.CONFIRMED,
				categories: [{ name: 'Clases EII' }],
				alarms: this.opts?.alerts?.map((time, i) => ({
					type: ICalAlarmType.display,
					triggerBefore: time * 60, // Minutes to seconds
					summary: `Recordatorio #${(i + 1).toString()} de ${event.title}`,
					description: `Recordatorio #${(i + 1).toString()} de ${event.title}`,
				})),
			})),
		});
	}
}
