import Nullstack, { NullstackClientContext, NullstackNode } from 'nullstack'
import '../tailwind.css'
import Installer from './components/installer'
import Home from './Home'

declare function Head(): NullstackNode

class Application extends Nullstack {

	prepare({ page }: NullstackClientContext) {
		page.locale = 'pt-BR'
	}

	renderHead() {
		return (
			<head>
				<link
					href="https://fonts.gstatic.com" rel="preconnect" />
				<link
					href="https://fonts.googleapis.com/css2?family=Crete+Round&family=Roboto&display=swap"
					rel="stylesheet" />
				<link rel="apple-touch-icon" href="apple-touch-icon.png.png"></link>
				<meta name="theme-color" content="#202A37" />

			</head>
		)
	}

	render() {
		return (
			<body class="bg-gray-800 text-black font-roboto">
				<Head />
				<Installer />
				<Home route="/" />
			</body>
		)
	}

}

export default Application