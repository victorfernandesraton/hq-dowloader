import Nullstack, { NullstackNode } from 'nullstack'
import { generatePdf } from '../../service/pdf/generate-pdf'
import { Chapter } from '../../types/chapter'
import { HQInfo } from '../../types/hqinfo.type'
import { parseTitle } from './utils'


declare function ButtonDowload(): NullstackNode
declare function ActionButton(): NullstackNode

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

	renderActionButton({ children, onclick, ...rest }) {
		return (
			<button class='px-4 py-2 font-semibold text-sm bg-sky-500/75 text-white rounded-md shadow-sm opacity-100' onclick={onclick}
				{...rest}
			>
				{children}
			</button>
		)
	}



	render({ name, pages = [], cover }: HQInfo) {
		return (
			<div class='w-full block rounded-b'>
				<div class=''>
					<img src={cover ?? pages?.[0]?.pages?.[0]} class='w-full block rounded-b' />
				</div>
				<p class='text-md sm:text-xs'>
					{name}
				</p>
				{this.showChapters ? (
					<div>
						<ActionButton
							onclick={this.toggle}>Esconder</ActionButton>
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
					<ActionButton onclick={this.toggle}>Listar capítulos</ActionButton>
				)}
			</div>
		)
	}
}

export default CardItem
