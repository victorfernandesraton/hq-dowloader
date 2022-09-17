import { HQInfo } from '../../types/hqinfo.type'
import { request } from './api'
import { gql, } from 'graphql-tag'
import { print } from 'graphql'
import { Chapter } from '../../types/chapter'

type HqSearchChapterPicturesResponse = {
	pictureUrl: string
}
type HqSearchChapterResponse = {
	name: string
	id: number
	pictures: HqSearchChapterPicturesResponse[]
}
export interface HqSearchResponse {
	editoraId: number
	id: number
	impressionsCount: number
	name: string
	publisherName?: string
	status: string
	capitulos: HqSearchChapterResponse[]
}

const GET_HEQ_QUERY = gql`
query getHqsByName($name: String!) {  
	getHqsByName(name: $name) {    
		id    
		name    
		editoraId    
		status    
		publisherName    
		impressionsCount 
		capitulos {
			name
			id
			pictures {
				pictureUrl
			}
		}
	}
}`

export const getHqsService = async (query: string, signal?: AbortSignal): Promise<HQInfo[]> => {
	const body = {
		operationName: 'getHqsByName', variables: { name: query },
		query: print(GET_HEQ_QUERY),
	}
	const response = await request({
		method: 'POST',
		body: JSON.stringify(body),
		signal,
	})

	const { data } = await response.json()
	return parseResult(data.getHqsByName)
}

export const parseResult = (data: HqSearchResponse[]) => {
	return data.map((item: HqSearchResponse) => {
		const chapters: Chapter[] = []
		for (const chapterItem of item.capitulos) {
			const pages: string[] = []
			chapterItem.pictures.forEach(picture => {
				pages.push(picture.pictureUrl)
			})

			chapters.push({
				id: chapterItem.id,
				name: chapterItem.name,
				pages
			})
		}
		return {
			name: item.name,
			internalCode: item.id,
			pages: chapters
		}
	})
}