import Nullstack, { NullstackClientContext, NullstackNode } from 'nullstack'

interface Props {
	query: string;
	disabled: boolean
}

export class ShareButton extends Nullstack<Props> {

	query = ''
	initiate({ query }: NullstackClientContext<Props>) {
		this.query = query
	}
	async _onShare(data: ShareData) {
		try {
			await window.navigator.share(data)
		} catch (err) {
			alert('Não foi possivel compartilhar')
		}
	}


	render({ disabled = false, query = '' }: NullstackClientContext<Props>): NullstackNode {

		const data = {
			title: `Hqist - ${query}`,
			text: `HQ's traduzidos - ${query}`,
			url: `/?query=${query}`
		}
		if (!window?.navigator?.canShare?.(data)) {
			return <></>
		}

		return (
			<button
				disabled={disabled}
				type='button'
				onclick={() => {
					this._onShare(data)
				}}
				class="width-auto h-8 xl:h-12 px-2 border border-gray-700 bg-pink-500 text-white rounded shadow-xss transition duration-500 ease select-none hover:bg-gray-800 focus:outline-none focus:shadow-outline"
			>
				Compartilhar
			</button>
		)
	}
}