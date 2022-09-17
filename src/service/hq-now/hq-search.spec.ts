import { describe, it, expect } from '@jest/globals'
import { HqSearchResponse, parseResult } from './hq-search'
import { data } from './__test__/hq-search-dummy.json'
describe('hq-search', () => {
	describe('parse result', () => {
		it('should be a valid sandman hq', () => {
			const result = parseResult(data.getHqsByName as HqSearchResponse[])
			expect(result[0].name).toEqual('Especial do Sandman (2017)')
			expect(result[0].pages).toHaveLength(1)
			expect(result[0].pages[0].pages).toHaveLength(39)
		})
	})
})