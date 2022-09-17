import Nullstack, { NullstackNode } from 'nullstack'
import { generatePdf } from './service/pdf/generate-pdf'
import { Chapter } from './types/chapter'
import { HQInfo } from './types/hqinfo.type'


declare function ButtonDowload(): NullstackNode

class SearchResultItem extends Nullstack<HQInfo> {


	async dowloadPdf(chapter: Chapter) {
		const downloadLink = document.createElement('a')
		downloadLink.target = '_blank'
		downloadLink.download = 'name_to_give_saved_file.pdf'
		const data = await generatePdf(chapter)

		const blob = new Blob([data], {
			type: 'application/pdf'
		})
		const url = URL.createObjectURL(blob)

		downloadLink.href = url


		document.body.append(downloadLink)

		downloadLink.click()
	}

	renderButtonDowload(chapter: Chapter) {
		return (
			<div>
				<label>{chapter}</label>
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
