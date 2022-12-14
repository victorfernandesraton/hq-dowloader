import Nullstack, { NullstackNode } from 'nullstack'
import { generatePdf } from '../../service/pdf/generate-pdf'
import { Chapter } from '../../types/chapter'
import { HQInfo } from '../../types/hqinfo.type'
import Modal from '../modal'
import { parseTitle } from './utils'


declare function ButtonDowload(): NullstackNode
declare function ActionButton(): NullstackNode

class CardItem extends Nullstack<HQInfo> {
	showChapters = false
	isLoading = false
	currentDowload = 0

	toggle() {
		this.showChapters = !this.showChapters
	}

	async _dowloadPdf(chapter: Chapter, title?: string): Promise<void> {
		if (!this.isLoading) {
			this.currentDowload = chapter.id
			this.isLoading = true
			const downloadLink = document.createElement('a')
			downloadLink.target = '_blank'
			downloadLink.download = `${title ?? chapter.name ?? chapter.id ?? chapter.number}`
			const data = await generatePdf(chapter)

			const blob = new Blob([data], {
				type: 'application/pdf'
			})
			const url = URL.createObjectURL(blob)

			downloadLink.href = url


			document.body.append(downloadLink)

			downloadLink.click()
			this.isLoading = false
		}
	}

	renderButtonDowload({ chapter, title = '', disabled = false, ...rest }) {
		return (


			<div class='flex flex-row justify-between my-2 items-center'>
				<div class='flex w-40'>
					<p class="text-sm">{title}</p>
				</div>
				<a
					download={`${title}.pdf`}
					class={`${disabled ? 'bg-green-200' : 'bg-green-700'} px-2 py-2 font-semibold text-sm text-white rounded-md shadow-sm opacity-100`} onclick={() => {
						this._dowloadPdf(chapter, title)
					}} {...rest}>Baixar</a>
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
			<div class='w-full rounded-b'>
				<div class='w-full xl:h-64 md:h-48 sm:h-64 h-64'>
					<img src={cover ?? pages?.[0]?.pages?.[0]} class='w-full block rounded-b object-cover h-full'
						loading='lazy'
					/>
				</div>
				<div class='flex break-all h-12 text-sm overflow-hidden text-ellipsis flex-wrap'>
					{name}
				</div>
				<ActionButton onclick={this.toggle} disabled={this.isLoading}>Listar cap??tulos</ActionButton>
				{this.showChapters && (
					<Modal
						onClose={this.toggle}
						title={name}
					>
						<div class='max-h-80'>
							{pages.map((chapter: Chapter, index: number) => (
								<ButtonDowload
									title={parseTitle({
										chapter,
										index: index + 1,
										title: name
									})}
									onClose={() => this.toggle}
									disabled={this.isLoading && this.currentDowload == chapter.id}
									chapter={chapter}
								/>
							))}
						</div>
					</Modal>
				)}
			</div>
		)
	}
}

export default CardItem
