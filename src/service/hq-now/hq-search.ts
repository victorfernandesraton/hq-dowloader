import { HQInfo } from '../hq-search'
import { request } from './api'

type HqSearchResponse = {
	editoraId: number
	id: number
	impressionsCount: number
	name: string
	publisherName?: string
	status: 'Concluido'

}

export const getHqsService = async (query: string, signal?: AbortSignal): Promise<HQInfo[]> => {
	const body = {
		operationName: 'getHqsByName', variables: { name: query },
		query: 'query getHqsByName($name: String!) {\n  getHqsByName(name: $name) {\n    id\n    name\n    editoraId\n    status\n    publisherName\n    impressionsCount\n  }\n}\n'
	}
	const response = await request({
		method: 'POST',
		body: JSON.stringify(body),
		signal,
	})

	const { data } = await response.json()
	return data.getHqsByName.map((item: HqSearchResponse) => ({
		internalCode: item.id,
		name: item.name,
	}))
}
