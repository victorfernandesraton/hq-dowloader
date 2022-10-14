import Nullstack, { NullstackNode } from 'nullstack'

type Props = {
	children?: NullstackNode,
	// eslint-disable-next-line @typescript-eslint/ban-types
	onClose: Function,
	title?: string
}
class Modal extends Nullstack<Props> {
	render({ children, onClose, title = ' ' }) {
		return (
			<dialog class="relative z-10 text-white" aria-labelledby="modal-title" role="dialog" aria-modal="true"
				open={true}
			>

				<div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

				<div class="fixed inset-0 z-10 overflow-y-auto">
					<div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
						<div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
							<div class='flex flex-col rounded-t-sm opacity-100 z-10 shadow-sm bg-slate-800 max-w-lg max-h-fit pb-2'>
								<div class='justify-between flex flex-row py-3 px-4 text-white'>
									<p>{title}</p>
									<button class='text-xs p-2' onclick={onClose}>
										X
									</button>
								</div>
								<div class='overflow-y-scroll px-6 py-2 text-white'>

									{children}
								</div>
							</div>
						</div>
					</div>
				</div>
			</dialog>
		)
	}
}
export default Modal