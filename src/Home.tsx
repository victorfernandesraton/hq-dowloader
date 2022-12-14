import Nullstack, {
	NullstackClientContext,
} from 'nullstack'
import { HQInfo } from './types/hqinfo.type'
import { getHqsService } from './service/hq-now/hq-search'
import CardItem from './components/CardItem'
import { ShareButton } from './components/shareButton'

interface HomeProps {
	params?: {
		query?: string
	}
}

type OnSearchProps = {
	event: HTMLFormElement
}

class Home extends Nullstack<HomeProps> {
	called = false
	hqList: HQInfo[] = []
	error: Error | null = null
	loading = false
	query = ''

	prepare({ page }: NullstackClientContext<HomeProps>) {
		page.title = 'Hqist - HQ\'s traduzidos em PDF'
		page.description = 'Encontre seus HQ\'s favoritos e baixe em PDF'
	}


	async storeForSearch(): Promise<Array<{ query: string, value: HQInfo[] }>> {
		return JSON.parse(localStorage.getItem('query-history')) ?? []
	}

	async saveData({ query, data = [] }) {
		const history = await this.storeForSearch()
		if (history) {
			if (history.length > 5) {
				history.shift()
			}
			history.push({
				query, value: data
			})
			await localStorage.setItem('query-history', JSON.stringify([...history]))
		} else {
			await localStorage.setItem('query-history', JSON.stringify([{ query: query, value: data }]))
		}
		return
	}

	async _executeSearch(value: string) {
		try {
			const inStoreArray = await this.storeForSearch()
			const inStore = inStoreArray.find(item => item.query === value)
			if (inStore) {
				this.hqList = inStore.value
				return
			} else {
				const data = await getHqsService(value)
				await this.saveData({ query: value, data })
				this.hqList = data
				return
			}
		} catch (error) {
			console.log(error)
			this.error = error
		} finally {
			this.loading = false
			this.called = true
		}
	}


	async onSearch({ event }: OnSearchProps) {
		event.preventDefault()
		if (!this.loading) {
			const formData = new FormData(event.target)
			this.loading = true
			const value = formData.get('query').toString()
			this.query = value
			await this._executeSearch(value)
		}
	}


	async initiate({ params }: NullstackClientContext<HomeProps>) {
		if (!this.loading && params.query) {
			const value = params.query
			this.query = value
			await this._executeSearch(value)
		}
	}

	render() {

		return (
			<section class="w-full max-w-8xl min-h-screen p-6 flex-col justify-center">
				<article class="sticky top-2 w-full mb-5 md:px-20 sm:px-2 flex-col justfy-center text-xs xl:text-xl">
					<form onsubmit={this.onSearch}>
						<div class='flex flex-row justify-evenly w-full h-8 xl:h-12'>
							<div class="bg-gray-900 mr-2 rounded shadow-xss w-full">
								<label for="query"></label>
								<input
									placeholder='Digite algo para a buscar '
									class='w-full h-full px-4 bg-transparent text-gray-300'
									type="text"
									id="query"
									value={this.query}
									name="query"
								/>
							</div>
							{this.hqList.length > 0 && (
								<ShareButton query={this.query} disabled={this.loading} />
							)}
							<button
								type="submit"
								disabled={this.loading}
								class="width-auto h-8 xl:h-12 px-2 border border-gray-700 bg-sky-500 text-white rounded shadow-xss transition duration-500 ease select-none hover:bg-gray-800 focus:outline-none focus:shadow-outline"
							>
								{this.loading ? 'Enviado..' : 'Enviar'}
							</button>
						</div>
					</form>
				</article>
				<article class='text-white'>
					<div class='px-10 md:px-20'>
						{this.query !== '' && (
							<p class='color-gray-200 opacity-30'>Resultado para "{this.query}"</p>
						)}
						{this.hqList.length > 0 && !this.loading && (
							<div class='grid lg:grid-cols-5 xl:grid-cols-6 md:grid-cols-3 xl:gap-6 gap-4 grid-flow-dense	'>
								{this.hqList.map(item => <CardItem
									pages={item.pages}
									name={item.name}
									internalCode={item.internalCode}
								/>)}
							</div>
						)}
						{!this.loading && !this.hqList.length && (
							<div class='flex align-center align-middle text-center justify-center h-[80vh]'>
								<p class='self-center color-gray-200 opacity-30 text-xl md:text-5xl'>
									{this.called ? 'Nenhum resultado encontrado' : 'Pesquise por algo'}
								</p>
							</div>
						)}
					</div>
				</article>
			</section>
		)
	}
}

export default Home
