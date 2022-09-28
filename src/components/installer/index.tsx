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
			<div class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">

				<div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

				<div class="fixed inset-0 z-10 overflow-y-auto">
					<div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
						<div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
							<div class="bg-gray-700 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
								<div class="sm:flex sm:items-start">
									<img src={project.favicon} class="mx-auto flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-transparent-100 sm:mx-0 sm:h-10 sm:w-10" />
									<div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
										<h3 class="text-lg font-medium leading-6 text-white" id="modal-title">Instalar aplicativo</h3>
										<div class="mt-2">
											<p class="text-sm text-white">Seu dispositivo permite instalar o aplicativo como atalho no menu inicial<br></br> <br></br> Dsesja continuar?</p>
										</div>
									</div>
								</div>
							</div>
							<div class="bg-gray-800 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
								<button
									onclick={this.prompt}
									type="button" class="inline-flex w-full justify-center rounded-md border border-transparent bg-sky-500 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm">Instalar</button>
								<button
									onclick={() => {
										this.hidden = false
									}}
									type="button" class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-gray px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">Agora não</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default Installer