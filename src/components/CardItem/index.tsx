import Nullstack, { NullstackNode } from 'nullstack'
import { generatePdf } from '../../service/pdf/generate-pdf'
import { Chapter } from '../../types/chapter'
import { HQInfo } from '../../types/hqinfo.type'
import { parseTitle } from './utils'


declare function ButtonDowload(): NullstackNode

class CardItem extends Nullstack<HQInfo> {
	showChapters = false

	toggle() {
		this.showChapters = !this.showChapters
	}

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

	renderButtonDowload({ chapter, title = '' }) {
		return (
			<div>
				<p>{title}</p>
				<button onclick={() => {
					this.dowloadPdf(chapter)
				}}>Baixar</button>
			</div>
		)
	}

	render({ name, pages = [], cover }: HQInfo) {
		return (
			<div>
				<div>
					<img src={cover ?? pages?.[0]?.pages?.[0]} width={219} />
				</div>
				<p>
					{name}
				</p>
				{this.showChapters ? (
					<div>
						<button onclick={this.toggle}>Esconder</button>
						{pages.map((chapter: Chapter, index: number) => (
							<ButtonDowload
								title={parseTitle({
									chapter,
									index: index + 1,
									title: name
								})}
								chapter={chapter}
							/>
						))}
					</div>
				) : (
					<button onclick={this.toggle}>Listar capítulos</button>
				)}
			</div>
		)
	}
}

export default CardItem
