export interface Data {
	url: URL;
	year: `${number}-${number}`;
	semester: `s${number}`;
	user: `UO${number}`;
}

export type List = Record<`UO${number}`, string>;
