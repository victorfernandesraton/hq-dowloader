import Nullstack, {
	FormEvent,
	NullstackClientContext,
} from 'nullstack'
import { HQInfo } from './types/hqinfo.type'
import { getHqsService } from './service/hq-now/hq-search'
import InputStyle from './Input.scss'
import { SearchItem } from './SearchResultItem'

interface HomeProps {
	greeting: string;
}

type OnSearchProps = {
	event: FormEvent<HTMLInputElement>
}

class Home extends Nullstack<HomeProps> {
	hqList: HQInfo[] = []
	error: Error | null = null
	prepare({ page }: NullstackClientContext<HomeProps>) {
		page.title = 'Hq Searcher'
		page.description = 'Find HQ and export as PDF'
	}

	async onSearch({ event }: OnSearchProps) {
		const query = event.target?.value
		try {
			const data = await getHqsService(query)
			this.hqList = data
		} catch (error) {
			this.error = error
		}
	}

	render() {
		return (
			<section class="w-full max-w-8xl min-h-screen p-6 flex-col justify-center">
				<article class="w-full mb-5 px-20 flex-col justfy-center">
					<form>
						<div class="bg-white rounded shadow-xl h-12 w-xl">
							<label for="query"></label>
							<input
								class='w-full h-full px-2'
								type="text"
								id="query"
								name="query"
								oninput={this.onSearch}
								debounce={500}
							/>
						</div>
					</form>
				</article>
				<article>
					{this.hqList.map(item => <SearchItem {...item} />)}
				</article>
			</section>
		)
	}
}

export default Home
