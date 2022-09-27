import Nullstack, { NullstackServerContext } from 'nullstack'
import Application from './src/Application'

const context = Nullstack.start(Application) as NullstackServerContext

context.start = async function start() {
	const { project } = context
	project.icons = {
		'72': '/favicon-72x72.png',
		'128': '/favicon-128x128.png',
		'512': '/favicon-512x512.png'
	}
	project.favicon = '/favicon.ico'
	project.color = '#0a355c'
	project.backgroundColor = '#0a355c'
	project.display = 'standalone'
	project.root = '/'
}

export default context