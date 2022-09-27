import Nullstack from 'nullstack'

class Installer extends Nullstack {

	installed = false
	hidden = false

	async prompt({ worker }) {
		try {

			worker.installation.prompt()
			const { outcome } = await worker.installation.userChoice
			if (outcome === 'accepted') {
				console.log('User accepted the A2HS prompt')
			} else {
				console.log('User dismissed the A2HS prompt')
			}
		} finally {
			this.hidden = true
		}
	}

	render({ worker, project }) {
		if (this.hidden) return false
		if (!worker.installation) return false
		return (
			<div>
				<img src={project.favicon} />
				<p> Do you want to add {project.name} to your home screen?</p>
				<button onclick={this.prompt}> Install </button>
				<button onclick={{ hidden: true }}> Not Now </button>
			</div>
		)
	}
}

export default Installer