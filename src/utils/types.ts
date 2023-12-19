export interface Env {
	eiical: KVNamespace;
}

export type Year = `${number}-${number}`;
export type Semester = 's1' | 's2';
export type User = `UO${number}`;
export type Alert = number;
export type ScheduleURL = string;

export type List = Record<User, ScheduleURL>;
