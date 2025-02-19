import CalEvent from './CalEvent';

interface CalendarOpts {
	alert?: number;
}

export default class Calendar {
	public title: string;
	public timezone: string;
	public events: CalEvent[];

	public opts: CalendarOpts | undefined;

	constructor(
		title: string,
		timezone: string,
		events: CalEvent[],
		opts?: CalendarOpts
	) {
		this.title = title;
		this.timezone = timezone;
		this.events = events;

		this.opts = opts;
	}
}
