import { Chapter } from '../../types/chapter'

interface PropsParseTitle {
	chapter: Chapter;
	title: string;
	index: number;
}
export const parseTitle = ({ chapter, title, index }: PropsParseTitle) => {
	if (chapter.name.trim() !== '') {
		return chapter.name
	}
	const final = chapter.number ?? index
	return `${title} - Volume ${final}`
}