import { HQInfo } from '../hq-search'
import { request } from './api'
import { gql, } from 'graphql-tag'
import { print } from 'graphql'
type HqSearchResponse = {
	editoraId: number
	id: number
	impressionsCount: number
	name: string
	publisherName?: string
	status: 'Concluido'

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
	return data.getHqsByName.map((item: HqSearchResponse) => ({
		internalCode: item.id,
		name: item.name,
	}))
}
