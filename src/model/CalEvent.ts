import { v5 } from 'uuid';
import config from '../../config.json';

export default class CalEvent {
	public readonly created: Date;
	public get uuid(): string {
		return v5(this.title + this.start.toISOString(), config.namespace);
	}

	public title: string;
	public description: string;
	public location: string;

	public start: Date;
	public end: Date;

	constructor(
		title: string,
		description: string,
		location: string,
		start: Date,
		end: Date
	) {
		this.title = title;
		this.description = description;
		this.location = location;
		this.start = start;
		this.end = end;

		this.created = new Date();
	}
}
