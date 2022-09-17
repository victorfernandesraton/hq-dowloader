import Nullstack, { NullstackClientContext, NullstackNode } from 'nullstack'
import { generatePdf } from './service/pdf/generate-pdf'
import { Chapter } from './types/chapter'
import { HQInfo } from './types/hqinfo.type'

type SearchItemProps = HQInfo

declare function ButtonDowload(): NullstackNode

class SearchResultItem extends Nullstack<HQInfo> {


	async dowloadPdf(chapter: Chapter) {
		await generatePdf(chapter)
	}

	renderButtonDowload(chapter: Chapter) {
		return (
			<div>
				<label>{chapter.id}</label>
				<button onclick={() => {
					this.dowloadPdf(chapter)
				}}>Baixar</button>
			</div>
		)
	}

	render({ name, pages = [] }: HQInfo) {
		return (
			<div>
				<p>

					{name}
					{pages.length}
				</p>
				<p>Listar capítulos</p>
				{pages.map(chapter => (
					<ButtonDowload  {...chapter} />
				))}
			</div>
		)
	}
}

export default SearchResultItem
