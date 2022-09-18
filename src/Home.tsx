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

	async onSearch({ event }: OnSearchProps) {
		if (!this.loading) {

			this.loading = true
			const query = event.target?.value
			try {
				const data = await getHqsService(query)
				this.hqList = data
			} catch (error) {
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
