import Nullstack, { NullstackServerContext } from 'nullstack'
import Application from './src/Application'
import { icons } from './icons.json'
const context = Nullstack.start(Application) as NullstackServerContext

context.start = async function start() {
	const iconsList = new Map<string, string>()
	for (const icon of icons) {
		iconsList.set(icon.sizes.split('x')[0], `./${icon.src}`)
	}
	const { project } = context
	project.name = 'Hqist'
	project.icons = Object.fromEntries(iconsList)
	project.favicon = '/favicon.ico'
	project.color = '#202A37'
	project.backgroundColor = '#202A37'
	project.display = 'fullscreen'
	project.root = '/'
}

export default context