import Nullstack, {
	FormEvent,
	NullstackClientContext,
} from 'nullstack'
import { HQInfo } from './types/hqinfo.type'
import { getHqsService } from './service/hq-now/hq-search'
import CardItem from './components/CardItem'

interface HomeProps {
	greeting: string;
}

type OnSearchProps = {
	event: FormEvent<HTMLInputElement>
}

class Home extends Nullstack<HomeProps> {
	called = false
	hqList: HQInfo[] = []
	error: Error | null = null
	loading = false
	prepare({ page }: NullstackClientContext<HomeProps>) {
		page.title = 'Hq Searcher'
		page.description = 'Find HQ and export as PDF'
	}


	getLocalStorageSearch(): Array<{ query: string, value: HQInfo[] }> {
		return JSON.parse(localStorage.getItem('query-history')) ?? []
	}

	async saveData({ query, data = [] }) {
		const history = await this.getLocalStorageSearch()
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

	async onSearch({ event }: OnSearchProps) {
		if (!this.loading) {
			this.loading = true
			const { value } = event.target
			try {
				const inStoreArray = await this.getLocalStorageSearch()
				const inStore = inStoreArray.find(item => item.query === value)
				console.log(inStore)
				if (inStore) {
					console.log(inStore.query, inStore.value)
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
	}

	render() {

		return (
			<section class="w-full max-w-8xl min-h-screen p-6 flex-col justify-center">
				<article class="w-full mb-5 md:px-20 sm:px-2 flex-col justfy-center">
					<form>
						<div class="bg-gray-900 rounded shadow-xss h-12 w-xl opacity-60">
							<label for="query"></label>
							<input
								placeholder='Digite algo para a buscar '
								class='w-full h-full px-2 bg-transparent text-gray-300'
								type="text"
								id="query"
								name="query"
								oninput={this.onSearch}
								debounce={500}
							/>
						</div>
					</form>
				</article>
				<article class='text-white'>
					<div class='grid lg:grid-cols-6 md:grid-cols-4 xl:gap-6 gap-4'>
						{this.hqList.map(item => <CardItem
							pages={item.pages}
							name={item.name}
							internalCode={item.internalCode}
						/>)}
					</div>
					{!this.loading && this.called && !this.hqList.length && (
						<div>Nenhum resultado encontrado</div>
					)}

				</article>
			</section>
		)
	}
}

export default Home
