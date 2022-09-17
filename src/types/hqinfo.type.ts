import { Chapter } from './chapter'

export type HQInfo = {
	internalCode: string | number,
	name: string,
	url?: string,
	pages: Chapter[]
	cover?: string
}